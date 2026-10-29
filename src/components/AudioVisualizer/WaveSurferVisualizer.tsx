import React, { useEffect, useRef, useState } from "react";
import { Box, useTheme, SxProps, Theme, CircularProgress } from "@mui/material";
import WaveSurfer from "wavesurfer.js";
import { resolveAccentColor } from "../../utils/theme";
import { generateDeterministicPeaks } from "../../utils/wavePeaks";

export interface WaveSurferVisualizerProps {
  /** Target audio media element to sync with */
  mediaElement?: HTMLMediaElement | null;
  /** Audio URL to render waveform for */
  url?: string;
  /** Explicit precomputed waveform peaks */
  peaks?: number[];
  /** Track duration in seconds */
  duration?: number;
  /** Accent color (MUI palette color or hex) */
  accentColor?: string;
  /** Height of waveform canvas in pixels (default 48) */
  height?: number;
  /** Bar width in pixels (default 2) */
  barWidth?: number;
  /** Gap between bars in pixels (default 2) */
  barGap?: number;
  /** Bar border radius (default 2) */
  barRadius?: number;
  /** Wave color (unplayed portion) */
  waveColor?: string;
  /** Progress color (played portion) */
  progressColor?: string;
  /** Cursor color */
  cursorColor?: string;
  /** Allow clicking on waveform to seek */
  interactive?: boolean;
  /** Callback when user clicks on waveform to seek */
  onSeek?: (time: number) => void;
  /** Custom SX styling */
  sx?: SxProps<Theme>;
}

export const WaveSurferVisualizer: React.FC<WaveSurferVisualizerProps> = ({
  mediaElement,
  url,
  peaks: explicitPeaks,
  duration,
  accentColor = "primary",
  height = 48,
  barWidth = 2,
  barGap = 2,
  barRadius = 2,
  waveColor,
  progressColor,
  cursorColor,
  interactive = true,
  onSeek,
  sx,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const theme = useTheme();

  const resolvedAccent = resolveAccentColor(theme, accentColor);
  const defaultProgressColor = progressColor || resolvedAccent;
  const defaultWaveColor =
    waveColor ||
    (theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.22)"
      : "rgba(0, 0, 0, 0.18)");
  const defaultCursorColor = cursorColor || resolvedAccent;

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;

    const audioSource = url || mediaElement?.src;
    if (!audioSource && !mediaElement && !explicitPeaks) return;

    setIsLoading(true);

    let ws: WaveSurfer | null = null;
    let isCancelled = false;

    const initWaveSurfer = (peaksToUse?: number[]) => {
      if (isCancelled || !containerRef.current) return;

      try {
        if (ws) {
          ws.destroy();
        }

        const effectiveDuration = duration || mediaElement?.duration || 180;
        const finalPeaks = peaksToUse || explicitPeaks;

        ws = WaveSurfer.create({
          container: containerRef.current,
          height,
          barWidth,
          barGap,
          barRadius,
          waveColor: defaultWaveColor,
          progressColor: defaultProgressColor,
          cursorColor: defaultCursorColor,
          cursorWidth: 2,
          interact: interactive,
          media: mediaElement || undefined,
          url: finalPeaks ? undefined : (mediaElement ? undefined : url),
          peaks: finalPeaks ? [finalPeaks] : undefined,
          duration: finalPeaks ? effectiveDuration : undefined,
        });

        waveSurferRef.current = ws;

        ws.on("ready", () => {
          if (!isCancelled) setIsLoading(false);
        });

        ws.on("error", (err) => {
          console.warn("WaveSurfer encountered network/CORS error, falling back to precomputed wave peaks:", err);
          // If fetch fails (e.g. CORS), gracefully fallback to deterministic peaks so waveform always displays
          if (!peaksToUse && !isCancelled) {
            const fallbackPeaks = generateDeterministicPeaks(audioSource || "audio", 120);
            initWaveSurfer(fallbackPeaks);
          } else {
            if (!isCancelled) setIsLoading(false);
          }
        });

        if (onSeek) {
          ws.on("interaction", (newTime: number) => {
            onSeek(newTime);
          });
        }
      } catch (err) {
        console.warn("WaveSurfer creation fallback:", err);
        if (!peaksToUse && !isCancelled) {
          const fallbackPeaks = generateDeterministicPeaks(audioSource || "audio", 120);
          initWaveSurfer(fallbackPeaks);
        } else {
          if (!isCancelled) setIsLoading(false);
        }
      }
    };

    // If explicit peaks are provided, render immediately without network request
    if (explicitPeaks) {
      initWaveSurfer(explicitPeaks);
    } else {
      initWaveSurfer();
    }

    return () => {
      isCancelled = true;
      try {
        if (ws) {
          ws.destroy();
        }
      } catch {
        // Ignored on teardown
      }
      waveSurferRef.current = null;
    };
  }, [
    mediaElement,
    url,
    explicitPeaks,
    duration,
    height,
    barWidth,
    barGap,
    barRadius,
    defaultWaveColor,
    defaultProgressColor,
    defaultCursorColor,
    interactive,
    onSeek,
  ]);

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        minHeight: height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...sx,
      }}
    >
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            gap: 1,
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <CircularProgress size={16} sx={{ color: resolvedAccent }} />
        </Box>
      )}
      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          opacity: isLoading ? 0.4 : 1,
          transition: "opacity 0.25s ease",
          "& ::part(cursor)": {
            borderRadius: 1,
          },
        }}
      />
    </Box>
  );
};

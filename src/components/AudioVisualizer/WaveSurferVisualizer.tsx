import React, { useEffect, useRef, useState } from "react";
import { Box, useTheme, SxProps, Theme, Typography, CircularProgress } from "@mui/material";
import WaveSurfer from "wavesurfer.js";
import { resolveAccentColor } from "../../utils/theme";

export interface WaveSurferVisualizerProps {
  /** Target audio media element to sync with */
  mediaElement?: HTMLMediaElement | null;
  /** Audio URL to render waveform for */
  url?: string;
  /** Accent color (MUI palette color or hex) */
  accentColor?: string;
  /** Height of waveform canvas in pixels (default 64) */
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
  accentColor = "primary",
  height = 64,
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
  const [loadError, setLoadError] = useState<boolean>(false);
  const theme = useTheme();

  const resolvedAccent = resolveAccentColor(theme, accentColor);
  const defaultProgressColor = progressColor || resolvedAccent;
  const defaultWaveColor =
    waveColor ||
    (theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.25)"
      : "rgba(0, 0, 0, 0.2)");
  const defaultCursorColor = cursorColor || resolvedAccent;

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;

    const audioSource = url || mediaElement?.src;
    if (!audioSource && !mediaElement) return;

    setIsLoading(true);
    setLoadError(false);

    let ws: WaveSurfer | null = null;

    try {
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
        url: mediaElement ? undefined : url,
      });

      waveSurferRef.current = ws;

      ws.on("ready", () => {
        setIsLoading(false);
      });

      ws.on("error", (err) => {
        console.warn("WaveSurfer loading error:", err);
        setLoadError(true);
        setIsLoading(false);
      });

      if (onSeek) {
        ws.on("interaction", (newTime: number) => {
          onSeek(newTime);
        });
      }
    } catch (err) {
      console.warn("Failed to initialize WaveSurfer:", err);
      setLoadError(true);
      setIsLoading(false);
    }

    return () => {
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

  if (loadError) {
    return null; // Gracefully fallback if audio decoding is unsupported or blocked by CORS
  }

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
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Generating waveform...
          </Typography>
        </Box>
      )}
      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          opacity: isLoading ? 0.3 : 1,
          transition: "opacity 0.3s ease",
        }}
      />
    </Box>
  );
};

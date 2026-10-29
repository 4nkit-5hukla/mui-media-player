import React, { useRef, useState, useEffect, useCallback } from "react";
import { Box, useTheme, Typography, SxProps, Theme, Fade } from "@mui/material";
import { resolveAccentColor } from "../../utils/theme";
import { formatTime } from "../../utils/formatTime";
import { generateDeterministicPeaks } from "../../utils/wavePeaks";

export interface WaveformSeekbarProps {
  /** Current playback time in seconds */
  currentTime: number;
  /** Total media duration in seconds */
  duration: number;
  /** Buffered end time in seconds */
  bufferedEnd?: number;
  /** Callback when user seeks by clicking or dragging */
  onSeek: (time: number) => void;
  /** Optional audio URL or seed for deterministic waveform */
  url?: string;
  /** Explicit precomputed peaks array (normalized 0..1) */
  peaks?: number[];
  /** Accent color (MUI palette color or hex) */
  accentColor?: string;
  /** Height in pixels (default 36) */
  height?: number;
  /** Bar width in pixels (default 3) */
  barWidth?: number;
  /** Gap between bars in pixels (default 2) */
  barGap?: number;
  /** Bar border radius (default 2) */
  barRadius?: number;
  /** Custom container styling */
  sx?: SxProps<Theme>;
}

export const WaveformSeekbar: React.FC<WaveformSeekbarProps> = ({
  currentTime,
  duration,
  bufferedEnd = 0,
  onSeek,
  url,
  peaks: explicitPeaks,
  accentColor = "primary",
  height = 36,
  barWidth = 3,
  barGap = 2,
  barRadius = 2,
  sx,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragTime, setDragTime] = useState<number | null>(null);
  const theme = useTheme();

  const resolvedAccent = resolveAccentColor(theme, accentColor);
  const effectiveTime = dragTime !== null ? dragTime : currentTime;
  const progressRatio = duration > 0 ? Math.min(1, Math.max(0, effectiveTime / duration)) : 0;
  const bufferedRatio = duration > 0 ? Math.min(1, Math.max(0, bufferedEnd / duration)) : 0;

  // Generate or use deterministic peaks
  const peaks = explicitPeaks || generateDeterministicPeaks(url || duration || 42, 160);

  // Draw waveform canvas
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const width = container.clientWidth;
    if (width <= 0) return;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const step = barWidth + barGap;
    const barCount = Math.floor(width / step);
    const middleY = height / 2;

    const unplayedColor =
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.22)"
        : "rgba(0, 0, 0, 0.16)";
    const bufferedColor =
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.4)"
        : "rgba(0, 0, 0, 0.3)";

    for (let i = 0; i < barCount; i++) {
      const x = i * step;
      const barRatio = i / barCount;
      const peakIndex = Math.floor((i / barCount) * peaks.length);
      const rawPeak = peaks[peakIndex] || 0.4;
      const barHeight = Math.max(4, rawPeak * (height - 8));
      const y = middleY - barHeight / 2;

      // Color based on playback progress
      if (barRatio <= progressRatio) {
        ctx.fillStyle = resolvedAccent;
      } else if (barRatio <= bufferedRatio) {
        ctx.fillStyle = bufferedColor;
      } else {
        ctx.fillStyle = unplayedColor;
      }

      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, y, barWidth, barHeight, barRadius);
      } else {
        ctx.rect(x, y, barWidth, barHeight);
      }
      ctx.fill();
    }

    // Draw active cursor line
    const cursorX = progressRatio * width;
    ctx.fillStyle = resolvedAccent;
    ctx.beginPath();
    ctx.rect(Math.max(0, cursorX - 1), 0, 2, height);
    ctx.fill();

    // Draw hover preview line if hovered
    if (hoverTime !== null && !isDragging) {
      ctx.fillStyle = theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.5)";
      ctx.beginPath();
      ctx.rect(Math.max(0, hoverX - 1), 0, 1.5, height);
      ctx.fill();
    }
  }, [
    peaks,
    height,
    barWidth,
    barGap,
    barRadius,
    progressRatio,
    bufferedRatio,
    resolvedAccent,
    theme.palette.mode,
    hoverTime,
    hoverX,
    isDragging,
  ]);

  useEffect(() => {
    drawWaveform();
  }, [drawWaveform]);

  // Handle ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      drawWaveform();
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, [drawWaveform]);

  // Calculate target time from pointer position
  const getTimeFromPointer = useCallback(
    (clientX: number): { time: number; x: number } => {
      if (!containerRef.current || duration <= 0) return { time: 0, x: 0 };
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const ratio = x / rect.width;
      const time = Math.round(ratio * duration * 100) / 100;
      return { time, x };
    },
    [duration]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    const { time, x } = getTimeFromPointer(e.clientX);
    setDragTime(time);
    setHoverTime(time);
    setHoverX(x);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const { time, x } = getTimeFromPointer(e.clientX);
    setHoverTime(time);
    setHoverX(x);
    if (isDragging) {
      setDragTime(time);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      const { time } = getTimeFromPointer(e.clientX);
      setIsDragging(false);
      setDragTime(null);
      onSeek(time);
    }
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored if capture already lost
    }
  };

  const handlePointerLeave = () => {
    if (!isDragging) {
      setHoverTime(null);
    }
  };

  return (
    <Box
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      sx={{
        width: "100%",
        height,
        position: "relative",
        cursor: "pointer",
        userSelect: "none",
        touchAction: "none",
        display: "flex",
        alignItems: "center",
        borderRadius: 1,
        transition: "transform 0.15s ease",
        "&:hover": {
          transform: "scaleY(1.04)",
        },
        ...sx,
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height }} />

      {/* Floating Hover Time Pill */}
      <Fade in={hoverTime !== null}>
        <Box
          sx={{
            position: "absolute",
            left: Math.max(24, Math.min(hoverX, (containerRef.current?.clientWidth || 300) - 24)),
            bottom: "100%",
            transform: "translateX(-50%) translateY(-6px)",
            backgroundColor: "background.paper",
            color: "text.primary",
            px: 1,
            py: 0.25,
            borderRadius: 1,
            boxShadow: 2,
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: "0.75rem", fontVariantNumeric: "tabular-nums" }}>
            {formatTime(hoverTime ?? 0)}
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
};

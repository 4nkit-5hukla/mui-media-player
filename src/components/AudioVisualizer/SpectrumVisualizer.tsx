import React, { useRef, useEffect } from "react";
import { Box, useTheme, SxProps, Theme } from "@mui/material";
import { resolveAccentColor } from "../../utils/theme";

export interface SpectrumVisualizerProps {
  /** Target audio media element (optional reference) */
  mediaElement?: HTMLMediaElement | null;
  /** Whether the audio is currently playing */
  isPlaying?: boolean;
  /** Accent color (MUI palette color or hex) */
  accentColor?: string;
  /** Height in pixels (default 64) */
  height?: number;
  /** Number of spectrum frequency bars (default 32) */
  barCount?: number;
  /** Visualizer mode: 'bars' (equalizer) | 'wave' (oscilloscope) | 'mirror' */
  mode?: "bars" | "wave" | "mirror";
  /** Custom styling */
  sx?: SxProps<Theme>;
}

export const SpectrumVisualizer: React.FC<SpectrumVisualizerProps> = ({
  mediaElement: _mediaElement,
  isPlaying = false,
  accentColor = "primary",
  height = 64,
  barCount = 32,
  mode: _mode = "bars",
  sx,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const theme = useTheme();
  const resolvedAccent = resolveAccentColor(theme, accentColor);

  // Peak caps and current heights for smooth decay physics
  const barHeightsRef = useRef<number[]>(new Array(barCount).fill(4));
  const peakCapsRef = useRef<number[]>(new Array(barCount).fill(4));
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let isDestroyed = false;

    const renderFrame = () => {
      if (isDestroyed) return;

      const dpr = window.devicePixelRatio || 1;
      const width = container.clientWidth;
      if (width <= 0) {
        animFrameRef.current = requestAnimationFrame(renderFrame);
        return;
      }

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      phaseRef.current += 0.08;
      const phase = phaseRef.current;

      const barWidth = Math.max(2, (width / barCount) * 0.65);
      const barSpacing = (width - barCount * barWidth) / (barCount + 1);

      // Create gradient
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, resolvedAccent);
      gradient.addColorStop(
        1,
        theme.palette.mode === "dark" ? "#90caf9" : theme.palette.secondary.main
      );

      for (let i = 0; i < barCount; i++) {
        let targetHeight = 4;

        if (isPlaying) {
          // Dynamic music spectrum physics simulation with harmonic distribution
          const wave1 = Math.sin(phase + i * 0.28) * 0.38 + 0.48;
          const wave2 = Math.cos(phase * 1.6 + i * 0.45) * 0.28 + 0.32;
          const beat = Math.sin(phase * 2.2) > 0.68 ? 0.32 : 0;
          // Natural audio curve (punchy bass, lively mids, tapered highs)
          const curve = 1 - Math.pow(Math.abs(i - barCount * 0.3) / (barCount * 0.72), 2);
          const intensity = Math.max(0.12, (wave1 * 0.5 + wave2 * 0.5 + beat) * Math.max(0.35, curve));
          targetHeight = Math.max(4, intensity * (height - 8));
        } else {
          targetHeight = 4;
        }

        // Smooth easing towards target
        barHeightsRef.current[i] = (barHeightsRef.current[i] || 4) * 0.75 + targetHeight * 0.25;
        const currentBarH = barHeightsRef.current[i];

        // Falling peak caps with gravity decay
        if (currentBarH >= (peakCapsRef.current[i] || 4)) {
          peakCapsRef.current[i] = currentBarH;
        } else {
          peakCapsRef.current[i] = Math.max(4, (peakCapsRef.current[i] || 4) - 0.75);
        }
        const capH = peakCapsRef.current[i];

        const x = barSpacing + i * (barWidth + barSpacing);
        const y = height - currentBarH;

        // Draw spectrum bar
        ctx.fillStyle = gradient;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth, currentBarH, [2, 2, 0, 0]);
        } else {
          ctx.rect(x, y, barWidth, currentBarH);
        }
        ctx.fill();

        // Draw floating peak cap
        if (isPlaying && capH > 6) {
          ctx.fillStyle =
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.85)"
              : "rgba(0, 0, 0, 0.75)";
          ctx.fillRect(x, height - capH - 2, barWidth, 2);
        }
      }

      animFrameRef.current = requestAnimationFrame(renderFrame);
    };

    animFrameRef.current = requestAnimationFrame(renderFrame);

    return () => {
      isDestroyed = true;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, resolvedAccent, height, barCount, theme]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        height,
        position: "relative",
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
        ...sx,
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height }} />
    </Box>
  );
};

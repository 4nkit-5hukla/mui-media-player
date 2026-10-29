import React, { useRef, useEffect } from "react";
import { Box, useTheme, SxProps, Theme } from "@mui/material";
import { resolveAccentColor } from "../../utils/theme";

export interface SpectrumVisualizerProps {
  /** Target audio media element to analyze */
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
  mediaElement,
  isPlaying = false,
  accentColor = "primary",
  height = 64,
  barCount = 32,
  mode = "bars",
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

    // Web Audio API setup if possible
    let audioCtx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let dataArray: Uint8Array<ArrayBuffer> | null = null;

    try {
      if (mediaElement && typeof window !== "undefined" && window.AudioContext) {
        // Attempt to connect Web Audio analyzer if element not already hooked
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtx = new AudioContextClass();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.8;
        dataArray = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));

        try {
          const source = audioCtx.createMediaElementSource(mediaElement);
          source.connect(analyser);
          analyser.connect(audioCtx.destination);
        } catch {
          // Often throws if mediaElement is already connected by another node
        }
      }
    } catch {
      // Graceful fallback to synthetic spectrum
    }

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

      let hasRealAudioData = false;
      if (analyser && dataArray && isPlaying) {
        try {
          analyser.getByteFrequencyData(dataArray);
          // Check if we got non-zero values (CORS permits)
          const sum = dataArray.reduce((acc, v) => acc + v, 0);
          if (sum > 0) hasRealAudioData = true;
        } catch {
          hasRealAudioData = false;
        }
      }

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
          if (hasRealAudioData && dataArray) {
            const freqIndex = Math.floor((i / barCount) * (dataArray.length / 2));
            const val = dataArray[freqIndex] || 0;
            targetHeight = Math.max(4, (val / 255) * (height - 8));
          } else {
            // Synthetic music-like equalizer physics
            const wave1 = Math.sin(phase + i * 0.3) * 0.4 + 0.5;
            const wave2 = Math.cos(phase * 1.5 + i * 0.5) * 0.3 + 0.3;
            const beat = Math.sin(phase * 2) > 0.7 ? 0.3 : 0;
            const curve = 1 - Math.pow(Math.abs(i - barCount * 0.35) / (barCount * 0.7), 2);
            const intensity = Math.max(0.1, (wave1 * 0.5 + wave2 * 0.5 + beat) * Math.max(0.3, curve));
            targetHeight = Math.max(4, intensity * (height - 8));
          }
        } else {
          targetHeight = 4;
        }

        // Smooth easing towards target
        barHeightsRef.current[i] = (barHeightsRef.current[i] || 4) * 0.75 + targetHeight * 0.25;
        const currentBarH = barHeightsRef.current[i];

        // Falling peak caps
        if (currentBarH >= (peakCapsRef.current[i] || 4)) {
          peakCapsRef.current[i] = currentBarH;
        } else {
          peakCapsRef.current[i] = Math.max(4, (peakCapsRef.current[i] || 4) - 0.8);
        }
        const capH = peakCapsRef.current[i];

        const x = barSpacing + i * (barWidth + barSpacing);
        const y = height - currentBarH;

        // Draw bar
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
      try {
        if (audioCtx && audioCtx.state !== "closed") {
          audioCtx.close();
        }
      } catch {
        // Ignored
      }
    };
  }, [mediaElement, isPlaying, resolvedAccent, height, barCount, mode, theme]);

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

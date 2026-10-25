import { FC } from "react";
import { Box, keyframes } from "@mui/material";
import { styled } from "@mui/material/styles";
import { resolveAccentColor } from "../../utils/theme";

const waveAnimation = keyframes`
  0%, 100% {
    height: 6px;
  }
  50% {
    height: 24px;
  }
`;

const WaveContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 3,
  height: 28,
  padding: "0 6px",
});

const WaveBar = styled("span", {
  shouldForwardProp: (prop) => prop !== "isPlaying" && prop !== "delay" && prop !== "accentColor",
})<{ isPlaying: boolean; delay: number; accentColor?: string }>(({ theme, isPlaying, delay, accentColor }) => {
  const color = resolveAccentColor(theme, accentColor);

  return {
    display: "inline-block",
    width: 3,
    height: isPlaying ? 6 : 4,
    borderRadius: 2,
    backgroundColor: color,
    animation: isPlaying ? `${waveAnimation} 1.2s ease-in-out infinite` : "none",
    animationDelay: `${delay}s`,
    transition: "height 0.2s ease, opacity 0.2s ease",
    opacity: isPlaying ? 0.9 : 0.4,
  };
});

export interface AudioWaveProps {
  isPlaying: boolean;
  barCount?: number;
  accentColor?: string;
}

export const AudioWave: FC<AudioWaveProps> = ({ isPlaying, barCount = 12, accentColor }) => {
  const bars = Array.from({ length: barCount }, (_, i) => {
    // Stagger delays symmetrically or pseudorandomly
    const delay = ((i * 0.12) % 0.8).toFixed(2);
    return <WaveBar key={i} isPlaying={isPlaying} delay={Number(delay)} accentColor={accentColor} />;
  });

  return <WaveContainer aria-hidden="true">{bars}</WaveContainer>;
};

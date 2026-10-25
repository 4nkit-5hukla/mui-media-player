import { styled, alpha } from "@mui/material/styles";
import { Paper, Slider, Typography, Avatar } from "@mui/material";

export const AudioCardContainer = styled(Paper)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.background.paper, 0.85)
      : theme.palette.background.paper,
  backdropFilter: "blur(16px)",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 12px 40px rgba(0, 0, 0, 0.5)"
      : "0 12px 36px rgba(0, 0, 0, 0.08)",
  width: "100%",
  maxWidth: 480,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  outline: "none",
  "&:focus-visible": {
    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.45)}`,
  },
}));

export const AudioCompactContainer = styled(Paper)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(1.2, 2),
  borderRadius: theme.shape.borderRadius * 1.5,
  backgroundColor:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.background.paper, 0.85)
      : theme.palette.background.paper,
  backdropFilter: "blur(12px)",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  outline: "none",
  "&:focus-visible": {
    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.45)}`,
  },
}));

export const AudioFullContainer = styled(Paper)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2.5,
  backgroundColor:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.background.paper, 0.9)
      : theme.palette.background.paper,
  backdropFilter: "blur(20px)",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 20px 60px rgba(0, 0, 0, 0.6)"
      : "0 16px 48px rgba(0, 0, 0, 0.1)",
  width: "100%",
  maxWidth: 680,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  outline: "none",
  "&:focus-visible": {
    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.45)}`,
  },
}));

export const AudioArtwork = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== "isPlaying" && prop !== "size",
})<{ isPlaying?: boolean; size?: number }>(({ theme, isPlaying, size = 80 }) => ({
  width: size,
  height: size,
  borderRadius: theme.shape.borderRadius * 1.5,
  boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  transform: isPlaying ? "scale(1.02)" : "scale(1)",
}));

export const TrackTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.05rem",
  lineHeight: 1.3,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: theme.palette.text.primary,
}));

export const TrackArtist = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: "0.85rem",
  color: theme.palette.text.secondary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

export const AudioSlider = styled(Slider, {
  shouldForwardProp: (prop) => prop !== "bufferedEnd" && prop !== "duration",
})<{ bufferedEnd?: number; duration?: number }>(({ theme, bufferedEnd = 0, duration = 1 }) => {
  const bufferPercent = duration > 0 ? Math.min(100, Math.max(0, (bufferedEnd / duration) * 100)) : 0;

  return {
    height: 4,
    padding: "8px 0",
    "& .MuiSlider-rail": {
      opacity: theme.palette.mode === "dark" ? 0.25 : 0.35,
      // buffer bar
      "&::after": {
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: `${bufferPercent}%`,
        backgroundColor: alpha(theme.palette.text.primary, 0.18),
        borderRadius: "inherit",
        transition: "width 0.2s ease",
      },
    },
    "& .MuiSlider-track": {
      border: "none",
    },
    "& .MuiSlider-thumb": {
      height: 12,
      width: 12,
      backgroundColor: theme.palette.primary.main,
      transition: "transform 0.15s ease",
      "&:hover, &.Mui-focusVisible": {
        transform: "scale(1.3)",
        boxShadow: `0 0 0 6px ${alpha(theme.palette.primary.main, 0.25)}`,
      },
      "&.Mui-active": {
        transform: "scale(1.4)",
      },
    },
  };
});

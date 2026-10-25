import { styled, alpha } from "@mui/material/styles";
import { Box, Slider, Typography, Button, IconButton } from "@mui/material";
import { resolveAccentColor } from "../../utils/theme";

export const VideoContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "aspectRatio" && prop !== "isFullscreen",
})<{ aspectRatio?: string; isFullscreen?: boolean }>(({ theme, aspectRatio, isFullscreen }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#000000",
  borderRadius: isFullscreen ? 0 : theme.shape.borderRadius * 1.5,
  overflow: "hidden",
  outline: "none",
  userSelect: "none",
  width: "100%",
  aspectRatio: isFullscreen ? "unset" : aspectRatio === "auto" ? "auto" : aspectRatio || "16/9",
  maxHeight: isFullscreen ? "100vh" : "85vh",
  color: "#ffffff",
  "&:focus-visible": {
    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.6)}`,
  },
  "&:-webkit-full-screen": {
    width: "100vw",
    height: "100vh",
    borderRadius: 0,
  },
  "&:fullscreen": {
    width: "100vw",
    height: "100vh",
    borderRadius: 0,
  },
}));

export const VideoElement = styled("video")({
  width: "100%",
  height: "100%",
  objectFit: "contain",
  display: "block",
  backgroundColor: "#000000",
  cursor: "pointer",
});

export const TopOverlay = styled(Box, {
  shouldForwardProp: (prop) => prop !== "visible",
})<{ visible?: boolean }>(({ visible }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  padding: "16px 20px",
  background: "linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  zIndex: 10,
  opacity: visible ? 1 : 0,
  visibility: visible ? "visible" : "hidden",
  transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.25s",
  pointerEvents: visible ? "auto" : "none",
}));

export const VideoTitle = styled(Typography)({
  fontWeight: 600,
  fontSize: "0.95rem",
  color: "#ffffff",
  textShadow: "0 1px 3px rgba(0,0,0,0.8)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const CenterOverlay = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 8,
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const CenterPlayButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "accentColor",
})<{ accentColor?: string }>(({ theme, accentColor }) => {
  const color = resolveAccentColor(theme, accentColor);

  return {
    pointerEvents: "auto",
    width: 68,
    height: 68,
    backgroundColor: alpha(theme.palette.background.paper, 0.75),
    backdropFilter: "blur(8px)",
    color: theme.palette.getContrastText?.(theme.palette.background.paper) || "#ffffff",
    boxShadow: `0 8px 32px rgba(0,0,0,0.5)`,
    transition: "transform 0.15s ease-out, background-color 0.2s ease",
    "&:hover": {
      backgroundColor: alpha(color, 0.85),
      color: "#ffffff",
      transform: "scale(1.1)",
    },
  };
});

export const BottomOverlay = styled(Box, {
  shouldForwardProp: (prop) => prop !== "visible",
})<{ visible?: boolean }>(({ visible }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  padding: "16px 20px 12px 20px",
  background: "linear-gradient(0deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 70%, transparent 100%)",
  display: "flex",
  flexDirection: "column",
  gap: 8,
  zIndex: 10,
  opacity: visible ? 1 : 0,
  visibility: visible ? "visible" : "hidden",
  transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.25s",
  pointerEvents: visible ? "auto" : "none",
}));

export const SeekSlider = styled(Slider, {
  shouldForwardProp: (prop) => prop !== "bufferedEnd" && prop !== "duration",
})<{ bufferedEnd?: number; duration?: number }>(({ theme, bufferedEnd = 0, duration = 1 }) => {
  const bufferPercent = duration > 0 ? Math.min(100, Math.max(0, (bufferedEnd / duration) * 100)) : 0;

  return {
    height: 5,
    padding: "12px 0",
    color: theme.palette.primary.main,
    "& .MuiSlider-rail": {
      opacity: 0.35,
      backgroundColor: "#ffffff",
      // buffer pseudo-element
      "&::after": {
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: `${bufferPercent}%`,
        backgroundColor: "rgba(255,255,255,0.45)",
        borderRadius: "inherit",
        transition: "width 0.2s ease",
      },
    },
    "& .MuiSlider-track": {
      border: "none",
      transition: "none",
    },
    "& .MuiSlider-thumb": {
      height: 14,
      width: 14,
      backgroundColor: "#ffffff",
      border: `2px solid ${theme.palette.primary.main}`,
      boxShadow: "0 0 8px rgba(0,0,0,0.5)",
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

export const VolumeSlider = styled(Slider)({
  width: 70,
  height: 4,
  padding: "10px 0",
  color: "#ffffff",
  transition: "width 0.2s ease",
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 11,
    width: 11,
    backgroundColor: "#ffffff",
    "&:hover, &.Mui-focusVisible": {
      boxShadow: "0 0 0 5px rgba(255,255,255,0.25)",
    },
  },
  "& .MuiSlider-rail": {
    opacity: 0.3,
    backgroundColor: "#ffffff",
  },
});

export const SpeedMenuButton = styled(Button)({
  minWidth: 44,
  height: 30,
  padding: "2px 8px",
  fontSize: "0.78rem",
  fontWeight: 600,
  color: "#ffffff",
  border: "1px solid rgba(255,255,255,0.25)",
  borderRadius: 6,
  textTransform: "none",
  backgroundColor: "rgba(255,255,255,0.1)",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderColor: "rgba(255,255,255,0.4)",
  },
});

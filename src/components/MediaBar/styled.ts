import { styled, alpha } from "@mui/material/styles";
import { Paper, Slider } from "@mui/material";
import { MediaBarPosition } from "../../types/player";

export const MediaBarContainer = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "position",
})<{ position?: MediaBarPosition }>(({ theme, position = "bottom" }) => {
  const isFloating = position === "floating";
  const isTop = position === "top";

  return {
    position: "fixed",
    zIndex: theme.zIndex.appBar + 10,
    backgroundColor:
      theme.palette.mode === "dark"
        ? alpha(theme.palette.background.paper, 0.92)
        : alpha(theme.palette.background.paper, 0.96),
    backdropFilter: "blur(20px)",
    borderTop: isTop ? "none" : `1px solid ${theme.palette.divider}`,
    borderBottom: isTop ? `1px solid ${theme.palette.divider}` : "none",
    transition: "all 0.25s ease-in-out",

    ...(isFloating
      ? {
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100% - 48px)",
          maxWidth: 960,
          borderRadius: theme.shape.borderRadius * 3,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 12px 48px rgba(0,0,0,0.6)"
              : "0 12px 36px rgba(0,0,0,0.12)",
        }
      : isTop
      ? {
          top: 0,
          left: 0,
          right: 0,
          borderRadius: 0,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 32px rgba(0,0,0,0.5)"
              : "0 4px 24px rgba(0,0,0,0.08)",
        }
      : {
          bottom: 0,
          left: 0,
          right: 0,
          borderRadius: 0,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 -8px 32px rgba(0,0,0,0.5)"
              : "0 -4px 24px rgba(0,0,0,0.08)",
        }),
  };
});

export const TopEdgeSlider = styled(Slider, {
  shouldForwardProp: (prop) => prop !== "bufferedEnd" && prop !== "duration",
})<{ bufferedEnd?: number; duration?: number }>(({ theme, bufferedEnd = 0, duration = 1 }) => {
  const bufferPercent = duration > 0 ? Math.min(100, Math.max(0, (bufferedEnd / duration) * 100)) : 0;

  return {
    position: "absolute",
    top: -5,
    left: 0,
    right: 0,
    height: 3,
    padding: "6px 0",
    color: theme.palette.primary.main,
    zIndex: 2,
    "& .MuiSlider-rail": {
      opacity: 0.2,
      backgroundColor: theme.palette.text.primary,
      "&::after": {
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: `${bufferPercent}%`,
        backgroundColor: alpha(theme.palette.text.primary, 0.25),
        transition: "width 0.2s ease",
      },
    },
    "& .MuiSlider-track": {
      border: "none",
    },
    "& .MuiSlider-thumb": {
      width: 10,
      height: 10,
      transition: "opacity 0.15s ease, transform 0.15s ease",
      opacity: 0,
      "&:hover, &.Mui-focusVisible, &.Mui-active": {
        opacity: 1,
        transform: "scale(1.2)",
      },
    },
    "&:hover .MuiSlider-thumb": {
      opacity: 1,
    },
  };
});

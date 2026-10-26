import React, { useEffect, useState } from "react";
import { Box, Typography, SxProps, Theme } from "@mui/material";
import { SubtitleTrack, SubtitleCue } from "../../types/tracks";
import { parseVTTorSRT, findActiveSubtitleCue } from "../../utils/vttParser";

export interface VideoSubtitlesProps {
  subtitles?: SubtitleTrack[];
  activeSubtitleId?: string | null;
  currentTime: number;
  controlsVisible?: boolean;
  sx?: SxProps<Theme>;
}

export const VideoSubtitles: React.FC<VideoSubtitlesProps> = ({
  subtitles,
  activeSubtitleId,
  currentTime,
  controlsVisible = false,
  sx,
}) => {
  const [cuesCache, setCuesCache] = useState<Record<string, SubtitleCue[]>>({});

  const activeTrack = subtitles?.find((s) => s.id === activeSubtitleId);

  // Load and parse cues if not already cached
  useEffect(() => {
    if (!activeTrack) return;

    if (activeTrack.cues && activeTrack.cues.length > 0) {
      setCuesCache((prev) => ({
        ...prev,
        [activeTrack.id]: activeTrack.cues || [],
      }));
      return;
    }

    if (activeTrack.src && !cuesCache[activeTrack.id]) {
      fetch(activeTrack.src)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load subtitle file");
          return res.text();
        })
        .then((text) => {
          const parsed = parseVTTorSRT(text);
          setCuesCache((prev) => ({
            ...prev,
            [activeTrack.id]: parsed,
          }));
        })
        .catch((err) => {
          console.warn("Subtitle loading error for track:", activeTrack.id, err);
        });
    }
  }, [activeTrack, cuesCache]);

  if (!activeTrack) return null;

  const activeCues = cuesCache[activeTrack.id] || activeTrack.cues || [];
  const currentCue = findActiveSubtitleCue(activeCues, currentTime);

  if (!currentCue || !currentCue.text) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: controlsVisible ? 72 : 24,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 10,
        px: 2,
        transition: "bottom 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        ...sx,
      }}
    >
      <Box
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.82)",
          backdropFilter: "blur(4px)",
          color: "#ffffff",
          py: 0.75,
          px: 2,
          borderRadius: 2,
          maxWidth: "85%",
          textAlign: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
            lineHeight: 1.4,
            whiteSpace: "pre-line",
            textShadow: "0 1px 2px rgba(0,0,0,0.8)",
          }}
        >
          {currentCue.text}
        </Typography>
      </Box>
    </Box>
  );
};

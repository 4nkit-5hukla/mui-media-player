import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  useTheme,
  SxProps,
  Theme,
  Tooltip,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CloseIcon from "@mui/icons-material/Close";
import MicIcon from "@mui/icons-material/Mic";
import { AudioLyrics } from "../../types/tracks";
import { findActiveLyricIndex } from "../../utils/lrcParser";
import { resolveAccentColor } from "../../utils/theme";
import { LyricsEditorDialog } from "./LyricsEditorDialog";

export interface LyricsViewerProps {
  lyrics?: AudioLyrics | null;
  currentTime?: number;
  isPlaying?: boolean;
  onSeek?: (time: number) => void;
  onClose?: () => void;
  onLyricsChange?: (updatedLyrics: AudioLyrics) => void;
  accentColor?: string;
  sx?: SxProps<Theme>;
}

export const LyricsViewer: React.FC<LyricsViewerProps> = ({
  lyrics,
  currentTime = 0,
  isPlaying = false,
  onSeek,
  onClose,
  onLyricsChange,
  accentColor = "primary",
  sx,
}) => {
  const theme = useTheme();
  const resolvedAccent = resolveAccentColor(theme, accentColor);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const [editorOpen, setEditorOpen] = useState<boolean>(false);

  const lines = lyrics?.lines || [];
  const hasSyncedLines = lines.length > 0;
  const activeIndex = hasSyncedLines ? findActiveLyricIndex(lines, currentTime) : -1;

  // Auto-scroll to center the currently active lyric line
  useEffect(() => {
    if (activeLineRef.current && scrollContainerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeIndex]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        bgcolor: theme.palette.mode === "dark" ? "rgba(10, 15, 26, 0.95)" : "rgba(248, 250, 252, 0.95)",
        backdropFilter: "blur(16px)",
        borderRadius: "inherit",
        overflow: "hidden",
        ...sx,
      }}
    >
      {/* Top Header Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 1.5,
          borderBottom: 1,
          borderColor: "divider",
          zIndex: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <MicIcon sx={{ color: resolvedAccent, fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {lyrics?.title ? `${lyrics.title} - Lyrics` : "Lyrics"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Tooltip title="Edit or Synchronize Lyrics">
            <IconButton size="small" onClick={() => setEditorOpen(true)}>
              <EditNoteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {onClose && (
            <Tooltip title="Close Lyrics View">
              <IconButton size="small" onClick={onClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Lyrics Scrollable Area */}
      <Box
        ref={scrollContainerRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          py: 4,
          px: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          scrollBehavior: "smooth",
        }}
      >
        {hasSyncedLines ? (
          lines.map((line, idx) => {
            const isActive = idx === activeIndex;
            const isPassed = activeIndex !== -1 && idx < activeIndex;

            return (
              <Box
                key={idx}
                ref={isActive ? activeLineRef : null}
                onClick={() => onSeek && onSeek(line.time)}
                sx={{
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: isActive ? 1 : isPassed ? 0.6 : 0.35,
                  transform: isActive ? "scale(1.04)" : "scale(1)",
                  transformOrigin: "left center",
                  "&:hover": {
                    opacity: 0.9,
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: isActive ? 700 : 500,
                    fontSize: isActive ? "1.25rem" : "1.05rem",
                    color: isActive ? resolvedAccent : "text.primary",
                    textShadow: isActive
                      ? `0 0 16px ${resolvedAccent}66`
                      : "none",
                    lineHeight: 1.5,
                  }}
                >
                  {line.text}
                </Typography>
              </Box>
            );
          })
        ) : lyrics?.rawText ? (
          <Box sx={{ whiteSpace: "pre-wrap", textAlign: "left", lineHeight: 2 }}>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              {lyrics.rawText}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: 2,
              textAlign: "center",
              p: 3,
            }}
          >
            <MicIcon sx={{ fontSize: 48, color: "text.disabled" }} />
            <Typography variant="body2" color="text.secondary">
              No lyrics found for this track. You can add or synchronize lyrics now.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditNoteIcon />}
              onClick={() => setEditorOpen(true)}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Add Lyrics
            </Button>
          </Box>
        )}
      </Box>

      {/* Synchronize / Edit Dialog */}
      <LyricsEditorDialog
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        lyrics={lyrics}
        currentTime={currentTime}
        isPlaying={isPlaying}
        onSeek={onSeek}
        onSave={onLyricsChange}
        accentColor={accentColor}
      />
    </Box>
  );
};

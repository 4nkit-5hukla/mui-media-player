import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Tabs,
  Tab,
  Stack,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import TimerIcon from "@mui/icons-material/Timer";
import DownloadIcon from "@mui/icons-material/Download";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { AudioLyrics, LyricLine } from "../../types/tracks";
import { parseLRC, formatLRC, formatLrcTimestamp } from "../../utils/lrcParser";

export interface LyricsEditorDialogProps {
  open: boolean;
  onClose: () => void;
  lyrics?: AudioLyrics | null;
  currentTime?: number;
  isPlaying?: boolean;
  onSeek?: (time: number) => void;
  onSave?: (updatedLyrics: AudioLyrics) => void;
  accentColor?: string;
}

export const LyricsEditorDialog: React.FC<LyricsEditorDialogProps> = ({
  open,
  onClose,
  lyrics,
  currentTime = 0,
  isPlaying = false,
  onSeek,
  onSave,
  accentColor = "primary",
}) => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [rawText, setRawText] = useState<string>(() => (lyrics ? formatLRC(lyrics) : ""));
  const [lines, setLines] = useState<LyricLine[]>(() => lyrics?.lines || []);
  const [songTitle, setSongTitle] = useState<string>(lyrics?.title || "");
  const [songArtist, setSongArtist] = useState<string>(lyrics?.artist || "");
  const [activeLineIdx, setActiveLineIdx] = useState<number>(0);

  // Sync state if lyrics prop changes while opening
  React.useEffect(() => {
    if (open) {
      setRawText(lyrics ? formatLRC(lyrics) : "");
      setLines(lyrics?.lines || []);
      setSongTitle(lyrics?.title || "");
      setSongArtist(lyrics?.artist || "");
    }
  }, [open, lyrics]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 1 && tabIndex === 0) {
      // Switching from Raw Text to Sync Editor: parse text
      const parsed = parseLRC(rawText);
      if (parsed.lines && parsed.lines.length > 0) {
        setLines(parsed.lines);
      } else {
        // Convert plain text lines into initial un-synced lines
        const plainLines = rawText
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .map((text, idx) => ({ time: idx * 3, text }));
        setLines(plainLines);
      }
    } else if (newValue === 0 && tabIndex === 1) {
      // Switching from Sync Editor to Raw Text: format lines back to LRC
      setRawText(
        formatLRC({
          title: songTitle,
          artist: songArtist,
          lines,
        })
      );
    }
    setTabIndex(newValue);
  };

  const handleStampCurrentTime = () => {
    if (activeLineIdx >= lines.length) return;
    const updated = [...lines];
    updated[activeLineIdx] = {
      ...updated[activeLineIdx],
      time: Math.round(currentTime * 100) / 100,
    };
    updated.sort((a, b) => a.time - b.time);
    setLines(updated);
    setActiveLineIdx((prev) => Math.min(prev + 1, lines.length - 1));
  };

  const handleNudgeTime = (index: number, delta: number) => {
    const updated = [...lines];
    updated[index] = {
      ...updated[index],
      time: Math.max(0, Math.round((updated[index].time + delta) * 100) / 100),
    };
    updated.sort((a, b) => a.time - b.time);
    setLines(updated);
  };

  const handleLineTextChange = (index: number, newText: string) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], text: newText };
    setLines(updated);
  };

  const handleAddLine = () => {
    const newTime = Math.round(currentTime * 100) / 100;
    const updated = [...lines, { time: newTime, text: "New lyric line" }];
    updated.sort((a, b) => a.time - b.time);
    setLines(updated);
  };

  const handleDeleteLine = (index: number) => {
    const updated = lines.filter((_, idx) => idx !== index);
    setLines(updated);
    if (activeLineIdx >= updated.length) {
      setActiveLineIdx(Math.max(0, updated.length - 1));
    }
  };

  const handleSave = () => {
    let result: AudioLyrics;
    if (tabIndex === 0) {
      result = parseLRC(rawText);
      result.title = songTitle || result.title;
      result.artist = songArtist || result.artist;
      result.source = "user";
    } else {
      result = {
        title: songTitle,
        artist: songArtist,
        lines,
        rawText: formatLRC({ title: songTitle, artist: songArtist, lines }),
        source: "user",
      };
    }

    if (onSave) {
      onSave(result);
    }
    onClose();
  };

  const handleDownloadLRC = () => {
    const content = tabIndex === 0 ? rawText : formatLRC({ title: songTitle, artist: songArtist, lines });
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${songTitle || "lyrics"}.lrc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
        <Box>
          <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
            Lyrics & Synchronization Studio
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Inject, transcribe, and align synchronized lyrics with real-time playback
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} textColor="inherit">
          <Tab label="Raw Text / LRC Editor" />
          <Tab label="Interactive Synchronizer" />
        </Tabs>
      </Box>

      <DialogContent sx={{ minHeight: 380, display: "flex", flexDirection: "column", gap: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 1 }}>
          <TextField
            size="small"
            label="Song Title"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            fullWidth
          />
          <TextField
            size="small"
            label="Artist Name"
            value={songArtist}
            onChange={(e) => setSongArtist(e.target.value)}
            fullWidth
          />
        </Stack>

        {tabIndex === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
              Paste standard LRC formatted lyrics with timestamps e.g. [00:15.30] or paste plain text.
            </Typography>
            <TextField
              multiline
              rows={12}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="[00:04.20] First lyric line&#10;[00:08.50] Second lyric line..."
              fullWidth
              sx={{
                fontFamily: "monospace",
                "& textarea": { fontFamily: "monospace", fontSize: "0.875rem" },
              }}
            />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Live Synchronizer Control Header */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "action.hover",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Chip
                  color={isPlaying ? "success" : "default"}
                  label={isPlaying ? "Playing" : "Paused"}
                  size="small"
                />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Current Time: {formatLrcTimestamp(currentTime)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  color={accentColor as "primary"}
                  startIcon={<TimerIcon />}
                  onClick={handleStampCurrentTime}
                  disabled={lines.length === 0}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Stamp Time on Selected Line
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddLine}
                  sx={{ textTransform: "none" }}
                >
                  Add Line
                </Button>
              </Box>
            </Box>

            {/* Synchronized Lines List */}
            <Box
              sx={{
                maxHeight: 320,
                overflowY: "auto",
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                p: 1,
              }}
            >
              {lines.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ p: 3, textAlign: "center" }}>
                  No lyric lines found. Click "Add Line" or enter text in the Raw Text tab.
                </Typography>
              ) : (
                lines.map((line, idx) => (
                  <Box
                    key={idx}
                    onClick={() => setActiveLineIdx(idx)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1,
                      borderRadius: 1.5,
                      cursor: "pointer",
                      bgcolor: idx === activeLineIdx ? "action.selected" : "transparent",
                      border: idx === activeLineIdx ? 1 : 0,
                      borderColor: "primary.main",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <Tooltip title="Seek audio to timestamp">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSeek) onSeek(line.time);
                        }}
                      >
                        <PlayArrowIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Chip
                      size="small"
                      label={formatLrcTimestamp(line.time)}
                      sx={{ fontFamily: "monospace", minWidth: 84 }}
                    />

                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Button
                        size="small"
                        variant="text"
                        sx={{ minWidth: 28, p: 0.2, fontSize: "0.75rem" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNudgeTime(idx, -0.5);
                        }}
                      >
                        -0.5s
                      </Button>
                      <Button
                        size="small"
                        variant="text"
                        sx={{ minWidth: 28, p: 0.2, fontSize: "0.75rem" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNudgeTime(idx, 0.5);
                        }}
                      >
                        +0.5s
                      </Button>
                    </Box>

                    <TextField
                      size="small"
                      value={line.text}
                      onChange={(e) => handleLineTextChange(idx, e.target.value)}
                      fullWidth
                      sx={{
                        "& .MuiInputBase-input": { py: 0.5, fontSize: "0.875rem" },
                      }}
                    />

                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLine(idx);
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))
              )}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, justifyContent: "space-between" }}>
        <Button
          startIcon={<DownloadIcon />}
          onClick={handleDownloadLRC}
          sx={{ textTransform: "none" }}
        >
          Export .LRC
        </Button>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button onClick={onClose} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color={accentColor as "primary"}
            onClick={handleSave}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Save Lyrics
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  Paper,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Divider,
  List,
  TextField,
  InputAdornment,
  Chip,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef, ReactElement, Ref } from "react";
import {
  CloseRounded,
  SearchRounded,
  QueueMusicRounded,
  PlayCircleFilledWhiteRounded,
  ShuffleRounded,
  RepeatRounded,
  RepeatOneRounded,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";

import { PlaylistProvider, usePlaylistContext } from "../../context/PlaylistContext";
import { MediaPlayer } from "../MediaPlayer";
import { PlaylistItemRow } from "../Playlist/PlaylistItemRow";
import { MediaCenterProps } from "./types";

const SlideUp = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MediaCenterContent: FC<Omit<MediaCenterProps, "playlist" | "initialIndex">> = ({
  onClose,
  title = "Media Center",
  headerActions,
  autoPlay = true,
  ...mediaPlayerProps
}) => {
  const playlist = usePlaylistContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSideQueue, setShowSideQueue] = useState(true);

  const items = playlist?.items || [];
  const currentIndex = playlist?.currentIndex ?? 0;
  const currentItem = playlist?.currentItem;

  const filteredItems = items.filter((it) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      it.title.toLowerCase().includes(q) ||
      it.artist?.toLowerCase().includes(q) ||
      it.album?.toLowerCase().includes(q)
    );
  });

  const renderRepeatIcon = () => {
    if (playlist?.repeatMode === "one") {
      return <RepeatOneRounded fontSize="small" color="primary" />;
    }
    if (playlist?.repeatMode === "all") {
      return <RepeatRounded fontSize="small" color="primary" />;
    }
    return <RepeatRounded fontSize="small" sx={{ opacity: 0.5 }} />;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        maxHeight: "90vh",
        backgroundColor: "background.paper",
        overflow: "hidden",
      }}
    >
      {/* Media Center Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 1.8,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          backgroundColor: (theme) => alpha(theme.palette.background.default, 0.6),
          backdropFilter: "blur(12px)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <PlayCircleFilledWhiteRounded color="primary" sx={{ fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.15rem" }}>
            {title}
          </Typography>
          {currentItem && (
            <Chip
              size="small"
              label={`Now: ${currentItem.title}`}
              color="primary"
              variant="outlined"
              sx={{ display: { xs: "none", md: "inline-flex" }, maxWidth: 240 }}
            />
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {playlist && (
            <>
              <Tooltip title={playlist.isShuffle ? "Shuffle On" : "Shuffle Off"}>
                <IconButton
                  size="small"
                  onClick={() => playlist.toggleShuffle()}
                  sx={{ color: playlist.isShuffle ? "primary.main" : "text.secondary" }}
                >
                  <ShuffleRounded fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title={`Repeat: ${playlist.repeatMode}`}>
                <IconButton size="small" onClick={() => playlist.cycleRepeatMode()}>
                  {renderRepeatIcon()}
                </IconButton>
              </Tooltip>
            </>
          )}

          <Tooltip title={showSideQueue ? "Hide Playlist" : "Show Playlist"}>
            <IconButton
              size="small"
              onClick={() => setShowSideQueue((prev) => !prev)}
              color={showSideQueue ? "primary" : "default"}
            >
              <QueueMusicRounded fontSize="small" />
            </IconButton>
          </Tooltip>

          {headerActions}

          {onClose && (
            <Tooltip title="Close">
              <IconButton size="small" onClick={onClose} aria-label="close media center">
                <CloseRounded fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Main Split Body */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Left: Player Stage */}
        <Box
          sx={{
            flex: showSideQueue ? { xs: "none", md: "1 1 65%" } : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 1.5, sm: 3 },
            backgroundColor: "background.default",
            overflow: "auto",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 860 }}>
            <MediaPlayer autoPlay={autoPlay} {...mediaPlayerProps} />
          </Box>
        </Box>

        {/* Right: Integrated Playlist & Queue Panel */}
        {showSideQueue && (
          <Box
            sx={{
              width: { xs: "100%", md: 360 },
              borderLeft: (theme) => ({ xs: "none", md: `1px solid ${theme.palette.divider}` }),
              borderTop: (theme) => ({ xs: `1px solid ${theme.palette.divider}`, md: "none" }),
              display: "flex",
              flexDirection: "column",
              backgroundColor: "background.paper",
              overflow: "hidden",
              maxHeight: { xs: 260, md: "100%" },
            }}
          >
            {/* Search Box */}
            <Box sx={{ p: 1.5, pb: 1 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Search tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRounded fontSize="small" sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Divider />

            {/* List */}
            <Box sx={{ flex: 1, overflowY: "auto", p: 1.5 }}>
              {filteredItems.length === 0 ? (
                <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", py: 4 }}>
                  No tracks found
                </Typography>
              ) : (
                <List disablePadding>
                  {filteredItems.map((item, idx) => (
                    <PlaylistItemRow
                      key={item.id || idx}
                      item={item}
                      index={idx}
                      isActive={items[currentIndex]?.id === item.id}
                      onSelect={() => playlist?.playItem(item.id)}
                    />
                  ))}
                </List>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export const MediaCenter: FC<MediaCenterProps> = ({
  mode = "modal",
  open = false,
  onClose,
  playlist = [],
  initialIndex = 0,
  sx,
  className,
  style,
  ...props
}) => {
  const content = (
    <PlaylistProvider playlist={playlist} initialIndex={initialIndex}>
      <MediaCenterContent onClose={onClose} {...props} />
    </PlaylistProvider>
  );

  if (mode === "embedded") {
    return (
      <Paper
        elevation={4}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: (theme) => `1px solid ${theme.palette.divider}`,
          ...sx,
        }}
        className={className}
        style={style}
      >
        {content}
      </Paper>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slots={{ transition: SlideUp }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: 24,
            ...sx,
          },
        },
      }}
      className={className}
      style={style}
    >
      <DialogContent sx={{ p: 0 }}>{content}</DialogContent>
    </Dialog>
  );
};

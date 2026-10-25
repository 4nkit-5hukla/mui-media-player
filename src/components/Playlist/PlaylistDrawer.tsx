import { FC, useState, useMemo } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Button,
  Divider,
} from "@mui/material";
import {
  CloseRounded,
  SearchRounded,
  ShuffleRounded,
  RepeatRounded,
  RepeatOneRounded,
  QueueMusicRounded,
  DeleteSweepRounded,
} from "@mui/icons-material";

import { usePlaylistContext } from "../../context/PlaylistContext";
import { PlaylistItem } from "../../types/playlist";
import { PlaylistItemRow } from "./PlaylistItemRow";

export interface PlaylistDrawerProps {
  open: boolean;
  onClose: () => void;
  width?: number | string;
}

export const PlaylistDrawer: FC<PlaylistDrawerProps> = ({
  open,
  onClose,
  width = 340,
}) => {
  const playlist = usePlaylistContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [tabIndex, setTabIndex] = useState(0);

  const items = playlist?.items || [];
  const queue = playlist?.queue || [];
  const currentIndex = playlist?.currentIndex ?? 0;

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (it) =>
        it.title.toLowerCase().includes(q) ||
        it.artist?.toLowerCase().includes(q) ||
        it.album?.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

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
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width,
            maxWidth: "100vw",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          },
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <QueueMusicRounded color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
            Playlist
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            ({items.length} {items.length === 1 ? "track" : "tracks"})
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => playlist?.toggleShuffle()}
            sx={{ color: playlist?.isShuffle ? "primary.main" : "text.secondary" }}
            aria-label="toggle shuffle"
          >
            <ShuffleRounded fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => playlist?.cycleRepeatMode()}
            aria-label="cycle repeat mode"
          >
            {renderRepeatIcon()}
          </IconButton>

          <IconButton size="small" onClick={onClose} aria-label="close playlist drawer">
            <CloseRounded fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tabIndex}
        onChange={(_, val) => setTabIndex(val)}
        variant="fullWidth"
        sx={{ minHeight: 36, "& .MuiTab-root": { minHeight: 36, py: 0.5, fontSize: "0.85rem" } }}
      >
        <Tab label={`All (${items.length})`} />
        <Tab label={`Queue (${queue.length})`} />
      </Tabs>

      {/* Search Input */}
      {tabIndex === 0 && (
        <TextField
          size="small"
          placeholder="Filter playlist..."
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
      )}

      {/* Queue clear action */}
      {tabIndex === 1 && queue.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteSweepRounded />}
            onClick={() => playlist?.clearQueue()}
            sx={{ fontSize: "0.75rem" }}
          >
            Clear Queue
          </Button>
        </Box>
      )}

      <Divider />

      {/* Item List */}
      <Box sx={{ flex: 1, overflowY: "auto", pr: 0.5 }}>
        {tabIndex === 0 ? (
          filteredItems.length === 0 ? (
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
          )
        ) : queue.length === 0 ? (
          <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", py: 4 }}>
            Queue is empty
          </Typography>
        ) : (
          <List disablePadding>
            {queue.map((item, idx) => (
              <PlaylistItemRow
                key={item.id || idx}
                item={item}
                index={idx}
                isActive={false}
                onSelect={() => {
                  playlist?.playItem(item.id);
                  playlist?.removeFromQueue(idx);
                }}
                onRemove={() => playlist?.removeFromQueue(idx)}
              />
            ))}
          </List>
        )}
      </Box>
    </Drawer>
  );
};

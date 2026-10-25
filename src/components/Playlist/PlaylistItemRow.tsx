import { FC, MouseEvent } from "react";
import {
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import {
  DeleteOutlineRounded,
  MusicNoteRounded,
  VideocamRounded,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";

import { PlaylistItem } from "../../types/playlist";
import { formatTime } from "../../utils/formatTime";
import { AudioWave } from "../AudioPlayer/AudioWave";

export interface PlaylistItemRowProps {
  item: PlaylistItem;
  index: number;
  isActive: boolean;
  isPlaying?: boolean;
  onSelect: (item: PlaylistItem, index: number) => void;
  onRemove?: (item: PlaylistItem, index: number) => void;
}

export const PlaylistItemRow: FC<PlaylistItemRowProps> = ({
  item,
  index,
  isActive,
  isPlaying = false,
  onSelect,
  onRemove,
}) => {
  const isAudio = item.type === "audio" || item.src.endsWith(".mp3") || item.src.endsWith(".wav");

  return (
    <ListItem
      disablePadding
      secondaryAction={
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isActive && isPlaying && (
            <AudioWave isPlaying={true} barCount={4} />
          )}
          {item.duration !== undefined && (
            <Typography variant="caption" sx={{ color: "text.secondary", fontVariantNumeric: "tabular-nums" }}>
              {formatTime(item.duration)}
            </Typography>
          )}
          {onRemove && (
            <IconButton
              edge="end"
              size="small"
              aria-label="remove from playlist"
              onClick={(e: MouseEvent) => {
                e.stopPropagation();
                onRemove(item, index);
              }}
              sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
            >
              <DeleteOutlineRounded fontSize="small" />
            </IconButton>
          )}
        </Box>
      }
      sx={{
        borderRadius: 1.5,
        mb: 0.5,
        overflow: "hidden",
        backgroundColor: isActive ? (theme) => alpha(theme.palette.primary.main, 0.12) : "transparent",
        "&:hover": {
          backgroundColor: (theme) =>
            isActive
              ? alpha(theme.palette.primary.main, 0.18)
              : alpha(theme.palette.action.hover, 0.6),
        },
      }}
    >
      <ListItemButton onClick={() => onSelect(item, index)} sx={{ py: 1, px: 1.5 }}>
        <ListItemAvatar sx={{ minWidth: 46 }}>
          <Avatar
            src={item.artwork || item.poster}
            alt={item.title}
            variant="rounded"
            sx={{ width: 36, height: 36, backgroundColor: "action.selected" }}
          >
            {isAudio ? <MusicNoteRounded fontSize="small" /> : <VideocamRounded fontSize="small" />}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography
              variant="body2"
              sx={{
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "primary.main" : "text.primary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "80%",
              }}
            >
              {item.title}
            </Typography>
          }
          secondary={
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "block",
              }}
            >
              {item.artist || item.album || (isAudio ? "Audio Track" : "Video Clip")}
            </Typography>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};

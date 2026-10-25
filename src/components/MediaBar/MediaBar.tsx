import { FC, useState, MouseEvent } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Avatar,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  PlayArrowRounded,
  PauseRounded,
  SkipPreviousRounded,
  SkipNextRounded,
  VolumeUpRounded,
  VolumeDownRounded,
  VolumeMuteRounded,
  VolumeOffRounded,
  ShuffleRounded,
  RepeatRounded,
  RepeatOneRounded,
  OpenInFullRounded,
  CloseRounded,
  MusicNoteRounded,
  QueueMusicRounded,
} from "@mui/icons-material";

import { useMediaController } from "../../hooks/useMediaController";
import { usePlaylistContext } from "../../context/PlaylistContext";
import { formatTime } from "../../utils/formatTime";
import { MediaBarProps } from "./types";
import { MediaBarContainer, TopEdgeSlider } from "./styled";
import { VolumeSlider, SpeedMenuButton } from "../VideoPlayer/styled";
import { PlaylistDrawer } from "../Playlist/PlaylistDrawer";

const DEFAULT_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export const MediaBar: FC<MediaBarProps> = ({
  position = "bottom",
  onClose,
  onExpand,
  title: explicitTitle,
  artist: explicitArtist,
  artwork: explicitArtwork,
  src: explicitSrc,
  autoPlay = false,
  loop = false,
  muted = false,
  defaultVolume = 1,
  defaultPlaybackRate = 1,
  preload = "metadata",
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onDurationChange,
  onVolumeChange,
  onError,
  extraControls,
  sx,
  className,
  style,
}) => {
  const playlist = usePlaylistContext();
  const currentItem = playlist?.currentItem;

  const [speedAnchorEl, setSpeedAnchorEl] = useState<null | HTMLElement>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const activeSrc = currentItem?.src || explicitSrc;
  const activeTitle = currentItem?.title || explicitTitle || "No media selected";
  const activeArtist = currentItem?.artist || explicitArtist || (currentItem?.album ? currentItem.album : "");
  const activeArtwork = currentItem?.artwork || currentItem?.poster || explicitArtwork;

  const controller = useMediaController<HTMLAudioElement>({
    autoPlay,
    muted,
    defaultVolume,
    defaultPlaybackRate,
    onPlay,
    onPause,
    onEnded: () => {
      onEnded?.();
      if (playlist?.repeatMode === "one") {
        controller.restart();
      } else if (playlist && playlist.hasNext) {
        playlist.next();
      }
    },
    onTimeUpdate,
    onDurationChange,
    onVolumeChange,
    onError,
  });

  const {
    mediaRef,
    state,
    togglePlay,
    toggleMute,
    setPlaybackRate,
    handleSeekChange,
    handleSeekCommitted,
    handleVolumeChange,
    mediaEventHandlers,
  } = controller;

  const renderVolumeIcon = () => {
    if (state.isMuted || state.volume === 0) return <VolumeOffRounded fontSize="small" />;
    if (state.volume < 0.3) return <VolumeMuteRounded fontSize="small" />;
    if (state.volume < 0.7) return <VolumeDownRounded fontSize="small" />;
    return <VolumeUpRounded fontSize="small" />;
  };

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
    <>
      <MediaBarContainer
        position={position}
        role="region"
        aria-label="Media Bar"
        sx={sx}
        className={className}
        style={style}
      >
        {/* Hidden media element */}
        <audio
          ref={mediaRef}
          src={activeSrc}
          loop={loop}
          preload={preload}
          {...mediaEventHandlers}
          style={{ display: "none" }}
        />

        {/* Top Edge Scrubber Slider */}
        <TopEdgeSlider
          size="small"
          min={0}
          step={0.1}
          max={state.duration > 0 ? state.duration : 100}
          value={state.currentTime}
          bufferedEnd={state.bufferedEnd}
          duration={state.duration}
          onChange={handleSeekChange}
          onChangeCommitted={handleSeekCommitted}
          valueLabelDisplay="auto"
          valueLabelFormat={formatTime}
          aria-label="media seekbar"
        />

        {/* Inner Content Row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 1.5, sm: 2.5 },
            py: 1,
            gap: 1.5,
          }}
        >
          {/* Left: Artwork, Title & Artist */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0, flex: { xs: 1, sm: "0 1 280px" } }}>
            <Avatar
              src={activeArtwork}
              alt={activeTitle}
              variant="rounded"
              sx={{
                width: 44,
                height: 44,
                boxShadow: 2,
                cursor: onExpand ? "pointer" : "default",
              }}
              onClick={onExpand}
            >
              {!activeArtwork && <MusicNoteRounded />}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  cursor: onExpand ? "pointer" : "default",
                  "&:hover": { color: onExpand ? "primary.main" : "inherit" },
                }}
                onClick={onExpand}
              >
                {activeTitle}
              </Typography>
              {activeArtist && (
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
                  {activeArtist}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Center: Playback Controls */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {/* Shuffle */}
              {playlist && (
                <Tooltip title={playlist.isShuffle ? "Shuffle On" : "Shuffle Off"}>
                  <IconButton
                    size="small"
                    onClick={() => playlist.toggleShuffle()}
                    sx={{ color: playlist.isShuffle ? "primary.main" : "text.secondary", display: { xs: "none", sm: "inline-flex" } }}
                  >
                    <ShuffleRounded fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              {/* Prev */}
              <Tooltip title="Previous">
                <span>
                  <IconButton
                    size="small"
                    disabled={!playlist?.hasPrev && !playlist}
                    onClick={() => playlist?.prev()}
                  >
                    <SkipPreviousRounded />
                  </IconButton>
                </span>
              </Tooltip>

              {/* Play / Pause */}
              <IconButton
                onClick={togglePlay}
                color="primary"
                sx={{
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  width: 40,
                  height: 40,
                  "&:hover": { backgroundColor: "primary.dark", transform: "scale(1.05)" },
                  transition: "transform 0.15s ease",
                }}
              >
                {state.isBuffering ? (
                  <CircularProgress size={20} color="inherit" />
                ) : state.isPlaying ? (
                  <PauseRounded />
                ) : (
                  <PlayArrowRounded />
                )}
              </IconButton>

              {/* Next */}
              <Tooltip title="Next">
                <span>
                  <IconButton
                    size="small"
                    disabled={!playlist?.hasNext && !playlist}
                    onClick={() => playlist?.next()}
                  >
                    <SkipNextRounded />
                  </IconButton>
                </span>
              </Tooltip>

              {/* Repeat */}
              {playlist && (
                <Tooltip title={`Repeat: ${playlist.repeatMode}`}>
                  <IconButton
                    size="small"
                    onClick={() => playlist.cycleRepeatMode()}
                    sx={{ display: { xs: "none", sm: "inline-flex" } }}
                  >
                    {renderRepeatIcon()}
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            {/* Time display */}
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "0.72rem",
                fontVariantNumeric: "tabular-nums",
                display: { xs: "none", sm: "block" },
              }}
            >
              {formatTime(state.currentTime)} / {formatTime(state.duration)}
            </Typography>
          </Box>

          {/* Right: Tools & Actions */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.8,
              justifyContent: "flex-end",
              flex: { xs: "none", sm: "0 1 280px" },
            }}
          >
            {/* Volume slider */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.5 }}>
              <IconButton size="small" onClick={toggleMute} aria-label="volume">
                {renderVolumeIcon()}
              </IconButton>
              <VolumeSlider
                size="small"
                min={0}
                max={100}
                value={state.isMuted ? 0 : Math.round(state.volume * 100)}
                onChange={handleVolumeChange}
                aria-label="volume slider"
                sx={{
                  color: "text.primary",
                  "& .MuiSlider-thumb": { backgroundColor: "text.primary" },
                }}
              />
            </Box>

            {/* Speed dropdown */}
            <Tooltip title="Speed">
              <SpeedMenuButton
                size="small"
                onClick={(e: MouseEvent<HTMLButtonElement>) => setSpeedAnchorEl(e.currentTarget)}
                sx={{
                  display: { xs: "none", md: "inline-flex" },
                  color: "text.primary",
                  borderColor: "divider",
                  backgroundColor: "action.hover",
                }}
              >
                {state.playbackRate === 1 ? "1x" : `${state.playbackRate}x`}
              </SpeedMenuButton>
            </Tooltip>

            <Menu
              anchorEl={speedAnchorEl}
              open={Boolean(speedAnchorEl)}
              onClose={() => setSpeedAnchorEl(null)}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              transformOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              {DEFAULT_SPEEDS.map((rate) => (
                <MenuItem
                  key={rate}
                  selected={state.playbackRate === rate}
                  onClick={() => {
                    setPlaybackRate(rate);
                    setSpeedAnchorEl(null);
                  }}
                >
                  {rate === 1 ? "Normal (1x)" : `${rate}x`}
                </MenuItem>
              ))}
            </Menu>

            {/* Playlist Drawer Toggle */}
            <Tooltip title="Playlist">
              <IconButton size="small" onClick={() => setIsDrawerOpen(true)}>
                <QueueMusicRounded fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Expand button (open full player or MediaCenter) */}
            {onExpand && (
              <Tooltip title="Expand Player">
                <IconButton size="small" onClick={onExpand}>
                  <OpenInFullRounded fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {extraControls}

            {/* Close button */}
            {onClose && (
              <Tooltip title="Close">
                <IconButton size="small" onClick={onClose}>
                  <CloseRounded fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </MediaBarContainer>

      {/* Playlist slide-over drawer */}
      <PlaylistDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};

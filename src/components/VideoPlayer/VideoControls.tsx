import React, { FC, useState, MouseEvent, SyntheticEvent } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  PlayArrowRounded,
  PauseRounded,
  ReplayRounded,
  Replay10Rounded,
  Forward10Rounded,
  VolumeUpRounded,
  VolumeDownRounded,
  VolumeMuteRounded,
  VolumeOffRounded,
  FullscreenRounded,
  FullscreenExitRounded,
  PictureInPictureAltRounded,
  SkipPreviousRounded,
  SkipNextRounded,
  QueueMusicRounded,
  SubtitlesRounded,
  SubtitlesOffRounded,
  AudiotrackRounded,
  CheckRounded,
} from "@mui/icons-material";

import { formatTime } from "../../utils/formatTime";
import { MediaControllerState } from "../../types/player";
import { SubtitleTrack, AudioTrackOption } from "../../types/tracks";
import {
  BottomOverlay,
  SeekSlider,
  VolumeSlider,
  SpeedMenuButton,
} from "./styled";

export interface VideoControlsProps {
  state: MediaControllerState;
  visible: boolean;
  containerEl: HTMLElement | null;
  speedOptions?: number[];
  accentColor?: string;
  disablePiP?: boolean;
  disableFullscreen?: boolean;
  hasNext?: boolean;
  hasPrev?: boolean;
  showPlaylistControls?: boolean;
  subtitles?: SubtitleTrack[];
  activeSubtitleId?: string | null;
  onSubtitleChange?: (subtitleId: string | null) => void;
  audioTracks?: AudioTrackOption[];
  activeAudioTrackId?: string | null;
  onAudioTrackChange?: (audioTrackId: string) => void;
  onTogglePlay: () => void;
  onRestart: () => void;
  onSkip: (delta: number) => void;
  onSeekChange: (e: Event | SyntheticEvent, value: number | number[]) => void;
  onSeekCommitted: (e: Event | SyntheticEvent, value: number | number[]) => void;
  onVolumeChange: (e: Event | SyntheticEvent, value: number | number[]) => void;
  onToggleMute: () => void;
  onSpeedSelect: (rate: number) => void;
  onToggleFullscreen: () => void;
  onTogglePiP: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onTogglePlaylistDrawer?: () => void;
  extraControls?: React.ReactNode;
}

const DEFAULT_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export const VideoControls: FC<VideoControlsProps> = ({
  state,
  visible,
  containerEl,
  speedOptions = DEFAULT_SPEEDS,
  accentColor,
  disablePiP = false,
  disableFullscreen = false,
  hasNext = false,
  hasPrev = false,
  showPlaylistControls = false,
  subtitles,
  activeSubtitleId,
  onSubtitleChange,
  audioTracks,
  activeAudioTrackId,
  onAudioTrackChange,
  onTogglePlay,
  onRestart,
  onSkip,
  onSeekChange,
  onSeekCommitted,
  onVolumeChange,
  onToggleMute,
  onSpeedSelect,
  onToggleFullscreen,
  onTogglePiP,
  onNext,
  onPrev,
  onTogglePlaylistDrawer,
  extraControls,
}) => {
  const [speedAnchorEl, setSpeedAnchorEl] = useState<null | HTMLElement>(null);
  const [subtitlesAnchorEl, setSubtitlesAnchorEl] = useState<null | HTMLElement>(null);
  const [audioTrackAnchorEl, setAudioTrackAnchorEl] = useState<null | HTMLElement>(null);

  const hasSubtitles = subtitles && subtitles.length > 0;
  const isSubtitleActive = Boolean(activeSubtitleId);
  const hasMultipleAudioTracks = audioTracks && audioTracks.length > 1;

  const renderVolumeIcon = () => {
    if (state.isMuted || state.volume === 0) {
      return <VolumeOffRounded fontSize="small" />;
    }
    if (state.volume < 0.3) {
      return <VolumeMuteRounded fontSize="small" />;
    }
    if (state.volume < 0.7) {
      return <VolumeDownRounded fontSize="small" />;
    }
    return <VolumeUpRounded fontSize="small" />;
  };

  const menuPaperProps = {
    sx: {
      backgroundColor: "rgba(28, 28, 34, 0.95)",
      backdropFilter: "blur(12px)",
      color: "#ffffff",
      border: "1px solid rgba(255, 255, 255, 0.12)",
      minWidth: 140,
      zIndex: 1400,
      "& .MuiMenuItem-root": {
        fontSize: "0.82rem",
        "&.Mui-selected": {
          backgroundColor: "rgba(255, 255, 255, 0.18)",
          fontWeight: 700,
        },
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  return (
    <BottomOverlay visible={visible}>
      {/* Interactive Seekbar */}
      <Box sx={{ width: "100%", px: 0.5 }}>
        <SeekSlider
          size="small"
          min={0}
          step={0.1}
          max={state.duration > 0 ? state.duration : 100}
          value={state.currentTime}
          bufferedEnd={state.bufferedEnd}
          duration={state.duration}
          onChange={onSeekChange}
          onChangeCommitted={onSeekCommitted}
          valueLabelDisplay="auto"
          valueLabelFormat={formatTime}
          aria-label="video seekbar"
        />
      </Box>

      {/* Controls Button Row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          width: "100%",
        }}
      >
        {/* Left Controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {/* Previous Track button (if playlist enabled) */}
          {showPlaylistControls && onPrev && (
            <Tooltip title="Previous" PopperProps={{ container: containerEl }}>
              <span>
                <IconButton
                  size="small"
                  disabled={!hasPrev}
                  onClick={onPrev}
                  aria-label="previous track"
                  sx={{ color: "#ffffff", "&.Mui-disabled": { color: "rgba(255,255,255,0.3)" } }}
                >
                  <SkipPreviousRounded fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          )}

          {/* Play / Pause */}
          <Tooltip
            title={state.isPlaying ? "Pause (k / Space)" : "Play (k / Space)"}
            PopperProps={{ container: containerEl }}
          >
            <IconButton
              size="small"
              onClick={onTogglePlay}
              aria-label={state.isPlaying ? "pause" : "play"}
              sx={{ color: "#ffffff" }}
            >
              {state.isPlaying ? <PauseRounded /> : <PlayArrowRounded />}
            </IconButton>
          </Tooltip>

          {/* Next Track button (if playlist enabled) */}
          {showPlaylistControls && onNext && (
            <Tooltip title="Next" PopperProps={{ container: containerEl }}>
              <span>
                <IconButton
                  size="small"
                  disabled={!hasNext}
                  onClick={onNext}
                  aria-label="next track"
                  sx={{ color: "#ffffff", "&.Mui-disabled": { color: "rgba(255,255,255,0.3)" } }}
                >
                  <SkipNextRounded fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          )}

          {/* Restart */}
          <Tooltip title="Restart (0)" PopperProps={{ container: containerEl }}>
            <IconButton
              size="small"
              onClick={onRestart}
              aria-label="restart"
              sx={{ color: "#ffffff" }}
            >
              <ReplayRounded fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Rewind 10s */}
          <Tooltip title="Rewind 10s (j / ←)" PopperProps={{ container: containerEl }}>
            <IconButton
              size="small"
              onClick={() => onSkip(-10)}
              aria-label="rewind 10 seconds"
              sx={{ color: "#ffffff" }}
            >
              <Replay10Rounded fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Forward 10s */}
          <Tooltip title="Forward 10s (l / →)" PopperProps={{ container: containerEl }}>
            <IconButton
              size="small"
              onClick={() => onSkip(10)}
              aria-label="forward 10 seconds"
              sx={{ color: "#ffffff" }}
            >
              <Forward10Rounded fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Volume Control */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: 0.5 }}>
            <Tooltip
              title={state.isMuted ? "Unmute (m)" : "Mute (m)"}
              PopperProps={{ container: containerEl }}
            >
              <IconButton
                size="small"
                onClick={onToggleMute}
                aria-label={state.isMuted ? "unmute" : "mute"}
                sx={{ color: "#ffffff" }}
              >
                {renderVolumeIcon()}
              </IconButton>
            </Tooltip>

            <VolumeSlider
              size="small"
              min={0}
              max={100}
              value={state.isMuted ? 0 : Math.round(state.volume * 100)}
              onChange={onVolumeChange}
              aria-label="volume"
            />
          </Box>

          {/* Time Display */}
          <Typography
            variant="caption"
            sx={{
              ml: 1.5,
              color: "#ffffff",
              fontSize: "0.8rem",
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
            }}
          >
            {formatTime(state.currentTime)} / {formatTime(state.duration)}
          </Typography>
        </Box>

        {/* Right Controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          {extraControls}

          {/* Subtitles / Closed Captions Toggle and Menu */}
          {hasSubtitles && (
            <>
              <Tooltip
                title={isSubtitleActive ? "Subtitles (On)" : "Subtitles (Off)"}
                PopperProps={{ container: containerEl }}
              >
                <IconButton
                  size="small"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => setSubtitlesAnchorEl(e.currentTarget)}
                  aria-label="subtitles"
                  sx={{
                    color: isSubtitleActive ? (accentColor === "secondary" ? "#a855f7" : "#38bdf8") : "#ffffff",
                    position: "relative",
                  }}
                >
                  {isSubtitleActive ? <SubtitlesRounded fontSize="small" /> : <SubtitlesOffRounded fontSize="small" />}
                </IconButton>
              </Tooltip>

              <Menu
                container={containerEl}
                anchorEl={subtitlesAnchorEl}
                open={Boolean(subtitlesAnchorEl)}
                onClose={() => setSubtitlesAnchorEl(null)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                transformOrigin={{ vertical: "bottom", horizontal: "center" }}
                slotProps={{ paper: menuPaperProps.sx }}
              >
                <MenuItem
                  selected={!activeSubtitleId}
                  onClick={() => {
                    onSubtitleChange && onSubtitleChange(null);
                    setSubtitlesAnchorEl(null);
                  }}
                >
                  {!activeSubtitleId && (
                    <ListItemIcon sx={{ minWidth: 28, color: "inherit" }}>
                      <CheckRounded fontSize="small" />
                    </ListItemIcon>
                  )}
                  <ListItemText inset={Boolean(activeSubtitleId)}>Off</ListItemText>
                </MenuItem>

                {subtitles.map((sub) => {
                  const isSelected = activeSubtitleId === sub.id;
                  return (
                    <MenuItem
                      key={sub.id}
                      selected={isSelected}
                      onClick={() => {
                        onSubtitleChange && onSubtitleChange(sub.id);
                        setSubtitlesAnchorEl(null);
                      }}
                    >
                      {isSelected && (
                        <ListItemIcon sx={{ minWidth: 28, color: "inherit" }}>
                          <CheckRounded fontSize="small" />
                        </ListItemIcon>
                      )}
                      <ListItemText inset={!isSelected}>
                        {sub.label} {sub.language ? `(${sub.language.toUpperCase()})` : ""}
                      </ListItemText>
                    </MenuItem>
                  );
                })}
              </Menu>
            </>
          )}

          {/* Multi-Audio Track Selector */}
          {hasMultipleAudioTracks && (
            <>
              <Tooltip title="Audio Tracks" PopperProps={{ container: containerEl }}>
                <IconButton
                  size="small"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => setAudioTrackAnchorEl(e.currentTarget)}
                  aria-label="audio tracks"
                  sx={{ color: "#ffffff" }}
                >
                  <AudiotrackRounded fontSize="small" />
                </IconButton>
              </Tooltip>

              <Menu
                container={containerEl}
                anchorEl={audioTrackAnchorEl}
                open={Boolean(audioTrackAnchorEl)}
                onClose={() => setAudioTrackAnchorEl(null)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                transformOrigin={{ vertical: "bottom", horizontal: "center" }}
                slotProps={{ paper: menuPaperProps.sx }}
              >
                {audioTracks.map((track) => {
                  const isSelected = activeAudioTrackId === track.id;
                  return (
                    <MenuItem
                      key={track.id}
                      selected={isSelected}
                      onClick={() => {
                        onAudioTrackChange && onAudioTrackChange(track.id);
                        setAudioTrackAnchorEl(null);
                      }}
                    >
                      {isSelected && (
                        <ListItemIcon sx={{ minWidth: 28, color: "inherit" }}>
                          <CheckRounded fontSize="small" />
                        </ListItemIcon>
                      )}
                      <ListItemText inset={!isSelected}>
                        {track.label} {track.kind ? `• ${track.kind}` : ""}
                      </ListItemText>
                    </MenuItem>
                  );
                })}
              </Menu>
            </>
          )}

          {/* Playlist drawer toggle button */}
          {onTogglePlaylistDrawer && (
            <Tooltip title="Playlist" PopperProps={{ container: containerEl }}>
              <IconButton
                size="small"
                onClick={onTogglePlaylistDrawer}
                aria-label="toggle playlist drawer"
                sx={{ color: "#ffffff" }}
              >
                <QueueMusicRounded fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {/* Speed Selector */}
          <Tooltip title="Playback Speed" PopperProps={{ container: containerEl }}>
            <SpeedMenuButton
              size="small"
              onClick={(e: MouseEvent<HTMLButtonElement>) => setSpeedAnchorEl(e.currentTarget)}
              aria-label="playback speed"
            >
              {state.playbackRate === 1 ? "1x" : `${state.playbackRate}x`}\
            </SpeedMenuButton>
          </Tooltip>

          <Menu
            container={containerEl}
            anchorEl={speedAnchorEl}
            open={Boolean(speedAnchorEl)}
            onClose={() => setSpeedAnchorEl(null)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            transformOrigin={{ vertical: "bottom", horizontal: "center" }}
            slotProps={{ paper: menuPaperProps.sx }}
          >
            {speedOptions.map((rate) => (
              <MenuItem
                key={rate}
                selected={state.playbackRate === rate}
                onClick={() => {
                  onSpeedSelect(rate);
                  setSpeedAnchorEl(null);
                }}
              >
                {rate}x
              </MenuItem>
            ))}
          </Menu>

          {/* PiP Button */}
          {!disablePiP && (
            <Tooltip
              title={state.isPiP ? "Exit PiP (p)" : "Picture in Picture (p)"}
              PopperProps={{ container: containerEl }}
            >
              <IconButton
                size="small"
                onClick={onTogglePiP}
                aria-label="picture in picture"
                sx={{ color: "#ffffff" }}
              >
                <PictureInPictureAltRounded fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {/* Fullscreen Button */}
          {!disableFullscreen && (
            <Tooltip
              title={state.isFullscreen ? "Exit Fullscreen (f)" : "Fullscreen (f)"}
              PopperProps={{ container: containerEl }}
            >
              <IconButton
                size="small"
                onClick={onToggleFullscreen}
                aria-label="toggle fullscreen"
                sx={{ color: "#ffffff" }}
              >
                {state.isFullscreen ? (
                  <FullscreenExitRounded />
                ) : (
                  <FullscreenRounded />
                )}
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </BottomOverlay>
  );
};

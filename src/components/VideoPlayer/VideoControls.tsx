import { FC, useState, MouseEvent } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
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
} from "@mui/icons-material";

import { formatTime } from "../../utils/formatTime";
import { MediaControllerState } from "../../types/player";
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
  onTogglePlay: () => void;
  onRestart: () => void;
  onSkip: (delta: number) => void;
  onSeekChange: (e: any, value: number | number[]) => void;
  onSeekCommitted: (e: any, value: number | number[]) => void;
  onVolumeChange: (e: any, value: number | number[]) => void;
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
  disablePiP = false,
  disableFullscreen = false,
  hasNext = false,
  hasPrev = false,
  showPlaylistControls = false,
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {extraControls}

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
              {state.playbackRate === 1 ? "1x" : `${state.playbackRate}x`}
            </SpeedMenuButton>
          </Tooltip>

          <Menu
            container={containerEl}
            anchorEl={speedAnchorEl}
            open={Boolean(speedAnchorEl)}
            onClose={() => setSpeedAnchorEl(null)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            transformOrigin={{ vertical: "bottom", horizontal: "center" }}
            slotProps={{
              paper: {
                sx: {
                  backgroundColor: "rgba(28, 28, 34, 0.95)",
                  backdropFilter: "blur(12px)",
                  color: "#ffffff",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  minWidth: 105,
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
              },
            }}
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
                {rate === 1 ? "Normal (1x)" : `${rate}x`}
              </MenuItem>
            ))}
          </Menu>

          {/* Picture in Picture */}
          {!disablePiP && (
            <Tooltip title="Picture-in-Picture (p)" PopperProps={{ container: containerEl }}>
              <IconButton
                size="small"
                onClick={onTogglePiP}
                aria-label="picture in picture"
                sx={{
                  color: state.isPiP ? "primary.main" : "#ffffff",
                }}
              >
                <PictureInPictureAltRounded fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {/* Fullscreen */}
          {!disableFullscreen && (
            <Tooltip
              title={state.isFullscreen ? "Exit Fullscreen (f)" : "Fullscreen (f)"}
              PopperProps={{ container: containerEl }}
            >
              <IconButton
                size="small"
                onClick={onToggleFullscreen}
                aria-label={state.isFullscreen ? "exit fullscreen" : "enter fullscreen"}
                sx={{ color: "#ffffff" }}
              >
                {state.isFullscreen ? (
                  <FullscreenExitRounded fontSize="small" />
                ) : (
                  <FullscreenRounded fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </BottomOverlay>
  );
};

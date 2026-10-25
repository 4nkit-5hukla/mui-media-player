import { FC, useEffect, useRef } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
  Button,
} from "@mui/material";
import {
  CloseRounded,
  PlayArrowRounded,
  ErrorOutlineRounded,
  RefreshRounded,
} from "@mui/icons-material";

import { useMediaController } from "../../hooks/useMediaController";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { usePlaylistContext } from "../../context/PlaylistContext";
import { extractYouTubeId, buildYouTubeEmbedUrl } from "../../utils/mediaDetection";
import { VideoPlayerProps } from "./types";
import { VideoControls } from "./VideoControls";
import {
  VideoContainer,
  VideoElement,
  TopOverlay,
  VideoTitle,
  CenterOverlay,
  CenterPlayButton,
} from "./styled";

export const VideoPlayer: FC<VideoPlayerProps> = ({
  src,
  poster,
  title,
  subtitle,
  autoPlay = false,
  loop = false,
  muted = false,
  defaultVolume = 1,
  defaultPlaybackRate = 1,
  aspectRatio = "16/9",
  preload = "metadata",
  playsInline = true,
  crossOrigin,
  accentColor,
  sx,
  className,
  style,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onDurationChange,
  onVolumeChange,
  onPlaybackRateChange,
  onError,
  onClose,
  headerActions,
  extraControls,
  disableKeyboard = false,
  disablePiP = false,
  disableFullscreen = false,
  hideControlsTimeout = 2500,
  speedOptions,
  playlist: explicitPlaylist,
  showPlaylistControls,
  onNext: explicitOnNext,
  onPrev: explicitOnPrev,
  onTogglePlaylistDrawer,
}) => {
  const playlistCtx = usePlaylistContext();
  const activePlaylist = explicitPlaylist || playlistCtx?.items;
  const hasPlaylist = Boolean(activePlaylist && activePlaylist.length > 0);

  const nextTrack = explicitOnNext || playlistCtx?.next;
  const prevTrack = explicitOnPrev || playlistCtx?.prev;
  const hasNext = playlistCtx ? playlistCtx.hasNext : false;
  const hasPrev = playlistCtx ? playlistCtx.hasPrev : false;

  const controller = useMediaController({
    autoPlay,
    muted,
    defaultVolume,
    defaultPlaybackRate,
    hideControlsTimeout,
    onPlay,
    onPause,
    onEnded: () => {
      onEnded?.();
      // If repeatMode is 'one', re-play track; if playlist has next, advance
      if (playlistCtx?.repeatMode === "one") {
        controller.restart();
      } else if (hasPlaylist && nextTrack) {
        nextTrack();
      }
    },
    onTimeUpdate,
    onDurationChange,
    onVolumeChange,
    onPlaybackRateChange,
    onError,
  });

  const {
    mediaRef,
    containerRef,
    state,
    isControlsVisible,
    showControls,
    togglePlay,
    skip,
    restart,
    toggleMute,
    setVolume,
    setPlaybackRate,
    toggleFullscreen,
    togglePiP,
    handleSeekChange,
    handleSeekCommitted,
    handleVolumeChange,
    mediaEventHandlers,
  } = controller;

  // Keyboard navigation
  const { handleKeyDown } = useKeyboardShortcuts({
    disabled: disableKeyboard,
    onTogglePlay: togglePlay,
    onToggleFullscreen: toggleFullscreen,
    onToggleMute: toggleMute,
    onTogglePiP: togglePiP,
    onSkip: skip,
    onRestart: restart,
    onVolumeChange: (delta) => setVolume(state.volume + delta),
  });

  // Check if src is YouTube
  const youtubeId = extractYouTubeId(src);

  // When src changes, reload video
  useEffect(() => {
    if (mediaRef.current && !youtubeId) {
      mediaRef.current.load();
    }
  }, [src, youtubeId, mediaRef]);

  if (youtubeId) {
    return (
      <VideoContainer
        ref={containerRef}
        aspectRatio={aspectRatio}
        isFullscreen={state.isFullscreen}
        sx={sx}
        className={className}
        style={style}
      >
        {onClose && (
          <Box sx={{ position: "absolute", top: 12, right: 12, zIndex: 12 }}>
            <Tooltip title="Close">
              <IconButton
                size="small"
                onClick={onClose}
                aria-label="close video"
                sx={{
                  backgroundColor: "rgba(0,0,0,0.6)",
                  color: "#ffffff",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.85)" },
                }}
              >
                <CloseRounded fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        <iframe
          width="100%"
          height="100%"
          src={buildYouTubeEmbedUrl(youtubeId, autoPlay, muted)}
          title={title || "YouTube Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ border: 0 }}
        />
      </VideoContainer>
    );
  }

  return (
    <VideoContainer
      tabIndex={0}
      role="region"
      aria-label="Video Player"
      ref={containerRef}
      aspectRatio={aspectRatio}
      isFullscreen={state.isFullscreen}
      onKeyDown={handleKeyDown}
      onMouseMove={showControls}
      onMouseLeave={() => state.isPlaying && showControls()}
      sx={sx}
      className={className}
      style={style}
    >
      {/* HTML5 Video Element */}
      <VideoElement
        ref={mediaRef as any}
        src={src}
        poster={poster}
        loop={loop}
        playsInline={playsInline}
        preload={preload}
        crossOrigin={crossOrigin}
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        {...mediaEventHandlers}
      />

      {/* Top Header Overlay */}
      <TopOverlay visible={isControlsVisible}>
        <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          {title && <VideoTitle>{title}</VideoTitle>}
          {subtitle && (
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.75rem" }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {headerActions}

          {onClose && (
            <Tooltip title="Close" PopperProps={{ container: containerRef.current }}>
              <IconButton
                size="small"
                onClick={onClose}
                aria-label="close video"
                sx={{
                  color: "#ffffff",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.25)" },
                }}
              >
                <CloseRounded fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </TopOverlay>

      {/* Center Action Overlay (Buffering spinner / Play button) */}
      <CenterOverlay>
        {state.isBuffering ? (
          <CircularProgress size={56} sx={{ color: "primary.main" }} />
        ) : !state.isPlaying && !state.error ? (
          <CenterPlayButton
            onClick={togglePlay}
            aria-label="play video"
            accentColor={accentColor}
          >
            <PlayArrowRounded sx={{ fontSize: 40 }} />
          </CenterPlayButton>
        ) : null}
      </CenterOverlay>

      {/* Error Fallback Overlay */}
      {state.error && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(10, 10, 12, 0.92)",
            p: 3,
            zIndex: 15,
            textAlign: "center",
          }}
        >
          <ErrorOutlineRounded sx={{ fontSize: 48, color: "error.main", mb: 1 }} />
          <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 600 }}>
            Unable to Play Video
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.7)", maxWidth: 380, mt: 0.5, mb: 2 }}
          >
            {state.error.message}
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            startIcon={<RefreshRounded />}
            onClick={() => {
              if (mediaRef.current) {
                mediaRef.current.load();
                controller.play();
              }
            }}
            sx={{ borderColor: "rgba(255,255,255,0.3)" }}
          >
            Retry Playback
          </Button>
        </Box>
      )}

      {/* Bottom Controls Bar */}
      <VideoControls
        state={state}
        visible={isControlsVisible}
        containerEl={containerRef.current}
        speedOptions={speedOptions}
        accentColor={accentColor}
        disablePiP={disablePiP}
        disableFullscreen={disableFullscreen}
        hasNext={hasNext}
        hasPrev={hasPrev}
        showPlaylistControls={showPlaylistControls || hasPlaylist}
        onTogglePlay={togglePlay}
        onRestart={restart}
        onSkip={skip}
        onSeekChange={handleSeekChange}
        onSeekCommitted={handleSeekCommitted}
        onVolumeChange={handleVolumeChange}
        onToggleMute={toggleMute}
        onSpeedSelect={setPlaybackRate}
        onToggleFullscreen={toggleFullscreen}
        onTogglePiP={togglePiP}
        onNext={nextTrack}
        onPrev={prevTrack}
        onTogglePlaylistDrawer={onTogglePlaylistDrawer}
        extraControls={extraControls}
      />
    </VideoContainer>
  );
};

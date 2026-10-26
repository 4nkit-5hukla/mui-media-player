import { FC, useState, useEffect, MouseEvent } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  PlayArrowRounded,
  PauseRounded,
  SkipPreviousRounded,
  SkipNextRounded,
  Replay10Rounded,
  Forward10Rounded,
  VolumeUpRounded,
  VolumeDownRounded,
  VolumeMuteRounded,
  VolumeOffRounded,
  ShuffleRounded,
  RepeatRounded,
  RepeatOneRounded,
  MusicNoteRounded,
  QueueMusicRounded,
  LyricsRounded,
  GraphicEqRounded,
} from "@mui/icons-material";

import { useMediaController } from "../../hooks/useMediaController";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { usePlaylistContext } from "../../context/PlaylistContext";
import { formatTime } from "../../utils/formatTime";
import { normalizeLyrics } from "../../utils/lrcParser";
import { extractID3FromUrl } from "../../utils/id3Parser";
import { AudioLyrics, ID3Metadata } from "../../types/tracks";
import { AudioPlayerProps } from "./types";
import { AudioWave } from "./AudioWave";
import { WaveSurferVisualizer } from "../AudioVisualizer/WaveSurferVisualizer";
import { LyricsViewer } from "../Lyrics/LyricsViewer";
import {
  AudioCardContainer,
  AudioCompactContainer,
  AudioFullContainer,
  AudioArtwork,
  TrackTitle,
  TrackArtist,
  AudioSlider,
} from "./styled";
import { VolumeSlider, SpeedMenuButton } from "../VideoPlayer/styled";

const DEFAULT_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export const AudioPlayer: FC<AudioPlayerProps> = ({
  src,
  title,
  artist,
  album,
  artwork,
  lyrics: initialLyrics,
  autoExtractID3 = true,
  enableWaveSurfer = false,
  onLyricsChange,
  onID3Parsed,
  variant = "card",
  showWaveform = true,
  autoPlay = false,
  loop = false,
  muted = false,
  defaultVolume = 1,
  defaultPlaybackRate = 1,
  preload = "metadata",
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
  disableKeyboard = false,
  speedOptions = DEFAULT_SPEEDS,
  playlist: explicitPlaylist,
  showPlaylistControls,
  onNext: explicitOnNext,
  onPrev: explicitOnPrev,
  onTogglePlaylistDrawer,
  extraControls,
}) => {
  const playlistCtx = usePlaylistContext();
  const activePlaylist = explicitPlaylist || playlistCtx?.items;
  const hasPlaylist = Boolean((activePlaylist && activePlaylist.length > 0) || showPlaylistControls);

  const nextTrack = explicitOnNext || playlistCtx?.next;
  const prevTrack = explicitOnPrev || playlistCtx?.prev;
  const hasNext = playlistCtx ? playlistCtx.hasNext : false;
  const hasPrev = playlistCtx ? playlistCtx.hasPrev : false;

  const [speedAnchorEl, setSpeedAnchorEl] = useState<null | HTMLElement>(null);
  const [showLyricsView, setShowLyricsView] = useState<boolean>(false);
  const [useWaveSurfer, setUseWaveSurfer] = useState<boolean>(enableWaveSurfer);

  // ID3 Metadata state
  const [id3Meta, setId3Meta] = useState<ID3Metadata | null>(null);
  const [currentLyrics, setCurrentLyrics] = useState<AudioLyrics | null>(() =>
    normalizeLyrics(initialLyrics)
  );

  // Sync initialLyrics changes
  useEffect(() => {
    if (initialLyrics !== undefined) {
      setCurrentLyrics(normalizeLyrics(initialLyrics));
    }
  }, [initialLyrics]);

  // Auto extract ID3 tags from audio source
  useEffect(() => {
    if (!src || !autoExtractID3) return;

    extractID3FromUrl(src)
      .then((meta) => {
        if (meta.title || meta.artist || meta.lyrics || meta.albumArt) {
          setId3Meta(meta);
          if (meta.lyrics && !initialLyrics) {
            setCurrentLyrics(meta.lyrics);
          }
          onID3Parsed?.(meta);
        }
      })
      .catch(() => {});
  }, [src, autoExtractID3, initialLyrics, onID3Parsed]);

  const effectiveArtwork = artwork || id3Meta?.albumArt;
  const effectiveTitle = title || id3Meta?.title || "Untitled Track";
  const effectiveArtist = artist || id3Meta?.artist;
  const effectiveAlbum = album || id3Meta?.album;

  const controller = useMediaController<HTMLAudioElement>({
    autoPlay,
    muted,
    defaultVolume,
    defaultPlaybackRate,
    onPlay,
    onPause,
    onEnded: () => {
      onEnded?.();
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
    togglePlay,
    skip,
    restart,
    toggleMute,
    setVolume,
    setPlaybackRate,
    seek,
    handleSeekChange,
    handleSeekCommitted,
    handleVolumeChange,
    mediaEventHandlers,
  } = controller;

  const { handleKeyDown } = useKeyboardShortcuts({
    disabled: disableKeyboard,
    onTogglePlay: togglePlay,
    onToggleMute: toggleMute,
    onSkip: skip,
    onRestart: restart,
    onVolumeChange: (delta) => setVolume(state.volume + delta),
  });

  const handleUpdateLyrics = (updatedLyrics: AudioLyrics) => {
    setCurrentLyrics(updatedLyrics);
    onLyricsChange?.(updatedLyrics);
  };

  const renderVolumeIcon = () => {
    if (state.isMuted || state.volume === 0) return <VolumeOffRounded fontSize="small" />;
    if (state.volume < 0.3) return <VolumeMuteRounded fontSize="small" />;
    if (state.volume < 0.7) return <VolumeDownRounded fontSize="small" />;
    return <VolumeUpRounded fontSize="small" />;
  };

  const renderRepeatIcon = () => {
    if (playlistCtx?.repeatMode === "one") {
      return <RepeatOneRounded fontSize="small" color="primary" />;
    }
    if (playlistCtx?.repeatMode === "all") {
      return <RepeatRounded fontSize="small" color="primary" />;
    }
    return <RepeatRounded fontSize="small" sx={{ opacity: 0.45 }} />;
  };

  // Hidden audio element
  const audioElement = (
    <audio
      ref={mediaRef}
      src={src}
      loop={loop}
      preload={preload}
      {...mediaEventHandlers}
      style={{ display: "none" }}
    />
  );

  // Speed Menu
  const speedMenu = (
    <>
      <Tooltip title="Playback Speed">
        <SpeedMenuButton
          size="small"
          onClick={(e: MouseEvent<HTMLButtonElement>) => setSpeedAnchorEl(e.currentTarget)}
          sx={{
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
        {speedOptions.map((rate) => (
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
    </>
  );

  /* ---------------- COMPACT VARIANT ---------------- */
  if (variant === "compact") {
    return (
      <AudioCompactContainer
        tabIndex={0}
        role="region"
        aria-label="Compact Audio Player"
        ref={containerRef}
        onKeyDown={handleKeyDown}
        sx={sx}
        className={className}
        style={style}
      >
        {audioElement}

        {/* Artwork */}
        <AudioArtwork
          src={effectiveArtwork}
          alt={effectiveTitle}
          variant="rounded"
          size={42}
          isPlaying={state.isPlaying}
        >
          {!effectiveArtwork && <MusicNoteRounded fontSize="small" />}
        </AudioArtwork>

        {/* Track Title */}
        <Box sx={{ minWidth: 100, maxWidth: 160 }}>
          <TrackTitle variant="body2">{effectiveTitle}</TrackTitle>
          {effectiveArtist && <TrackArtist variant="caption">{effectiveArtist}</TrackArtist>}
        </Box>

        {/* Play/Pause Button */}
        <IconButton
          color="primary"
          onClick={togglePlay}
          aria-label={state.isPlaying ? "pause" : "play"}
          sx={{
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            "&:hover": { backgroundColor: "primary.dark" },
            width: 38,
            height: 38,
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

        {/* Seekbar and Time */}
        <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
          <AudioSlider
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
            aria-label="audio seekbar"
          />
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
              fontSize: "0.75rem",
            }}
          >
            {formatTime(state.currentTime)} / {formatTime(state.duration)}
          </Typography>
        </Box>

        {/* Volume & Actions */}
        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 0.5 }}>
          <Tooltip title="Lyrics">
            <IconButton
              size="small"
              onClick={() => setShowLyricsView(true)}
              sx={{ color: currentLyrics ? "primary.main" : "text.secondary" }}
            >
              <LyricsRounded fontSize="small" />
            </IconButton>
          </Tooltip>

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

        {/* Lyrics Dialog for Compact variant */}
        {showLyricsView && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1300,
              p: { xs: 2, sm: 6 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(6px)",
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 640, height: 480, borderRadius: 3, overflow: "hidden" }}>
              <LyricsViewer
                lyrics={currentLyrics}
                currentTime={state.currentTime}
                isPlaying={state.isPlaying}
                onSeek={seek}
                onClose={() => setShowLyricsView(false)}
                onLyricsChange={handleUpdateLyrics}
                accentColor={accentColor}
              />
            </Box>
          </Box>
        )}
      </AudioCompactContainer>
    );
  }

  /* ---------------- FULL HERO VARIANT ---------------- */
  if (variant === "full") {
    return (
      <AudioFullContainer
        tabIndex={0}
        role="region"
        aria-label="Audio Player"
        ref={containerRef}
        onKeyDown={handleKeyDown}
        sx={sx}
        className={className}
        style={style}
      >
        {audioElement}

        {/* Top Header Row */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="overline" sx={{ letterSpacing: 1.5, color: "text.secondary", fontWeight: 700 }}>
            Now Playing
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Visualizer Toggle */}
            <Tooltip title={useWaveSurfer ? "Switch to Animated Wave" : "Switch to WaveSurfer Visualizer"}>
              <IconButton
                size="small"
                onClick={() => setUseWaveSurfer(!useWaveSurfer)}
                sx={{ color: useWaveSurfer ? "primary.main" : "text.secondary" }}
              >
                <GraphicEqRounded fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Lyrics View Toggle */}
            <Tooltip title={showLyricsView ? "Show Artwork" : "Show Synchronized Lyrics"}>
              <IconButton
                size="small"
                onClick={() => setShowLyricsView(!showLyricsView)}
                sx={{ color: showLyricsView ? "primary.main" : currentLyrics ? "text.primary" : "text.secondary" }}
              >
                <LyricsRounded fontSize="small" />
              </IconButton>
            </Tooltip>

            {speedMenu}
            {onTogglePlaylistDrawer && (
              <Tooltip title="Playlist">
                <IconButton size="small" onClick={onTogglePlaylistDrawer}>
                  <QueueMusicRounded fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {extraControls}
          </Box>
        </Box>

        {/* Main Artwork or Lyrics Container */}
        {showLyricsView ? (
          <Box sx={{ height: 260, borderRadius: 2, overflow: "hidden" }}>
            <LyricsViewer
              lyrics={currentLyrics}
              currentTime={state.currentTime}
              isPlaying={state.isPlaying}
              onSeek={seek}
              onClose={() => setShowLyricsView(false)}
              onLyricsChange={handleUpdateLyrics}
              accentColor={accentColor}
            />
          </Box>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 3.5, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
            <AudioArtwork
              src={effectiveArtwork}
              alt={effectiveTitle}
              variant="rounded"
              size={160}
              isPlaying={state.isPlaying}
              sx={{ flexShrink: 0, mx: { xs: "auto", sm: 0 } }}
            >
              {!effectiveArtwork && <MusicNoteRounded sx={{ fontSize: 64 }} />}
            </AudioArtwork>

            <Box sx={{ flex: 1, minWidth: 0, textAlign: { xs: "center", sm: "left" } }}>
              <TrackTitle variant="h5" sx={{ fontSize: "1.4rem", mb: 0.5 }}>
                {effectiveTitle}
              </TrackTitle>
              <TrackArtist variant="subtitle1" sx={{ fontSize: "1rem", mb: 0.5 }}>
                {effectiveArtist || "Unknown Artist"}
              </TrackArtist>
              {effectiveAlbum && (
                <Typography variant="caption" sx={{ color: "text.disabled", display: "block", mb: 2 }}>
                  {effectiveAlbum}
                </Typography>
              )}

              {/* WaveSurfer or AudioWave rendering */}
              {showWaveform && (
                <Box sx={{ mt: 1, width: "100%" }}>
                  {useWaveSurfer ? (
                    <WaveSurferVisualizer
                      mediaElement={mediaRef.current}
                      url={src}
                      accentColor={accentColor}
                      height={48}
                      onSeek={seek}
                    />
                  ) : (
                    <Box sx={{ display: "flex", justifyContent: { xs: "center", sm: "flex-start" } }}>
                      <AudioWave isPlaying={state.isPlaying} barCount={20} accentColor={accentColor} />
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        )}

        {/* Scrubber / Seekbar */}
        <Box sx={{ width: "100%", px: 0.5 }}>
          <AudioSlider
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
            aria-label="audio seekbar"
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontVariantNumeric: "tabular-nums" }}>
              {formatTime(state.currentTime)}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", fontVariantNumeric: "tabular-nums" }}>
              {formatTime(state.duration)}
            </Typography>
          </Box>
        </Box>

        {/* Controls Bar */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Shuffle Button */}
          <Tooltip title={playlistCtx?.isShuffle ? "Shuffle On" : "Shuffle Off"}>
            <span>
              <IconButton
                size="small"
                onClick={() => playlistCtx?.toggleShuffle()}
                disabled={!hasPlaylist}
                sx={{ color: playlistCtx?.isShuffle ? "primary.main" : "text.secondary" }}
              >
                <ShuffleRounded fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          {/* Central Playback Controls */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {/* Previous */}
            <Tooltip title="Previous">
              <span>
                <IconButton
                  onClick={prevTrack}
                  disabled={!hasPrev && !hasPlaylist}
                  sx={{ color: "text.primary" }}
                >
                  <SkipPreviousRounded />
                </IconButton>
              </span>
            </Tooltip>

            {/* Rewind 10s */}
            <Tooltip title="Rewind 10s">
              <IconButton onClick={() => skip(-10)} sx={{ color: "text.secondary" }}>
                <Replay10Rounded fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Play/Pause Button */}
            <IconButton
              onClick={togglePlay}
              sx={{
                width: 58,
                height: 58,
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                boxShadow: 4,
                "&:hover": { backgroundColor: "primary.dark", transform: "scale(1.05)" },
                transition: "transform 0.15s ease",
              }}
            >
              {state.isBuffering ? (
                <CircularProgress size={28} color="inherit" />
              ) : state.isPlaying ? (
                <PauseRounded sx={{ fontSize: 32 }} />
              ) : (
                <PlayArrowRounded sx={{ fontSize: 32 }} />
              )}
            </IconButton>

            {/* Forward 10s */}
            <Tooltip title="Forward 10s">
              <IconButton onClick={() => skip(10)} sx={{ color: "text.secondary" }}>
                <Forward10Rounded fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Next */}
            <Tooltip title="Next">
              <span>
                <IconButton
                  onClick={nextTrack}
                  disabled={!hasNext && !hasPlaylist}
                  sx={{ color: "text.primary" }}
                >
                  <SkipNextRounded />
                </IconButton>
              </span>
            </Tooltip>
          </Box>

          {/* Repeat Mode */}
          <Tooltip title={`Repeat: ${playlistCtx?.repeatMode || "off"}`}>
            <span>
              <IconButton
                size="small"
                onClick={() => playlistCtx?.cycleRepeatMode()}
                disabled={!hasPlaylist}
              >
                {renderRepeatIcon()}
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* Volume Row */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1, pt: 1 }}>
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
              width: 100,
              color: "text.primary",
              "& .MuiSlider-thumb": { backgroundColor: "text.primary" },
            }}
          />
        </Box>
      </AudioFullContainer>
    );
  }

  /* ---------------- CARD VARIANT (DEFAULT) ---------------- */
  return (
    <AudioCardContainer
      tabIndex={0}
      role="region"
      aria-label="Audio Player Card"
      ref={containerRef}
      onKeyDown={handleKeyDown}
      sx={sx}
      className={className}
      style={style}
    >
      {audioElement}

      {/* Top Track Info Row */}
      {showLyricsView ? (
        <Box sx={{ height: 200, borderRadius: 2, overflow: "hidden", mb: 2 }}>
          <LyricsViewer
            lyrics={currentLyrics}
            currentTime={state.currentTime}
            isPlaying={state.isPlaying}
            onSeek={seek}
            onClose={() => setShowLyricsView(false)}
            onLyricsChange={handleUpdateLyrics}
            accentColor={accentColor}
          />
        </Box>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <AudioArtwork
            src={effectiveArtwork}
            alt={effectiveTitle}
            variant="rounded"
            size={64}
            isPlaying={state.isPlaying}
          >
            {!effectiveArtwork && <MusicNoteRounded />}
          </AudioArtwork>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <TrackTitle>{effectiveTitle}</TrackTitle>
            <TrackArtist>{effectiveArtist || "Unknown Artist"}</TrackArtist>
            {effectiveAlbum && (
              <Typography variant="caption" sx={{ color: "text.disabled", display: "block" }}>
                {effectiveAlbum}
              </Typography>
            )}
          </Box>

          {showWaveform && (
            <Box sx={{ display: { xs: "none", sm: "flex" } }}>
              <AudioWave isPlaying={state.isPlaying} barCount={10} accentColor={accentColor} />
            </Box>
          )}
        </Box>
      )}

      {/* WaveSurfer visualizer in card mode if enabled */}
      {useWaveSurfer && !showLyricsView && (
        <Box sx={{ my: 1, width: "100%" }}>
          <WaveSurferVisualizer
            mediaElement={mediaRef.current}
            url={src}
            accentColor={accentColor}
            height={40}
            onSeek={seek}
          />
        </Box>
      )}

      {/* Seekbar and Timestamps */}
      <Box sx={{ width: "100%", px: 0.5 }}>
        <AudioSlider
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
          aria-label="audio seekbar"
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="caption" sx={{ color: "text.secondary", fontVariantNumeric: "tabular-nums" }}>
            {formatTime(state.currentTime)}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontVariantNumeric: "tabular-nums" }}>
            {formatTime(state.duration)}
          </Typography>
        </Box>
      </Box>

      {/* Controls Row */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Shuffle */}
        <Tooltip title={playlistCtx?.isShuffle ? "Shuffle On" : "Shuffle Off"}>
          <span>
            <IconButton
              size="small"
              onClick={() => playlistCtx?.toggleShuffle()}
              disabled={!hasPlaylist}
              sx={{ color: playlistCtx?.isShuffle ? "primary.main" : "text.secondary" }}
            >
              <ShuffleRounded fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        {/* Central Controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Previous Track */}
          <Tooltip title="Previous">
            <span>
              <IconButton
                size="small"
                onClick={prevTrack}
                disabled={!hasPrev && !hasPlaylist}
              >
                <SkipPreviousRounded fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          {/* Skip -10s */}
          <Tooltip title="Rewind 10s">
            <IconButton size="small" onClick={() => skip(-10)}>
              <Replay10Rounded fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Play/Pause Button */}
          <IconButton
            onClick={togglePlay}
            sx={{
              width: 48,
              height: 48,
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              "&:hover": { backgroundColor: "primary.dark", transform: "scale(1.05)" },
              transition: "transform 0.15s ease",
            }}
          >
            {state.isBuffering ? (
              <CircularProgress size={24} color="inherit" />
            ) : state.isPlaying ? (
              <PauseRounded />
            ) : (
              <PlayArrowRounded />
            )}
          </IconButton>

          {/* Skip +10s */}
          <Tooltip title="Forward 10s">
            <IconButton size="small" onClick={() => skip(10)}>
              <Forward10Rounded fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Next Track */}
          <Tooltip title="Next">
            <span>
              <IconButton
                size="small"
                onClick={nextTrack}
                disabled={!hasNext && !hasPlaylist}
              >
                <SkipNextRounded fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* Repeat Mode */}
        <Tooltip title={`Repeat: ${playlistCtx?.repeatMode || "off"}`}>
          <span>
            <IconButton
              size="small"
              onClick={() => playlistCtx?.cycleRepeatMode()}
              disabled={!hasPlaylist}
            >
              {renderRepeatIcon()}
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {/* Bottom Tool Bar: Volume, Lyrics, WaveSurfer, Speed & Playlist Drawer toggle */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pt: 0.5 }}>
        {/* Volume */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
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

        {/* Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {/* WaveSurfer Toggle */}
          <Tooltip title={useWaveSurfer ? "Hide Waveform" : "Show WaveSurfer Visualizer"}>
            <IconButton
              size="small"
              onClick={() => setUseWaveSurfer(!useWaveSurfer)}
              sx={{ color: useWaveSurfer ? "primary.main" : "text.secondary" }}
            >
              <GraphicEqRounded fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Lyrics View Toggle */}
          <Tooltip title={showLyricsView ? "Hide Lyrics" : "Show Synchronized Lyrics"}>
            <IconButton
              size="small"
              onClick={() => setShowLyricsView(!showLyricsView)}
              sx={{ color: showLyricsView ? "primary.main" : currentLyrics ? "text.primary" : "text.secondary" }}
            >
              <LyricsRounded fontSize="small" />
            </IconButton>
          </Tooltip>

          {speedMenu}
          {onTogglePlaylistDrawer && (
            <Tooltip title="Playlist">
              <IconButton size="small" onClick={onTogglePlaylistDrawer}>
                <QueueMusicRounded fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {extraControls}
        </Box>
      </Box>
    </AudioCardContainer>
  );
};

import { CSSProperties, SyntheticEvent } from "react";
import { SxProps, Theme } from "@mui/material";
import { SubtitleTrack, AudioTrackOption, AudioLyrics, ID3Metadata } from "./tracks";

export type MediaType = "video" | "audio" | "youtube" | "auto";

export type AudioPlayerVariant = "compact" | "card" | "full";

export type RepeatMode = "off" | "all" | "one";

export type MediaCenterMode = "modal" | "embedded";

export type MediaBarPosition = "bottom" | "top" | "floating";

export type AspectRatio = "16/9" | "4/3" | "1/1" | "21/9" | "auto" | string;

export interface MediaTrackSource {
  src: string;
  type?: string;
  label?: string;
}

export interface MediaErrorState {
  code?: number;
  message: string;
}

export interface MediaControllerState {
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  isFullscreen: boolean;
  isPiP: boolean;
  isSeeking: boolean;
  bufferedEnd: number;
  error: MediaErrorState | null;
}

export interface BasePlayerProps {
  /** Source URL or array of source tracks */
  src?: string;
  /** Primary title of the media */
  title?: string;
  /** Subtitle or creator name */
  subtitle?: string;
  /** Auto start playback */
  autoPlay?: boolean;
  /** Loop playback */
  loop?: boolean;
  /** Initial muted state */
  muted?: boolean;
  /** Initial volume (0 to 1) */
  defaultVolume?: number;
  /** Initial playback speed (default 1) */
  defaultPlaybackRate?: number;
  /** Preload policy */
  preload?: "none" | "metadata" | "auto";
  /** Plays inline on mobile browsers */
  playsInline?: boolean;
  /** Cross origin attribute */
  crossOrigin?: "anonymous" | "use-credentials";
  /** MUI palette color or custom color */
  accentColor?: "primary" | "secondary" | "success" | "error" | "info" | "warning" | string;
  /** Custom SX styling */
  sx?: SxProps<Theme>;
  /** Custom CSS class name */
  className?: string;
  /** Custom inline style */
  style?: CSSProperties;
  /** Available subtitle / closed caption tracks */
  subtitles?: SubtitleTrack[];
  /** Controlled active subtitle ID (pass null for disabled) */
  activeSubtitleId?: string | null;
  /** Callback when user changes active subtitle track */
  onSubtitleChange?: (subtitleId: string | null) => void;
  /** Available multiple audio tracks (for videos with alternate audio or languages) */
  audioTracks?: AudioTrackOption[];
  /** Controlled active audio track ID */
  activeAudioTrackId?: string | null;
  /** Callback when user changes active audio track */
  onAudioTrackChange?: (audioTrackId: string) => void;
  /** Synchronized or unsynchronized lyrics (as object or LRC string) */
  lyrics?: AudioLyrics | string;
  /** Whether to automatically extract ID3 metadata (lyrics, album art) from audio files */
  autoExtractID3?: boolean;
  /** Callback when ID3 tags are extracted from the media file */
  onID3Parsed?: (metadata: ID3Metadata) => void;
  /** Callback when lyrics are updated, injected, or synchronized */
  onLyricsChange?: (lyrics: AudioLyrics) => void;
  /** Enable interactive WaveSurfer canvas audio visualizer */
  enableWaveSurfer?: boolean;
  /** Callback when media starts playing */
  onPlay?: () => void;
  /** Callback when media pauses */
  onPause?: () => void;
  /** Callback when media finishes */
  onEnded?: () => void;
  /** Callback when playback time updates */
  onTimeUpdate?: (currentTime: number) => void;
  /** Callback when media duration is determined */
  onDurationChange?: (duration: number) => void;
  /** Callback when volume changes */
  onVolumeChange?: (volume: number, isMuted: boolean) => void;
  /** Callback when playback rate changes */
  onPlaybackRateChange?: (rate: number) => void;
  /** Callback on media error */
  onError?: (error: MediaErrorState, event?: SyntheticEvent<HTMLMediaElement>) => void;
  /** Disable built-in keyboard hotkeys */
  disableKeyboard?: boolean;
  /** Disable PiP functionality */
  disablePiP?: boolean;
  /** Disable Fullscreen functionality */
  disableFullscreen?: boolean;
}

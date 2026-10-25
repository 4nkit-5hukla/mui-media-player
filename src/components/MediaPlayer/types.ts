import { ReactNode } from "react";
import { AspectRatio, AudioPlayerVariant, BasePlayerProps, MediaType } from "../../types/player";
import { PlaylistItem } from "../../types/playlist";

export interface MediaPlayerProps extends BasePlayerProps {
  /** Explicit media type override ('video' | 'audio' | 'youtube' | 'auto'). Defaults to 'auto'. */
  type?: MediaType;
  /** Poster / thumbnail for video */
  poster?: string;
  /** Artwork thumbnail for audio */
  artwork?: string;
  /** Artist name */
  artist?: string;
  /** Album title */
  album?: string;
  /** Aspect ratio for video player (default '16/9') */
  aspectRatio?: AspectRatio;
  /** Audio player layout variant ('compact' | 'card' | 'full'). Defaults to 'card'. */
  audioVariant?: AudioPlayerVariant;
  /** Whether to show animated waveform bars for audio (default true) */
  showWaveform?: boolean;
  /** Callback when close button clicked */
  onClose?: () => void;
  /** Top overlay action buttons (for video) */
  headerActions?: ReactNode;
  /** Extra controls for both audio and video */
  extraControls?: ReactNode;
  /** Custom speed options */
  speedOptions?: number[];
  /** Optional playlist items */
  playlist?: PlaylistItem[];
  /** Current playlist index */
  playlistIndex?: number;
  /** Callback when next track is requested */
  onNext?: () => void;
  /** Callback when previous track is requested */
  onPrev?: () => void;
  /** Callback to open/toggle playlist drawer */
  onTogglePlaylistDrawer?: () => void;
}

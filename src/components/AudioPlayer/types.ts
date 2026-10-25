import { ReactNode } from "react";
import { AudioPlayerVariant, BasePlayerProps } from "../../types/player";
import { PlaylistItem } from "../../types/playlist";

export interface AudioPlayerProps extends BasePlayerProps {
  /** Album / track artwork URL */
  artwork?: string;
  /** Artist / musician name */
  artist?: string;
  /** Album or collection title */
  album?: string;
  /** Visual variant: 'compact' | 'card' | 'full' (default 'card') */
  variant?: AudioPlayerVariant;
  /** Whether to show animated waveform bars (default true) */
  showWaveform?: boolean;
  /** Custom playback speeds to show in speed menu */
  speedOptions?: number[];
  /** Optional playlist items if this player manages a playlist */
  playlist?: PlaylistItem[];
  /** Current index in playlist */
  playlistIndex?: number;
  /** Whether to show next/prev buttons when playlist is present */
  showPlaylistControls?: boolean;
  /** Callback when next track in playlist requested */
  onNext?: () => void;
  /** Callback when prev track in playlist requested */
  onPrev?: () => void;
  /** Whether to show a playlist drawer toggle button */
  onTogglePlaylistDrawer?: () => void;
  /** Extra ReactNode controls */
  extraControls?: ReactNode;
}

import { ReactNode } from "react";
import { AspectRatio, BasePlayerProps } from "../../types/player";
import { PlaylistItem } from "../../types/playlist";

export interface VideoPlayerProps extends BasePlayerProps {
  /** Video poster / thumbnail image URL */
  poster?: string;
  /** Aspect ratio of player: '16/9', '4/3', '1/1', '21/9', 'auto', or CSS aspect-ratio */
  aspectRatio?: AspectRatio;
  /** Callback when close button in top overlay is clicked */
  onClose?: () => void;
  /** Extra ReactNode buttons to show on top-right overlay */
  headerActions?: ReactNode;
  /** Extra ReactNode controls to show on bottom control bar */
  extraControls?: ReactNode;
  /** Controls hide timeout in ms (default 2500) */
  hideControlsTimeout?: number;
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
}

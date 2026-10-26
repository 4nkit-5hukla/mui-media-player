import { MediaType, RepeatMode } from "./player";
import { SubtitleTrack, AudioTrackOption, AudioLyrics } from "./tracks";

export interface PlaylistItem {
  /** Unique identifier for the item */
  id: string | number;
  /** Title of the track / video */
  title: string;
  /** Stream URL or file URL */
  src: string;
  /** Explicit media type, or auto-detected */
  type?: MediaType;
  /** Subtitle or artist name */
  artist?: string;
  /** Album or collection name */
  album?: string;
  /** Thumbnail / Artwork image URL */
  artwork?: string;
  /** Poster image URL for video */
  poster?: string;
  /** Known duration in seconds (optional) */
  duration?: number;
  /** Subtitle tracks for this item (if video) */
  subtitles?: SubtitleTrack[];
  /** Audio tracks for this item (if multi-audio video) */
  audioTracks?: AudioTrackOption[];
  /** Lyrics for this item (if audio/song) */
  lyrics?: AudioLyrics | string;
  /** Extra arbitrary metadata */
  metadata?: Record<string, unknown>;
}

export interface PlaylistContextValue {
  /** All items in the current playlist */
  items: PlaylistItem[];
  /** Index of currently playing item */
  currentIndex: number;
  /** Currently playing item */
  currentItem: PlaylistItem | null;
  /** Queue of upcoming items */
  queue: PlaylistItem[];
  /** Whether playlist shuffle is active */
  isShuffle: boolean;
  /** Current repeat mode */
  repeatMode: RepeatMode;
  /** Has next item available */
  hasNext: boolean;
  /** Has previous item available */
  hasPrev: boolean;
  /** Set entire playlist */
  setPlaylist: (items: PlaylistItem[], startIndex?: number) => void;
  /** Play item by index or id */
  playItem: (indexOrId: number | string) => void;
  /** Advance to next item */
  next: () => void;
  /** Go back to previous item */
  prev: () => void;
  /** Add item to queue (next up) */
  addToQueue: (item: PlaylistItem) => void;
  /** Remove item from queue by index */
  removeFromQueue: (index: number) => void;
  /** Clear queue */
  clearQueue: () => void;
  /** Toggle shuffle state */
  toggleShuffle: (forced?: boolean) => void;
  /** Cycle repeat mode (off -> all -> one -> off) */
  cycleRepeatMode: () => void;
  /** Set repeat mode */
  setRepeatMode: (mode: RepeatMode) => void;
}

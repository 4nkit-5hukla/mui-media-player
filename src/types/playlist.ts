import { MediaType, RepeatMode } from "./player";

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
  /** Add item to queue */
  addToQueue: (item: PlaylistItem | PlaylistItem[]) => void;
  /** Remove item from queue */
  removeFromQueue: (indexOrId: number | string) => void;
  /** Clear remaining queue */
  clearQueue: () => void;
  /** Toggle or set shuffle mode */
  toggleShuffle: (forced?: boolean) => void;
  /** Cycle repeat mode: off -> all -> one -> off */
  cycleRepeatMode: () => void;
  /** Set specific repeat mode */
  setRepeatMode: (mode: RepeatMode) => void;
}

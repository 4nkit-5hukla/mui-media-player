import { useState, useCallback, useMemo } from "react";
import { PlaylistItem, PlaylistContextValue } from "../types/playlist";
import { RepeatMode } from "../types/player";

export interface UsePlaylistOptions {
  initialItems?: PlaylistItem[];
  initialIndex?: number;
  initialShuffle?: boolean;
  initialRepeatMode?: RepeatMode;
}

export function usePlaylist(options: UsePlaylistOptions = {}): PlaylistContextValue {
  const {
    initialItems = [],
    initialIndex = 0,
    initialShuffle = false,
    initialRepeatMode = "off",
  } = options;

  const [items, setItems] = useState<PlaylistItem[]>(initialItems);
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [queue, setQueue] = useState<PlaylistItem[]>([]);
  const [isShuffle, setIsShuffle] = useState<boolean>(initialShuffle);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(initialRepeatMode);

  const currentItem = useMemo(() => {
    if (items.length === 0) return null;
    return items[currentIndex] || null;
  }, [items, currentIndex]);

  const hasNext = useMemo(() => {
    if (queue.length > 0) return true;
    if (repeatMode === "all" && items.length > 0) return true;
    return currentIndex < items.length - 1;
  }, [queue.length, repeatMode, items.length, currentIndex]);

  const hasPrev = useMemo(() => {
    if (repeatMode === "all" && items.length > 0) return true;
    return currentIndex > 0;
  }, [repeatMode, items.length, currentIndex]);

  const setPlaylist = useCallback(
    (newItems: PlaylistItem[], startIndex = 0) => {
      setItems(newItems);
      const safeIndex = Math.max(0, Math.min(newItems.length - 1, startIndex));
      setCurrentIndex(safeIndex);
      setQueue([]);
    },
    []
  );

  const playItem = useCallback(
    (indexOrId: number | string) => {
      if (typeof indexOrId === "number") {
        if (indexOrId >= 0 && indexOrId < items.length) {
          setCurrentIndex(indexOrId);
        }
      } else {
        const found = items.findIndex((it) => String(it.id) === String(indexOrId));
        if (found !== -1) {
          setCurrentIndex(found);
        }
      }
    },
    [items]
  );

  const next = useCallback(() => {
    if (queue.length > 0) {
      // Dequeue next item
      const nextItem = queue[0];
      setQueue((prev) => prev.slice(1));
      const foundIdx = items.findIndex((it) => it.id === nextItem.id);
      if (foundIdx !== -1) {
        setCurrentIndex(foundIdx);
      } else {
        // Add to items and play
        setItems((prev) => [...prev, nextItem]);
        setCurrentIndex(items.length);
      }
      return;
    }

    if (items.length === 0) return;

    if (isShuffle) {
      if (items.length <= 1) return;
      let randIdx = currentIndex;
      while (randIdx === currentIndex) {
        randIdx = Math.floor(Math.random() * items.length);
      }
      setCurrentIndex(randIdx);
      return;
    }

    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (repeatMode === "all") {
      setCurrentIndex(0);
    }
  }, [queue, items, isShuffle, currentIndex, repeatMode]);

  const prev = useCallback(() => {
    if (items.length === 0) return;

    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (repeatMode === "all") {
      setCurrentIndex(items.length - 1);
    }
  }, [items.length, currentIndex, repeatMode]);

  const addToQueue = useCallback((itemOrItems: PlaylistItem | PlaylistItem[]) => {
    const toAdd = Array.isArray(itemOrItems) ? itemOrItems : [itemOrItems];
    setQueue((prev) => [...prev, ...toAdd]);
  }, []);

  const removeFromQueue = useCallback((indexOrId: number | string) => {
    if (typeof indexOrId === "number") {
      setQueue((prev) => prev.filter((_, idx) => idx !== indexOrId));
    } else {
      setQueue((prev) => prev.filter((it) => String(it.id) !== String(indexOrId)));
    }
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const toggleShuffle = useCallback((forced?: boolean) => {
    setIsShuffle((prev) => (typeof forced === "boolean" ? forced : !prev));
  }, []);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
  }, []);

  return {
    items,
    currentIndex,
    currentItem,
    queue,
    isShuffle,
    repeatMode,
    hasNext,
    hasPrev,
    setPlaylist,
    playItem,
    next,
    prev,
    addToQueue,
    removeFromQueue,
    clearQueue,
    toggleShuffle,
    cycleRepeatMode,
    setRepeatMode,
  };
}

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePlaylist } from "../hooks/usePlaylist";
import { PlaylistItem } from "../types/playlist";

const mockItems: PlaylistItem[] = [
  { id: "1", title: "Song 1", src: "https://example.com/1.mp3", type: "audio" },
  { id: "2", title: "Video 2", src: "https://example.com/2.mp4", type: "video" },
  { id: "3", title: "Song 3", src: "https://example.com/3.mp3", type: "audio" },
];

describe("usePlaylist hook", () => {
  it("initializes with items and index", () => {
    const { result } = renderHook(() =>
      usePlaylist({ initialItems: mockItems, initialIndex: 0 })
    );

    expect(result.current.items).toHaveLength(3);
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentItem?.title).toBe("Song 1");
    expect(result.current.hasNext).toBe(true);
    expect(result.current.hasPrev).toBe(false);
  });

  it("navigates next and prev", () => {
    const { result } = renderHook(() =>
      usePlaylist({ initialItems: mockItems, initialIndex: 0 })
    );

    act(() => {
      result.current.next();
    });
    expect(result.current.currentIndex).toBe(1);
    expect(result.current.currentItem?.title).toBe("Video 2");

    act(() => {
      result.current.prev();
    });
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentItem?.title).toBe("Song 1");
  });

  it("handles repeat modes cycle", () => {
    const { result } = renderHook(() =>
      usePlaylist({ initialItems: mockItems, initialIndex: 0 })
    );

    expect(result.current.repeatMode).toBe("off");

    act(() => {
      result.current.cycleRepeatMode();
    });
    expect(result.current.repeatMode).toBe("all");

    act(() => {
      result.current.cycleRepeatMode();
    });
    expect(result.current.repeatMode).toBe("one");

    act(() => {
      result.current.cycleRepeatMode();
    });
    expect(result.current.repeatMode).toBe("off");
  });

  it("handles queue management", () => {
    const { result } = renderHook(() =>
      usePlaylist({ initialItems: mockItems, initialIndex: 0 })
    );

    const queuedItem: PlaylistItem = {
      id: "q1",
      title: "Queued Song",
      src: "https://example.com/q.mp3",
    };

    act(() => {
      result.current.addToQueue(queuedItem);
    });
    expect(result.current.queue).toHaveLength(1);

    // Calling next() should dequeue this item
    act(() => {
      result.current.next();
    });
    expect(result.current.queue).toHaveLength(0);
    expect(result.current.currentItem?.id).toBe("q1");
  });
});

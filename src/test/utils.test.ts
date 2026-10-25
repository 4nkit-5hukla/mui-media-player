import { describe, it, expect } from "vitest";
import { formatTime } from "../utils/formatTime";
import {
  extractYouTubeId,
  detectMediaType,
  getFileExtension,
  buildYouTubeEmbedUrl,
} from "../utils/mediaDetection";

describe("formatTime", () => {
  it("formats seconds under one minute", () => {
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(9)).toBe("0:09");
    expect(formatTime(45)).toBe("0:45");
  });

  it("formats minutes and seconds", () => {
    expect(formatTime(60)).toBe("1:00");
    expect(formatTime(125)).toBe("2:05");
    expect(formatTime(599)).toBe("9:59");
  });

  it("formats hours, minutes and seconds", () => {
    expect(formatTime(3600)).toBe("1:00:00");
    expect(formatTime(3665)).toBe("1:01:05");
    expect(formatTime(7322)).toBe("2:02:02");
  });

  it("handles negative or invalid values gracefully", () => {
    expect(formatTime(-10)).toBe("0:00");
    expect(formatTime(NaN)).toBe("0:00");
    expect(formatTime(undefined)).toBe("0:00");
  });
});

describe("mediaDetection", () => {
  it("extracts YouTube ID from various URL formats", () => {
    expect(extractYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    );
    expect(extractYouTubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(extractYouTubeId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    );
    expect(extractYouTubeId("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    );
    expect(extractYouTubeId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("detects audio extensions", () => {
    expect(getFileExtension("song.mp3")).toBe("mp3");
    expect(getFileExtension("https://domain.com/path/audio.wav?token=123")).toBe("wav");
    expect(detectMediaType("track.mp3")).toBe("audio");
    expect(detectMediaType("podcast.m4a")).toBe("audio");
    expect(detectMediaType("track.flac")).toBe("audio");
  });

  it("detects video extensions", () => {
    expect(detectMediaType("movie.mp4")).toBe("video");
    expect(detectMediaType("clip.webm")).toBe("video");
    expect(detectMediaType("video.mov")).toBe("video");
  });

  it("detects YouTube URLs as youtube", () => {
    expect(detectMediaType("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "youtube"
    );
  });

  it("honors explicit type override", () => {
    expect(detectMediaType("anything.mp4", "audio")).toBe("audio");
    expect(detectMediaType("anything.mp3", "video")).toBe("video");
  });

  it("builds YouTube embed URL correctly", () => {
    const url = buildYouTubeEmbedUrl("dQw4w9WgXcQ", true, true);
    expect(url).toContain("https://www.youtube.com/embed/dQw4w9WgXcQ");
    expect(url).toContain("autoplay=1");
    expect(url).toContain("mute=1");
  });
});

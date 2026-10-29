import { describe, it, expect } from "vitest";
import { formatTime } from "../utils/formatTime";
import {
  extractYouTubeId,
  detectMediaType,
  getFileExtension,
  buildYouTubeEmbedUrl,
} from "../utils/mediaDetection";
import {
  parseLRC,
  parseLrcTimestamp,
  formatLrcTimestamp,
  formatLRC,
  findActiveLyricIndex,
  normalizeLyrics,
} from "../utils/lrcParser";
import {
  parseVTTorSRT,
  parseVttTimestamp,
  findActiveSubtitleCue,
} from "../utils/vttParser";
import { parseID3FromBuffer } from "../utils/id3Parser";
import { generateDeterministicPeaks } from "../utils/wavePeaks";

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

describe("lrcParser", () => {
  it("parses LRC timestamps correctly", () => {
    expect(parseLrcTimestamp("[01:23.45]")).toBe(83.45);
    expect(parseLrcTimestamp("[00:05.120]")).toBeCloseTo(5.12, 2);
    expect(parseLrcTimestamp("invalid")).toBeNull();
  });

  it("formats timestamps into [mm:ss.xx]", () => {
    expect(formatLrcTimestamp(83.45)).toBe("[01:23.45]");
    expect(formatLrcTimestamp(5.5)).toBe("[00:05.50]");
  });

  it("parses multi-line LRC text with metadata", () => {
    const lrc = `
[ti:Midnight Drive]
[ar:Synthwave Masters]
[00:05.00]Cruising down the highway
[00:12.50]Neon lights in the rain
[00:20.00]Never looking back again
    `.trim();

    const result = parseLRC(lrc);
    expect(result.title).toBe("Midnight Drive");
    expect(result.artist).toBe("Synthwave Masters");
    expect(result.lines).toHaveLength(3);
    expect(result.lines![0].time).toBe(5);
    expect(result.lines![0].text).toBe("Cruising down the highway");
    expect(result.lines![1].time).toBe(12.5);
  });

  it("formats structured lyrics back to standard LRC string", () => {
    const lyrics = {
      title: "Sample Song",
      artist: "Sample Artist",
      lines: [
        { time: 5, text: "First line" },
        { time: 10, text: "Second line" },
      ],
    };
    const formatted = formatLRC(lyrics);
    expect(formatted).toContain("[ti:Sample Song]");
    expect(formatted).toContain("[00:05.00] First line");
  });

  it("finds active lyric line based on playback time", () => {
    const lines = [
      { time: 5, text: "Line 1" },
      { time: 10, text: "Line 2" },
      { time: 15, text: "Line 3" },
    ];

    expect(findActiveLyricIndex(lines, 2)).toBe(-1);
    expect(findActiveLyricIndex(lines, 5)).toBe(0);
    expect(findActiveLyricIndex(lines, 7.5)).toBe(0);
    expect(findActiveLyricIndex(lines, 12)).toBe(1);
    expect(findActiveLyricIndex(lines, 25)).toBe(2);
  });

  it("normalizes string input with and without timestamps", () => {
    const plain = "Hello world\nThis is plain lyrics";
    const normPlain = normalizeLyrics(plain);
    expect(normPlain?.rawText).toBe(plain);
    expect(normPlain?.lines).toHaveLength(0);

    const lrc = "[00:01.00] Hello";
    const normLrc = normalizeLyrics(lrc);
    expect(normLrc?.lines).toHaveLength(1);
  });
});

describe("vttParser", () => {
  it("parses VTT timestamps", () => {
    expect(parseVttTimestamp("00:01:23.500")).toBe(83.5);
    expect(parseVttTimestamp("01:23.500")).toBe(83.5);
    expect(parseVttTimestamp("00:00:05,250")).toBe(5.25);
  });

  it("parses WebVTT content", () => {
    const vtt = `WEBVTT

00:01.000 --> 00:04.000
Welcome to EasySocial Media

00:04.500 --> 00:08.000
Enjoy high-definition playback
    `;
    const cues = parseVTTorSRT(vtt);
    expect(cues).toHaveLength(2);
    expect(cues[0].start).toBe(1);
    expect(cues[0].end).toBe(4);
    expect(cues[0].text).toBe("Welcome to EasySocial Media");
    expect(cues[1].start).toBe(4.5);
  });

  it("finds active subtitle cue", () => {
    const cues = [
      { start: 1, end: 4, text: "Hello" },
      { start: 5, end: 8, text: "World" },
    ];
    expect(findActiveSubtitleCue(cues, 0.5)).toBeNull();
    expect(findActiveSubtitleCue(cues, 2)?.text).toBe("Hello");
    expect(findActiveSubtitleCue(cues, 4.5)).toBeNull();
    expect(findActiveSubtitleCue(cues, 6)?.text).toBe("World");
  });
});

describe("id3Parser", () => {
  it("gracefully returns empty metadata for non-ID3 buffers", () => {
    const buffer = new ArrayBuffer(20);
    const meta = parseID3FromBuffer(buffer);
    expect(meta).toEqual({});
  });

  it("parses synthetic ID3v2.3 buffer with TIT2 and TPE1 frames", () => {
    // Construct minimal valid ID3v2.3 tag
    // Header (10 bytes): 'ID3', v2.3, flags 0, synchsafe size 30
    const buffer = new ArrayBuffer(60);
    const view = new DataView(buffer);
    const u8 = new Uint8Array(buffer);

    u8[0] = 0x49; // I
    u8[1] = 0x44; // D
    u8[2] = 0x33; // 3
    u8[3] = 3;    // major version 3
    u8[4] = 0;    // revision
    u8[5] = 0;    // flags
    // size 40 synchsafe:
    u8[9] = 40;

    // Frame 1: TIT2 (title)
    // ID: TIT2
    u8[10] = 0x54; u8[11] = 0x49; u8[12] = 0x54; u8[13] = 0x32;
    // size 6 (encoding + "Test")
    view.setUint32(14, 5, false);
    // flags (2 bytes) = 0
    u8[18] = 0; u8[19] = 0;
    // encoding: 0 (ISO-8859-1)
    u8[20] = 0;
    // text: "Test"
    u8[21] = 0x54; u8[22] = 0x65; u8[23] = 0x73; u8[24] = 0x74;

    const parsed = parseID3FromBuffer(buffer);
    expect(parsed.title).toBe("Test");
  });
});

describe("generateDeterministicPeaks", () => {
  it("generates correct number of peaks", () => {
    const peaks = generateDeterministicPeaks("test-seed", 50);
    expect(peaks).toHaveLength(50);
    peaks.forEach((p) => {
      expect(p).toBeGreaterThanOrEqual(0.1);
      expect(p).toBeLessThanOrEqual(1.0);
    });
  });

  it("produces deterministic output for the same seed", () => {
    const peaks1 = generateDeterministicPeaks("my-audio-track", 64);
    const peaks2 = generateDeterministicPeaks("my-audio-track", 64);
    expect(peaks1).toEqual(peaks2);
  });

  it("handles numeric seeds and default counts", () => {
    const peaks = generateDeterministicPeaks(180);
    expect(peaks.length).toBeGreaterThan(0);
  });
});

import { LyricLine, AudioLyrics } from "../types/tracks";

/**
 * Parses timestamp string "[mm:ss.xx]" or "[mm:ss.xxx]" into seconds.
 */
export function parseLrcTimestamp(timestamp: string): number | null {
  const match = timestamp.match(/\[(\d{1,3}):(\d{2})(?:\.(\d{1,3}))?\]/);
  if (!match) return null;

  const minutes = parseInt(match[1], 10);
  const seconds = parseInt(match[2], 10);
  const fractionStr = match[3] || "0";
  const fraction = parseFloat(`0.${fractionStr}`);

  return minutes * 60 + seconds + fraction;
}

/**
 * Formats time in seconds into standard LRC timestamp "[mm:ss.xx]".
 */
export function formatLrcTimestamp(timeInSeconds: number): string {
  const safeTime = Math.max(0, timeInSeconds);
  const minutes = Math.floor(safeTime / 60);
  const seconds = Math.floor(safeTime % 60);
  const hundredths = Math.floor((safeTime % 1) * 100);

  const mm = minutes.toString().padStart(2, "0");
  const ss = seconds.toString().padStart(2, "0");
  const xx = hundredths.toString().padStart(2, "0");

  return `[${mm}:${ss}.${xx}]`;
}

/**
 * Parses standard LRC text string into structured AudioLyrics object.
 */
export function parseLRC(lrcText: string): AudioLyrics {
  if (!lrcText || typeof lrcText !== "string") {
    return { lines: [], rawText: "" };
  }

  const lines: LyricLine[] = [];
  let title: string | undefined;
  let artist: string | undefined;

  const rawLines = lrcText.split(/\r?\n/);

  for (const rawLine of rawLines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    // Check metadata tags e.g. [ti:Song Title], [ar:Artist]
    const titleMatch = trimmed.match(/^\[ti:(.+)\]$/i);
    if (titleMatch) {
      title = titleMatch[1].trim();
      continue;
    }

    const artistMatch = trimmed.match(/^\[ar:(.+)\]$/i);
    if (artistMatch) {
      artist = artistMatch[1].trim();
      continue;
    }

    // Check for timestamps: matches one or more [mm:ss.xx] timestamps followed by text
    const timeRegex = /\[\d{1,3}:\d{2}(?:\.\d{1,3})?\]/g;
    const timestamps = trimmed.match(timeRegex);

    if (timestamps && timestamps.length > 0) {
      // Extract the text by stripping the timestamps
      const text = trimmed.replace(timeRegex, "").trim();

      for (const ts of timestamps) {
        const time = parseLrcTimestamp(ts);
        if (time !== null) {
          lines.push({ time, text });
        }
      }
    }
  }

  // Sort lines chronologically
  lines.sort((a, b) => a.time - b.time);

  return {
    title,
    artist,
    lines,
    rawText: lrcText,
    source: lines.length > 0 ? "lrc" : undefined,
  };
}

/**
 * Normalizes string or AudioLyrics input into a unified AudioLyrics object.
 */
export function normalizeLyrics(input?: AudioLyrics | string): AudioLyrics | null {
  if (!input) return null;

  if (typeof input === "string") {
    const parsed = parseLRC(input);
    if (parsed.lines && parsed.lines.length > 0) {
      return parsed;
    }
    // If no timestamps detected, treat as plain text lyrics
    return {
      rawText: input.trim(),
      lines: [],
      source: "user",
    };
  }

  return input;
}

/**
 * Formats AudioLyrics into a clean LRC format string.
 */
export function formatLRC(lyrics: AudioLyrics): string {
  const parts: string[] = [];

  if (lyrics.title) {
    parts.push(`[ti:${lyrics.title}]`);
  }
  if (lyrics.artist) {
    parts.push(`[ar:${lyrics.artist}]`);
  }

  if (lyrics.lines && lyrics.lines.length > 0) {
    for (const line of lyrics.lines) {
      parts.push(`${formatLrcTimestamp(line.time)} ${line.text}`);
    }
  } else if (lyrics.rawText) {
    parts.push(lyrics.rawText);
  }

  return parts.join("\n");
}

/**
 * Finds the index of the currently active lyric line for a given playback timestamp.
 */
export function findActiveLyricIndex(lines: LyricLine[], currentTime: number): number {
  if (!lines || lines.length === 0) return -1;

  // If before first line
  if (currentTime < lines[0].time) return -1;

  // Search for the latest line where line.time <= currentTime
  let activeIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].time <= currentTime) {
      activeIndex = i;
    } else {
      break;
    }
  }

  return activeIndex;
}

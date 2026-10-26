import { SubtitleCue } from "../types/tracks";

/**
 * Parses timestamp string "hh:mm:ss.mmm" or "mm:ss.mmm" into seconds.
 */
export function parseVttTimestamp(timestamp: string): number | null {
  const clean = timestamp.trim().replace(",", ".");
  const parts = clean.split(":");

  if (parts.length === 3) {
    const hours = parseFloat(parts[0]);
    const minutes = parseFloat(parts[1]);
    const seconds = parseFloat(parts[2]);
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return null;
    return hours * 3600 + minutes * 60 + seconds;
  }

  if (parts.length === 2) {
    const minutes = parseFloat(parts[0]);
    const seconds = parseFloat(parts[1]);
    if (isNaN(minutes) || isNaN(seconds)) return null;
    return minutes * 60 + seconds;
  }

  return null;
}

/**
 * Parses WebVTT or SRT content into an array of SubtitleCue objects.
 */
export function parseVTTorSRT(content: string): SubtitleCue[] {
  if (!content || typeof content !== "string") return [];

  const cues: SubtitleCue[] = [];
  // Normalize line endings and split by double newline
  const blocks = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split(/\n\s*\n/);

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed || trimmed === "WEBVTT" || trimmed.startsWith("NOTE")) {
      continue;
    }

    const lines = trimmed.split("\n");
    let timeLineIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("-->")) {
        timeLineIndex = i;
        break;
      }
    }

    if (timeLineIndex === -1) continue;

    const timeLine = lines[timeLineIndex];
    const [startStr, endStr] = timeLine.split("-->").map((s) => s.trim());
    if (!startStr || !endStr) continue;

    // Remove any alignment or cue settings like "line:0% position:50%"
    const cleanEndStr = endStr.split(/\s+/)[0];

    const start = parseVttTimestamp(startStr);
    const end = parseVttTimestamp(cleanEndStr);

    if (start === null || end === null) continue;

    // Text consists of all lines after the time line
    const textLines = lines.slice(timeLineIndex + 1);
    // Strip simple HTML/VTT tags like <v Voice> or <b>
    const text = textLines
      .join("\n")
      .replace(/<\/?[^>]+(>|$)/g, "")
      .trim();

    if (text) {
      cues.push({
        id: timeLineIndex > 0 ? lines[0].trim() : undefined,
        start,
        end,
        text,
      });
    }
  }

  cues.sort((a, b) => a.start - b.start);
  return cues;
}

/**
 * Finds the subtitle cue that is currently active for the given playback timestamp.
 */
export function findActiveSubtitleCue(cues: SubtitleCue[], currentTime: number): SubtitleCue | null {
  if (!cues || cues.length === 0) return null;

  for (let i = 0; i < cues.length; i++) {
    const cue = cues[i];
    if (currentTime >= cue.start && currentTime <= cue.end) {
      return cue;
    }
    // Optimization: if we're past the cue start and start > currentTime, break early
    if (cue.start > currentTime) {
      break;
    }
  }

  return null;
}

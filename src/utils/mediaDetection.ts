import { MediaType } from "../types/player";

const AUDIO_EXTENSIONS = new Set([
  "mp3",
  "wav",
  "aac",
  "flac",
  "ogg",
  "oga",
  "m4a",
  "wma",
  "opus",
  "weba",
  "mid",
  "midi",
]);

const VIDEO_EXTENSIONS = new Set([
  "mp4",
  "m4v",
  "webm",
  "ogv",
  "mov",
  "mkv",
  "avi",
  "wmv",
  "flv",
  "3gp",
  "ts",
  "m3u8",
]);

const YOUTUBE_REGEX =
  /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;

/**
 * Checks if a given string is a YouTube URL or video ID and returns the video ID if matched.
 */
export function extractYouTubeId(urlOrId?: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();

  // If it's already an 11-char ID like 'dQw4w9WgXcQ'
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  const match = trimmed.match(YOUTUBE_REGEX);
  return match ? match[1] || null : null;
}

/**
 * Extracts file extension from URL ignoring query params and hash.
 */
export function getFileExtension(url?: string): string | null {
  if (!url) return null;
  try {
    const cleanUrl = url.split("?")[0]?.split("#")[0] ?? "";
    const parts = cleanUrl.split(".");
    if (parts.length > 1) {
      return (parts.pop() || "").toLowerCase();
    }
  } catch {
    // fallback
  }
  return null;
}

/**
 * Detects whether the media is 'video', 'audio', or 'youtube'.
 */
export function detectMediaType(
  src?: string,
  explicitType?: MediaType
): "video" | "audio" | "youtube" {
  if (explicitType && explicitType !== "auto") {
    return explicitType;
  }

  if (!src) return "video";

  if (extractYouTubeId(src)) {
    return "youtube";
  }

  const ext = getFileExtension(src);
  if (ext) {
    if (AUDIO_EXTENSIONS.has(ext)) return "audio";
    if (VIDEO_EXTENSIONS.has(ext)) return "video";
  }

  // Fallback heuristics: check if data url or audio keyword is present
  if (src.startsWith("data:audio/") || src.includes("audio")) {
    return "audio";
  }

  // Default fallback is video
  return "video";
}

/**
 * Builds YouTube embed URL with options.
 */
export function buildYouTubeEmbedUrl(
  videoId: string,
  autoPlay = false,
  muted = false,
  controls = true
): string {
  const params = new URLSearchParams();
  if (autoPlay) params.set("autoplay", "1");
  if (muted) params.set("mute", "1");
  if (!controls) params.set("controls", "0");
  params.set("enablejsapi", "1");
  params.set("rel", "0");

  const query = params.toString();
  return `https://www.youtube.com/embed/${videoId}${query ? `?${query}` : ""}`;
}

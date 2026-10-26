export interface SubtitleCue {
  id?: string;
  start: number; // in seconds
  end: number;   // in seconds
  text: string;
}

export interface SubtitleTrack {
  id: string;
  label: string;
  language: string; // e.g. "en", "es", "fr"
  src?: string;     // URL to .vtt or .srt file
  cues?: SubtitleCue[]; // pre-parsed cues or inline cues
  default?: boolean;
}

export interface AudioTrackOption {
  id: string;
  label: string;
  language?: string;
  src?: string; // external audio track URL or synchronized audio source
  kind?: "main" | "commentary" | "dubbed" | "description";
  default?: boolean;
}

export interface LyricLine {
  time: number; // in seconds (e.g. 12.34)
  text: string;
}

export interface AudioLyrics {
  title?: string;
  artist?: string;
  rawText?: string;       // un-synchronized plain text lyrics (e.g. from ID3 USLT)
  lines?: LyricLine[];    // synchronized lyrics (from LRC or ID3 SYLT)
  source?: "id3" | "lrc" | "user" | "external";
}

export interface ID3Metadata {
  title?: string;
  artist?: string;
  album?: string;
  year?: string;
  lyrics?: AudioLyrics;
  albumArt?: string; // data:image/...;base64,... or blob: url
  genre?: string;
}

import { PlaylistItem } from "../types/playlist";
import { SubtitleTrack, AudioTrackOption, AudioLyrics } from "../types/tracks";

export const SAMPLE_SUBTITLES: SubtitleTrack[] = [
  {
    id: "sub-en",
    label: "English",
    language: "en",
    default: true,
    cues: [
      { start: 0.5, end: 3.5, text: "A large, fluffy rabbit awakens in the forest." },
      { start: 3.8, end: 6.5, text: "Birds are chirping, welcoming the bright morning." },
      { start: 7.0, end: 9.8, text: "He steps out, enjoying the peaceful breeze." },
    ],
  },
  {
    id: "sub-es",
    label: "Español",
    language: "es",
    cues: [
      { start: 0.5, end: 3.5, text: "Un gran conejo esponjoso se despierta en el bosque." },
      { start: 3.8, end: 6.5, text: "Los pájaros cantan, dando la bienvenida a la mañana." },
      { start: 7.0, end: 9.8, text: "Sale a disfrutar de la suave brisa del bosque." },
    ],
  },
  {
    id: "sub-fr",
    label: "Français",
    language: "fr",
    cues: [
      { start: 0.5, end: 3.5, text: "Un grand lapin doux se réveille dans la forêt." },
      { start: 3.8, end: 6.5, text: "Les oiseaux chantent, accueillant le matin ensoleillé." },
      { start: 7.0, end: 9.8, text: "Il sort profiter de la brise paisible." },
    ],
  },
];

export const SAMPLE_AUDIO_TRACKS: AudioTrackOption[] = [
  {
    id: "audio-main",
    label: "English (Original 5.1)",
    language: "en",
    kind: "main",
    default: true,
  },
  {
    id: "audio-commentary",
    label: "Director's Commentary",
    language: "en",
    kind: "commentary",
  },
  {
    id: "audio-dub-es",
    label: "Español (Doblado)",
    language: "es",
    kind: "dubbed",
  },
];

export const SAMPLE_LYRICS: AudioLyrics = {
  title: "Midnight Resonance",
  artist: "Aura Soundscape",
  source: "lrc",
  lines: [
    { time: 2.0, text: "Starlight falls across the empty street" },
    { time: 6.5, text: "Echoes of a distant rhythm and beat" },
    { time: 11.2, text: "Waves of sound flowing through the night" },
    { time: 16.0, text: "Lost in the glow of electric neon light" },
    { time: 21.5, text: "Take my hand, we're floating in the stream" },
    { time: 27.0, text: "Everything is clearer than a waking dream" },
    { time: 33.5, text: "Midnight resonance... fading away" },
    { time: 40.0, text: "Until the arrival of the morning ray" },
  ],
};

export const SAMPLE_PLAYLIST: PlaylistItem[] = [
  {
    id: "sample-audio-1",
    title: "Midnight Resonance (Lofi Beat)",
    artist: "Aura Soundscape",
    album: "Nocturne Horizons",
    type: "audio",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    artwork: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&q=80",
    duration: 372,
    lyrics: SAMPLE_LYRICS,
  },
  {
    id: "sample-video-1",
    title: "Big Buck Bunny (Trailer)",
    artist: "Blender Foundation",
    album: "Open Movie Project",
    type: "video",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    poster: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80",
    artwork: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=300&q=80",
    duration: 10,
    subtitles: SAMPLE_SUBTITLES,
    audioTracks: SAMPLE_AUDIO_TRACKS,
  },
  {
    id: "sample-audio-2",
    title: "Chillwaves & Synthesizers",
    artist: "Cyber Echo",
    album: "Neon Drift",
    type: "audio",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    artwork: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80",
    duration: 423,
    lyrics: `
[00:03.00]Synthesizer echoes in the breeze
[00:08.50]Gliding through the digital frequencies
[00:14.00]Smooth chillwave melodies taking flight
[00:20.00]Guided by the electric glow of night
    `.trim(),
  },
  {
    id: "sample-video-2",
    title: "Rick Astley - Never Gonna Give You Up",
    artist: "Rick Astley",
    album: "YouTube Music",
    type: "youtube",
    src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    poster: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
    artwork: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
    duration: 213,
  },
  {
    id: "sample-audio-3",
    title: "Golden Hour Acoustic",
    artist: "Luna Sol",
    album: "Sunset Melodies",
    type: "audio",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    artwork: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80",
    duration: 345,
  },
];

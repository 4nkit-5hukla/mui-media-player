import { PlaylistItem } from "../types/playlist";
import { SubtitleTrack, AudioTrackOption, AudioLyrics } from "../types/tracks";

export const SAMPLE_SUBTITLES: SubtitleTrack[] = [
  {
    id: "sub-en",
    label: "English",
    language: "en",
    default: true,
    cues: [
      { start: 1.0, end: 5.5, text: "The morning ocean swell approaches the tropical coastline." },
      { start: 6.0, end: 11.5, text: "Catching the first crest as the barreling wave begins to curl." },
      { start: 12.0, end: 18.0, text: "Carving through crystal blue waters with high-speed balance." },
      { start: 19.0, end: 25.0, text: "Riding inside the tube as sunlight breaks through the spray." },
      { start: 26.0, end: 32.0, text: "Exiting the barrel cleanly as the tide pushes toward shore." },
    ],
  },
  {
    id: "sub-es",
    label: "Español",
    language: "es",
    cues: [
      { start: 1.0, end: 5.5, text: "El oleaje matutino del océano se aproxima a la costa tropical." },
      { start: 6.0, end: 11.5, text: "Atrapando la primera cresta mientras la ola empieza a rizarse." },
      { start: 12.0, end: 18.0, text: "Surcando aguas cristalinas con equilibrio a gran velocidad." },
      { start: 19.0, end: 25.0, text: "Cabalgando dentro del tubo mientras el sol brilla en la espuma." },
      { start: 26.0, end: 32.0, text: "Saliendo limpiamente del tubo con la marea." },
    ],
  },
  {
    id: "sub-fr",
    label: "Français",
    language: "fr",
    cues: [
      { start: 1.0, end: 5.5, text: "La houle matinale de l'océan s'approche de la côte tropicale." },
      { start: 6.0, end: 11.5, text: "Prendre la première crête alors que la vague commence à s'enrouler." },
      { start: 12.0, end: 18.0, text: "Glisser sur des eaux cristallines avec équilibre et vitesse." },
      { start: 19.0, end: 25.0, text: "Surfer à l'intérieur du rouleau sous les embruns lumineux." },
      { start: 26.0, end: 32.0, text: "Sortir proprement de la vague avec la marée montante." },
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
  source: "lrc",
  lines: [
    { time: 2.0, text: "Cold winds whispering through the frozen night" },
    { time: 7.5, text: "Echoes of winter dancing beneath moonlight" },
    { time: 13.0, text: "Melodies of piano falling soft as snow" },
    { time: 19.5, text: "In the quiet stillness where deep rivers flow" },
    { time: 26.0, text: "Harmonies ascending into the starlit sky" },
    { time: 33.0, text: "A timeless resonance that will never die" },
  ],
};

export const SAMPLE_PLAYLIST: PlaylistItem[] = [
  {
    id: "sample-audio-1",
    title: "Blizzard (Chapter One)",
    artist: "Kai Engel",
    album: "Chapter One / Cold",
    type: "audio",
    src: "https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample.mp3",
    artwork: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&q=80",
    duration: 182,
    lyrics: SAMPLE_LYRICS,
  },
  {
    id: "sample-video-1",
    title: "Surfing Adventure (720p HD)",
    artist: "Action Sports",
    album: "Ocean Waves",
    type: "video",
    src: "https://filesamples.com/samples/video/mp4/sample_1280x720_surfing_with_audio.mp4",
    poster: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80",
    artwork: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=300&q=80",
    duration: 183,
    subtitles: SAMPLE_SUBTITLES,
    audioTracks: SAMPLE_AUDIO_TRACKS,
  },
  {
    id: "sample-audio-2",
    title: "Chrono Symphonic Theme",
    artist: "Yasunori Mitsuda",
    album: "Chrono Trigger Symphonic",
    type: "audio",
    src: "https://webaudioapi.com/samples/audio-tag/chrono.mp3",
    artwork: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80",
    duration: 57,
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
    title: "Rain & Thunder Ambience",
    artist: "Nature Soundscapes",
    album: "Atmospheres",
    type: "audio",
    src: "https://actions.google.com/sounds/v1/weather/light_rain.ogg",
    artwork: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=300&q=80",
    duration: 180,
  },
];

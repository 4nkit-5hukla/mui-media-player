# mui-media-player

> A production-grade, highly customizable media player library for **React** and **MUI (Material UI)** with `VideoPlayer`, `AudioPlayer`, `MediaPlayer` (format auto-detection), `MediaBar`, `MediaCenter`, and comprehensive playlist management.

[![npm version](https://img.shields.io/npm/v/mui-media-player.svg)](https://www.npmjs.com/package/mui-media-player)
[![CI](https://github.com/4nkit-5hukla/mui-media-player/actions/workflows/ci.yml/badge.svg)](https://github.com/4nkit-5hukla/mui-media-player/actions/workflows/ci.yml)
[![Storybook](https://img.shields.io/badge/Storybook-Live_Docs-ff4785.svg)](https://4nkit-5hukla.github.io/mui-media-player/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%20%7C%2019-61dafb.svg)](https://react.dev/)
[![MUI](https://img.shields.io/badge/MUI-v5%20%7C%20v6%20%7C%20v7%20%7C%20v9-007fff.svg)](https://mui.com/)

📖 <a href="https://4nkit-5hukla.github.io/mui-media-player/" target="_blank" rel="noopener noreferrer">**View Live Interactive Storybook Documentation**</a>

---

## 🌟 Key Features

- 🎬 **VideoPlayer with Subtitles & Multi-Audio Tracks**:
  - **Subtitles & Closed Captions**: High-contrast styled subtitle overlay supporting WebVTT (`.vtt`), SubRip (`.srt`), or inline cues with multi-language switching menu (English, Spanish, French, etc. or Off).
  - **Multiple Audio Tracks**: Switch between alternative audio streams (e.g. Original 5.1, Director's Commentary, Dubbed languages).
  - Smooth auto-hiding controls (2.5s inactivity timeout), interactive scrubber with live buffer indicator, PiP (Picture-in-Picture), Fullscreen API, playback speed selector (0.25x – 2x), and YouTube embed support.
- 🎵 **AudioPlayer with Synchronized Lyrics & WaveSurfer**:
  - **ID3 Tag Auto-Extraction**: Automatically extracts embedded album artwork (APIC) and lyrics (USLT/SYLT) from audio files or remote URLs using zero-dependency HTTP range requests.
  - **Synchronized Lyrics (Karaoke Mode)**: Real-time active lyric highlighting with smooth auto-scroll to the current singing line and click-to-seek functionality.
  - **Lyrics Synchronization & Transcribe Studio**: Interactive editor allowing users to inject plain lyrics, paste LRC text, or stamp timestamps in real-time as the audio plays.
  - **WaveSurfer.js Audio Visualizer & Spectrum Analyzer**: Interactive canvas waveform visualization with scrubbing, real-time frequency spectrum analyzer, and theme integration.
  - **Interchangeable Seekbar Scrubber**: Switch between standard MUI Slider and waveform-driven WaveData seeker.
  - **3 Visual Variants**: `card` (default modern music card), `compact` (inline bar for comments/articles), and `full` (large hero music hub).
- 🪄 **MediaPlayer (Universal Smart Detector)**: Pass any media URL or playlist track. `MediaPlayer` automatically detects the media type (`video`, `audio`, or `youtube`) and mounts the appropriate player with unified props.
- 📻 **MediaBar**: Persistent docked or floating bottom playback bar (similar to Spotify and Apple Music) with top-edge scrubber, volume slider, track metadata, queue drawer, and player expansion.
- 🎛️ **MediaCenter**: All-in-one media workstation. Available in `embedded` mode (dashboard workspace) or `modal` mode (dialog lightbox), with real-time searchable playlist and queue management.
- 📜 **Playlist System**: Global playlist context (`PlaylistProvider`, `usePlaylist`, `PlaylistDrawer`, `PlaylistItemRow`), supporting auto-advancing, shuffle, repeat, queue reordering, and mixed audio/video playlists.
- ⌨️ **Keyboard Shortcuts**: Built-in hotkeys (`Space`/`K` for play/pause, `F` for fullscreen, `M` for mute, `P` for PiP, `←`/`→` for seek, `↑`/`↓` for volume, `0`/`Home` for restart).
- 🎨 **100% MUI Native Theming**: Zero external CSS or SCSS module dependencies. Uses MUI theme colors, dark/light mode, and custom `sx` overrides.
- 🌐 **Cross-Framework Architecture**: Headless playback state engine decoupled from presentation, ready for upcoming Vanilla JS, Svelte, Vue, and Angular adapters.

---

## 📦 Installation

```bash
npm install mui-media-player
```

### Peer Dependencies
Ensure you have the required peer dependencies installed:

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled react react-dom
```

---

## 🚀 Quick Start

### 1. VideoPlayer with Subtitles & Multi-Audio Tracks
```tsx
import { VideoPlayer } from "mui-media-player";

export default function VideoDemo() {
  return (
    <VideoPlayer
      src="https://filesamples.com/samples/video/mp4/sample_1280x720_surfing_with_audio.mp4"
      title="Surfing Adventure (720p HD)"
      subtitle="Action Sports Series"
      poster="https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80"
      aspectRatio="16/9"
      subtitles={[
        {
          id: "en",
          label: "English",
          language: "en",
          default: true,
          cues: [
            { start: 0.5, end: 3.5, text: "A surfer takes off on an open ocean wave." },
            { start: 3.8, end: 6.5, text: "Carving through the barrel with effortless style." },
          ],
        },
        {
          id: "es",
          label: "Español",
          language: "es",
          cues: [
            { start: 0.5, end: 3.5, text: "Un surfista despega sobre una ola del océano." },
          ],
        },
      ]}
      audioTracks={[
        { id: "main", label: "Stereo Master (English)", default: true },
        { id: "commentary", label: "Surfing Coach Commentary", kind: "commentary" },
      ]}
    />
  );
}
```

### 2. AudioPlayer with Synchronized Lyrics & WaveSurfer
```tsx
import { AudioPlayer } from "mui-media-player";

export default function AudioDemo() {
  return (
    <AudioPlayer
      src="https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample.mp3"
      title="Blizzard (Chapter One)"
      artist="Kai Engel"
      album="Chapter One / Cold"
      variant="card" // 'card' | 'compact' | 'full'
      visualizer="wavesurfer" // 'wavesurfer' | 'spectrum' | 'bars' | 'none'
      seekbarMode="waveform"  // 'slider' | 'waveform'
      enableWaveSurfer={true} // Interactive WaveSurfer canvas visualizer
      autoExtractID3={true}   // Auto-extracts embedded album art and lyrics from ID3 tags
      lyrics={`
        [00:02.00] Starlight falls across the empty street
        [00:06.50] Echoes of a distant rhythm and beat
        [00:11.20] Waves of sound flowing through the night
      `}
    />
  );
}
```

### 3. MediaPlayer (Smart Auto-Detection)
```tsx
import { MediaPlayer } from "mui-media-player";

// Automatically detects whether URL is audio, video, or YouTube:
export default function UniversalMediaDemo() {
  return (
    <>
      {/* Renders AudioPlayer with WaveSurfer & Waveform seekbar */}
      <MediaPlayer src="https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample.mp3" title="Tech Talk EP. 42" />

      {/* Renders VideoPlayer */}
      <MediaPlayer src="https://filesamples.com/samples/video/mp4/sample_1280x720_surfing_with_audio.mp4" title="Surfing Adventure" />

      {/* Renders YouTube Video Embed */}
      <MediaPlayer src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="Rick Astley" />
    </>
  );
}
```

### 4. MediaBar (Docked or Floating Player)
```tsx
import { MediaBar, PlaylistProvider } from "mui-media-player";

export default function App() {
  return (
    <PlaylistProvider initialItems={tracks}>
      <YourContent />
      {/* Persistent floating pill bar */}
      <MediaBar position="floating" accentColor="primary" />
    </PlaylistProvider>
  );
}
```

### 5. MediaCenter (Workstation or Modal Lightbox)
```tsx
import { useState } from "react";
import { MediaCenter, Button } from "mui-media-player";

export default function MediaHub() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open Media Center Lightbox
      </Button>

      <MediaCenter
        mode="modal"
        open={open}
        onClose={() => setOpen(false)}
        playlist={tracks}
        accentColor="primary"
      />
    </>
  );
}
```

---

## 📚 Storybook Documentation

Explore interactive stories, controls, and use cases in the hosted Storybook:
👉 <a href="https://4nkit-5hukla.github.io/mui-media-player/" target="_blank" rel="noopener noreferrer">**Demo**</a>

To run Storybook locally:
```bash
npm run storybook
```

To build static Storybook:
```bash
npm run build-storybook
```

---

## 🤖 CI / CD Workflows

- **`.github/workflows/ci.yml`**: Matrix builds across Node 18.x, 20.x, and 22.x running type checks, Vitest test suites, library build, and Storybook build.
- **`.github/workflows/deploy-storybook.yml`**: Automatically builds and publishes Storybook to GitHub Pages on every push to `main`.
- **`.github/workflows/publish-npm.yml`**: Automates verification, build, and publishing to npm upon new release tags (`v*.*.*`) or manual workflow dispatch.

---

## 📄 License

MIT © [Ankit Shukla](https://github.com/4nkit-5hukla)

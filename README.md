# mui-media-player

> A production-grade, highly customizable media player library for **React** and **MUI (Material UI)** with `VideoPlayer`, `AudioPlayer`, `MediaPlayer` (format auto-detection), `MediaBar`, `MediaCenter`, and comprehensive playlist management.

[![npm version](https://img.shields.io/npm/v/mui-media-player.svg)](https://www.npmjs.com/package/mui-media-player)
[![CI](https://github.com/4nkit-5hukla/mui-media-player/actions/workflows/ci.yml/badge.svg)](https://github.com/4nkit-5hukla/mui-media-player/actions/workflows/ci.yml)
[![Storybook](https://img.shields.io/badge/Storybook-Live_Docs-ff4785.svg)](https://4nkit-5hukla.github.io/mui-media-player/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%20%7C%2019-61dafb.svg)](https://react.dev/)
[![MUI](https://img.shields.io/badge/MUI-v5%20%7C%20v6%20%7C%20v7%20%7C%20v9-007fff.svg)](https://mui.com/)

📖 **[View Live Interactive Storybook Documentation](https://4nkit-5hukla.github.io/mui-media-player/)**

---

## 🌟 Key Features

- 🎬 **VideoPlayer**: Fully styled with Material UI (`styled`, `sx`), featuring smooth auto-hiding controls (2.5s inactivity timeout), interactive scrubber with live buffer indicator, PiP (Picture-in-Picture), Fullscreen API, playback speed selector (0.25x – 2x), and YouTube embed support.
- 🎵 **AudioPlayer**: Specialized player for audio tracks, podcasts, and music. Includes album artwork display, animated pulsing sound waves (`AudioWave`), shuffle, repeat-all, and repeat-one modes.
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

### 1. VideoPlayer
```tsx
import { VideoPlayer } from "mui-media-player";

export default function VideoDemo() {
  return (
    <VideoPlayer
      src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      title="Big Buck Bunny"
      subtitle="Blender Foundation • 4K Open Movie"
      poster="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d"
      aspectRatio="16/9"
      autoPlay={false}
      onClose={() => console.log("Video closed")}
    />
  );
}
```

### 2. AudioPlayer
```tsx
import { AudioPlayer } from "mui-media-player";

export default function AudioDemo() {
  return (
    <AudioPlayer
      src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      title="Midnight Resonance"
      artist="Aura Soundscape"
      album="Nocturne Horizons"
      artwork="https://images.unsplash.com/photo-1518609878373-06d740f60d8b"
      variant="card" // 'card' | 'compact' | 'full'
      showWaveform={true}
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
      {/* Renders AudioPlayer */}
      <MediaPlayer src="https://example.com/podcast.mp3" title="Tech Talk EP. 42" />

      {/* Renders VideoPlayer */}
      <MediaPlayer src="https://example.com/demo.mp4" title="Product Showcase" />

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
👉 **[https://4nkit-5hukla.github.io/mui-media-player/](https://4nkit-5hukla.github.io/mui-media-player/)**

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

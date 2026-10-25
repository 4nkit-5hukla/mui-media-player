# mui-media-player

> A production-grade, highly customizable media player library for **React** and **MUI (Material UI)** with `VideoPlayer`, `AudioPlayer`, `MediaPlayer` (format auto-detection), `MediaBar`, `MediaCenter`, and comprehensive playlist management.

[![npm version](https://img.shields.io/npm/v/mui-media-player.svg)](https://www.npmjs.com/package/mui-media-player)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%20%7C%2019-61dafb.svg)](https://react.dev/)
[![MUI](https://img.shields.io/badge/MUI-v5%20%7C%20v6%20%7C%20v7%20%7C%20v9-007fff.svg)](https://mui.com/)

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
      src="https://www.w3schools.com/html/mov_bbb.mp4"
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

// Automatically detects whether URL is audio or video:
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

### 4. MediaBar (Docked or Floating Bottom Player)
```tsx
import { MediaBar, PlaylistProvider } from "mui-media-player";

export default function App() {
  return (
    <PlaylistProvider playlist={tracks}>
      <main>Your App Content</main>
      
      {/* Docked bottom audio/media bar */}
      <MediaBar
        position="bottom" // 'bottom' | 'floating' | 'top'
        onExpand={() => setMediaCenterOpen(true)}
      />
    </PlaylistProvider>
  );
}
```

### 5. MediaCenter (Workstation / Lightbox)
```tsx
import { useState } from "react";
import { MediaCenter } from "mui-media-player";

export default function MediaCenterDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Media Center</button>

      {/* Modal Dialog Lightbox */}
      <MediaCenter
        mode="modal"
        open={open}
        onClose={() => setOpen(false)}
        title="Creator Media Hub"
        playlist={myPlaylist}
      />

      {/* Or Embedded In-Page Workstation */}
      <MediaCenter
        mode="embedded"
        title="Dashboard Player"
        playlist={myPlaylist}
      />
    </>
  );
}
```

---

## ⌨️ Keyboard Navigation

When focused on the player:
| Key | Action |
| --- | --- |
| `Space` or `K` | Toggle Play / Pause |
| `F` | Toggle Fullscreen |
| `M` | Toggle Mute |
| `P` | Toggle Picture-in-Picture (PiP) |
| `←` / `→` | Skip backward / forward 5 seconds |
| `J` / `L` | Skip backward / forward 10 seconds |
| `↑` / `↓` | Increase / decrease volume by 10% |
| `0` or `Home` | Restart playback from beginning |

---

## 🛠️ Local Development & Playground

To launch the live interactive playground on `localhost`:

```bash
cd plugins/mui-media-player
npm install
npm run dev
```

Visit `http://localhost:5174/` or `http://localhost:5175/` in your browser.

### Scripts
- `npm run dev`: Launch the interactive development playground.
- `npm run build`: Run typecheck, unit tests, and Vite bundle for npm distribution.
- `npm run lint`: Run TypeScript type-checking without emitting code.
- `npm run test`: Run the Vitest test suite.
- `npm run coverage`: Generate unit test code coverage report.

---

## 🗺️ Multi-Framework Roadmap

The underlying playback controller is implemented headlessly (`useMediaController` / core media state engine). Future updates will expose wrappers for:
- [x] React (18 & 19)
- [ ] Vanilla JavaScript (`@mui-media-player/core`)
- [ ] Vue 3
- [ ] Svelte
- [ ] Angular

---

## 📄 License

MIT © [Ankit Shukla](https://github.com/ankit-shukla)

import { FC, useState } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Paper,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Chip,
  Stack,
} from "@mui/material";
import {
  Brightness4Rounded,
  Brightness7Rounded,
  PlayCircleFilledWhiteRounded,
  VideocamRounded,
  AudiotrackRounded,
  AutoAwesomeRounded,
  VerticalAlignBottomRounded,
  DashboardRounded,
  KeyboardRounded,
  OpenInNewRounded,
  SubtitlesRounded,
  LyricsRounded,
  GraphicEqRounded,
} from "@mui/icons-material";

import { VideoPlayer } from "../components/VideoPlayer";
import { AudioPlayer } from "../components/AudioPlayer";
import { MediaPlayer } from "../components/MediaPlayer";
import { MediaBar } from "../components/MediaBar";
import { MediaCenter } from "../components/MediaCenter";
import { PlaylistProvider } from "../context/PlaylistContext";
import { SAMPLE_PLAYLIST, SAMPLE_SUBTITLES, SAMPLE_AUDIO_TRACKS } from "./sampleData";
import { AspectRatio, AudioPlayerVariant, MediaBarPosition } from "../types/player";

export const App: FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // VideoPlayer state
  const [videoAspect, setVideoAspect] = useState<AspectRatio>("16/9");
  const [videoSrc, setVideoSrc] = useState(SAMPLE_PLAYLIST[1].src);

  // AudioPlayer state
  const [audioVariant, setAudioVariant] = useState<AudioPlayerVariant>("card");

  // MediaPlayer auto-detect state
  const [mediaSelection, setMediaSelection] = useState<"video" | "audio" | "youtube">("video");

  // MediaBar state
  const [mediaBarOpen, setMediaBarOpen] = useState(false);
  const [mediaBarPosition, setMediaBarPosition] = useState<MediaBarPosition>("bottom");

  // MediaCenter state
  const [mediaCenterModalOpen, setMediaCenterModalOpen] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#6366f1",
      },
      secondary: {
        main: "#ec4899",
      },
      background: {
        default: darkMode ? "#0c0d12" : "#f8fafc",
        paper: darkMode ? "#151821" : "#ffffff",
      },
    },
    typography: {
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    shape: {
      borderRadius: 12,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PlaylistProvider initialItems={SAMPLE_PLAYLIST}>
        <Box sx={{ minHeight: "100vh", pb: mediaBarOpen ? 14 : 6, display: "flex", flexDirection: "column" }}>
          {/* Top App Bar */}
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              backgroundColor: "background.paper",
              backdropFilter: "blur(12px)",
              position: "sticky",
              top: 0,
              zIndex: 100,
              px: { xs: 2, sm: 4 },
              py: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <PlayCircleFilledWhiteRounded color="primary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "1.15rem", lineHeight: 1.2 }}>
                  mui-media-player
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                  MUI &bull; Subtitles &bull; Synchronized Lyrics &bull; WaveSurfer &bull; Multi-Track Audio
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label="v1.0.0"
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600, display: { xs: "none", sm: "inline-flex" } }}
              />
              <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
                  {darkMode ? <Brightness7Rounded /> : <Brightness4Rounded />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Navigation Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", backgroundColor: "background.paper", px: 2 }}>
            <Container maxWidth="lg">
              <Tabs
                value={activeTab}
                onChange={(_, val) => setActiveTab(val)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.92rem",
                    minHeight: 48,
                    gap: 1,
                  },
                }}
              >
                <Tab icon={<VideocamRounded fontSize="small" />} iconPosition="start" label="VideoPlayer (Subtitles & Audio Tracks)" />
                <Tab icon={<AudiotrackRounded fontSize="small" />} iconPosition="start" label="AudioPlayer (Lyrics & WaveSurfer)" />
                <Tab icon={<AutoAwesomeRounded fontSize="small" />} iconPosition="start" label="MediaPlayer (Auto-Detect)" />
                <Tab icon={<VerticalAlignBottomRounded fontSize="small" />} iconPosition="start" label="MediaBar" />
                <Tab icon={<DashboardRounded fontSize="small" />} iconPosition="start" label="MediaCenter" />
              </Tabs>
            </Container>
          </Box>

          {/* Main Content Area */}
          <Container maxWidth="lg" sx={{ mt: 4, flex: 1 }}>
            {/* TAB 0: VIDEO PLAYER */}
            {activeTab === 0 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                    VideoPlayer
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Includes custom high-contrast subtitles with language switching (English, Spanish, French), multiple audio track switching (Original 5.1, Director's Commentary, Spanish Dub), interactive scrubber with buffer progress, PiP, and Fullscreen.
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                    <Chip icon={<SubtitlesRounded fontSize="small" />} label="Subtitles Switching (EN/ES/FR)" size="small" color="primary" variant="outlined" />
                    <Chip icon={<AudiotrackRounded fontSize="small" />} label="Multi-Audio Tracks" size="small" color="secondary" variant="outlined" />
                  </Stack>
                </Box>

                {/* Aspect & Source Controls */}
                <Paper sx={{ p: 2, display: "flex", flexWrap: "wrap", gap: 3, alignItems: "center" }}>
                  <FormControl size="small">
                    <FormLabel sx={{ fontSize: "0.78rem" }}>Aspect Ratio</FormLabel>
                    <RadioGroup
                      row
                      value={videoAspect}
                      onChange={(e) => setVideoAspect(e.target.value as AspectRatio)}
                    >
                      <FormControlLabel value="16/9" control={<Radio size="small" />} label="16:9" />
                      <FormControlLabel value="4/3" control={<Radio size="small" />} label="4:3" />
                      <FormControlLabel value="21/9" control={<Radio size="small" />} label="21:9" />
                    </RadioGroup>
                  </FormControl>

                  <FormControl size="small">
                    <FormLabel sx={{ fontSize: "0.78rem" }}>Video Source</FormLabel>
                    <RadioGroup
                      row
                      value={videoSrc}
                      onChange={(e) => setVideoSrc(e.target.value)}
                    >
                      <FormControlLabel
                        value={SAMPLE_PLAYLIST[1].src}
                        control={<Radio size="small" />}
                        label="HTML5 Video Sample (.mp4)"
                      />
                      <FormControlLabel
                        value={SAMPLE_PLAYLIST[3].src}
                        control={<Radio size="small" />}
                        label="YouTube Video"
                      />
                    </RadioGroup>
                  </FormControl>
                </Paper>

                {/* Video Player Display */}
                <Box sx={{ width: "100%", maxWidth: 840, mx: "auto" }}>
                  <VideoPlayer
                    src={videoSrc}
                    title="Big Buck Bunny - Open Movie Project"
                    subtitle="Blender Foundation"
                    poster={SAMPLE_PLAYLIST[1].poster}
                    aspectRatio={videoAspect}
                    subtitles={SAMPLE_SUBTITLES}
                    audioTracks={SAMPLE_AUDIO_TRACKS}
                    onClose={() => console.log("Close video triggered")}
                  />
                </Box>

                {/* Keyboard Shortcuts Reference */}
                <Paper sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                    <KeyboardRounded color="primary" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Built-in Keyboard Shortcuts
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                    <Chip label="Space / K : Play / Pause" size="small" variant="outlined" />
                    <Chip label="F : Toggle Fullscreen" size="small" variant="outlined" />
                    <Chip label="M : Toggle Mute" size="small" variant="outlined" />
                    <Chip label="P : Picture-in-Picture" size="small" variant="outlined" />
                    <Chip label="← / → : Skip ±5s" size="small" variant="outlined" />
                    <Chip label="J / L : Skip ±10s" size="small" variant="outlined" />
                    <Chip label="↑ / ↓ : Volume ±10%" size="small" variant="outlined" />
                    <Chip label="0 / Home : Restart" size="small" variant="outlined" />
                  </Box>
                </Paper>
              </Box>
            )}

            {/* TAB 1: AUDIO PLAYER */}
            {activeTab === 1 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                    AudioPlayer
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Features ID3 tag extraction for embedded album art & lyrics, real-time synchronized lyrics (karaoke style with click-to-seek and live transcribing editor), and interactive WaveSurfer.js waveform visualizer.
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                    <Chip icon={<LyricsRounded fontSize="small" />} label="Synchronized Lyrics & Editor" size="small" color="primary" variant="outlined" />
                    <Chip icon={<GraphicEqRounded fontSize="small" />} label="WaveSurfer Visualizer" size="small" color="secondary" variant="outlined" />
                  </Stack>
                </Box>

                {/* Variant Switcher */}
                <Paper sx={{ p: 2, display: "flex", alignItems: "center", gap: 3 }}>
                  <FormControl size="small">
                    <FormLabel sx={{ fontSize: "0.78rem" }}>Layout Variant</FormLabel>
                    <RadioGroup
                      row
                      value={audioVariant}
                      onChange={(e) => setAudioVariant(e.target.value as AudioPlayerVariant)}
                    >
                      <FormControlLabel value="card" control={<Radio size="small" />} label="Card (Default)" />
                      <FormControlLabel value="compact" control={<Radio size="small" />} label="Compact (Inline)" />
                      <FormControlLabel value="full" control={<Radio size="small" />} label="Full Hero" />
                    </RadioGroup>
                  </FormControl>
                </Paper>

                {/* Audio Player Display */}
                <Box sx={{ display: "flex", justifyContent: "center", width: "100%", py: 2 }}>
                  <AudioPlayer
                    src={SAMPLE_PLAYLIST[0].src}
                    title={SAMPLE_PLAYLIST[0].title}
                    artist={SAMPLE_PLAYLIST[0].artist}
                    album={SAMPLE_PLAYLIST[0].album}
                    artwork={SAMPLE_PLAYLIST[0].artwork}
                    lyrics={SAMPLE_PLAYLIST[0].lyrics}
                    enableWaveSurfer={true}
                    variant={audioVariant}
                  />
                </Box>
              </Box>
            )}

            {/* TAB 2: MEDIA PLAYER (AUTO-DETECT) */}
            {activeTab === 2 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                    MediaPlayer (Universal Smart Detector)
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Pass any media URL or playlist item. MediaPlayer automatically inspects the format and switches seamlessly between VideoPlayer and AudioPlayer with unified props!
                  </Typography>
                </Box>

                <Paper sx={{ p: 2 }}>
                  <FormControl size="small">
                    <FormLabel sx={{ fontSize: "0.78rem" }}>Test Media Format Auto-Detection</FormLabel>
                    <RadioGroup
                      row
                      value={mediaSelection}
                      onChange={(e) => setMediaSelection(e.target.value as "video" | "audio" | "youtube")}
                    >
                      <FormControlLabel value="video" control={<Radio size="small" />} label="MP4 Video File (.mp4)" />
                      <FormControlLabel value="audio" control={<Radio size="small" />} label="MP3 Audio File (.mp3)" />
                      <FormControlLabel value="youtube" control={<Radio size="small" />} label="YouTube Video Link" />
                    </RadioGroup>
                  </FormControl>
                </Paper>

                <Box sx={{ display: "flex", justifyContent: "center", width: "100%", py: 2 }}>
                  {mediaSelection === "video" && (
                    <Box sx={{ width: "100%", maxWidth: 760 }}>
                      <MediaPlayer
                        src={SAMPLE_PLAYLIST[1].src}
                        title="Auto-Detected Video (MP4)"
                        poster={SAMPLE_PLAYLIST[1].poster}
                        subtitles={SAMPLE_SUBTITLES}
                        audioTracks={SAMPLE_AUDIO_TRACKS}
                      />
                    </Box>
                  )}

                  {mediaSelection === "audio" && (
                    <Box sx={{ width: "100%", maxWidth: 500 }}>
                      <MediaPlayer
                        src={SAMPLE_PLAYLIST[0].src}
                        title="Auto-Detected Audio (MP3)"
                        artist={SAMPLE_PLAYLIST[0].artist}
                        artwork={SAMPLE_PLAYLIST[0].artwork}
                        lyrics={SAMPLE_PLAYLIST[0].lyrics}
                        enableWaveSurfer={true}
                      />
                    </Box>
                  )}

                  {mediaSelection === "youtube" && (
                    <Box sx={{ width: "100%", maxWidth: 760 }}>
                      <MediaPlayer
                        src={SAMPLE_PLAYLIST[3].src}
                        title="Auto-Detected YouTube Embed"
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            )}

            {/* TAB 3: MEDIA BAR */}
            {activeTab === 3 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                    MediaBar
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Persistent floating or docked bottom playback bar (like Spotify & Apple Music) featuring edge scrubber, queue drawer, and player expansion.
                  </Typography>
                </Box>

                <Paper sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    MediaBar Controls
                  </Typography>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "center" }}>
                    <Button
                      variant="contained"
                      color={mediaBarOpen ? "secondary" : "primary"}
                      onClick={() => setMediaBarOpen(!mediaBarOpen)}
                    >
                      {mediaBarOpen ? "Hide MediaBar" : "Show / Dock MediaBar"}
                    </Button>

                    <FormControl size="small">
                      <FormLabel sx={{ fontSize: "0.78rem" }}>Position</FormLabel>
                      <RadioGroup
                        row
                        value={mediaBarPosition}
                        onChange={(e) => setMediaBarPosition(e.target.value as MediaBarPosition)}
                      >
                        <FormControlLabel value="bottom" control={<Radio size="small" />} label="Docked Bottom" />
                        <FormControlLabel value="floating" control={<Radio size="small" />} label="Floating Pill" />
                        <FormControlLabel value="top" control={<Radio size="small" />} label="Docked Top" />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Paper>

                {mediaBarOpen && (
                  <MediaBar
                    position={mediaBarPosition}
                    onClose={() => setMediaBarOpen(false)}
                    onExpand={() => setMediaCenterModalOpen(true)}
                  />
                )}
              </Box>
            )}

            {/* TAB 4: MEDIA CENTER */}
            {activeTab === 4 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                    MediaCenter
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Comprehensive media center workstation. Supports modal dialog lightbox mode or embedded in-page workstation mode with real-time playlist and queue management.
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<OpenInNewRounded />}
                    onClick={() => setMediaCenterModalOpen(true)}
                  >
                    Open Modal MediaCenter
                  </Button>
                </Box>

                <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 1 }}>
                  Embedded MediaCenter Workstation
                </Typography>

                <MediaCenter
                  mode="embedded"
                  title="EasySocial Media Workstation"
                  playlist={SAMPLE_PLAYLIST}
                />

                {/* Modal MediaCenter instance */}
                <MediaCenter
                  mode="modal"
                  open={mediaCenterModalOpen}
                  onClose={() => setMediaCenterModalOpen(false)}
                  title="EasySocial Media Workstation"
                  playlist={SAMPLE_PLAYLIST}
                />
              </Box>
            )}
          </Container>
        </Box>
      </PlaylistProvider>
    </ThemeProvider>
  );
};

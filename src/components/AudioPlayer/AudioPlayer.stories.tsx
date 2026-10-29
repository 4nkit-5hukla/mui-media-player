import type { Meta, StoryObj } from '@storybook/react'
import { Box, Stack } from '@mui/material'
import { AudioPlayer } from './AudioPlayer'
import { SAMPLE_LYRICS } from '../../demo/sampleData'

const sampleAudioUrl =
  'https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample.mp3'
const sampleArtwork =
  'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80'

const meta: Meta<typeof AudioPlayer> = {
  title: 'Components/AudioPlayer',
  component: AudioPlayer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A modern MUI-based audio player with three distinct layout variants (`card`, `compact`, `full`), real-time synchronized karaoke lyrics with click-to-seek and live transcribing editor, ID3 tag auto-extraction for embedded artwork/lyrics, interchangeable seekbars (`slider` or `waveform`), and multiple audio visualizer modes (`wavesurfer`, `spectrum`, `bars`, `none`).'
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['card', 'compact', 'full'],
      description: 'Layout variant of audio player'
    },
    visualizer: {
      control: 'select',
      options: ['wavesurfer', 'spectrum', 'bars', 'none'],
      description: 'Audio visualizer rendering mode'
    },
    seekbarMode: {
      control: 'select',
      options: ['slider', 'waveform'],
      description: 'Seekbar scrubber style (MUI Slider or WaveData canvas)'
    },
    src: { control: 'text' },
    title: { control: 'text' },
    artist: { control: 'text' },
    album: { control: 'text' },
    artwork: { control: 'text' },
    showWaveform: { control: 'boolean' },
    enableWaveSurfer: { control: 'boolean' },
    autoExtractID3: { control: 'boolean' },
    accentColor: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', '#ec4899']
    },
    autoPlay: { control: 'boolean' },
    muted: { control: 'boolean' },
    loop: { control: 'boolean' }
  }
}

export default meta
type Story = StoryObj<typeof AudioPlayer>

export const CardVariant: Story = {
  args: {
    variant: 'card',
    src: sampleAudioUrl,
    title: 'Blizzard (Chapter One)',
    artist: 'Kai Engel',
    album: 'Chapter One / Cold',
    artwork: sampleArtwork,
    accentColor: 'primary',
    visualizer: 'wavesurfer',
    seekbarMode: 'waveform',
    showWaveform: true
  },
  render: (args) => (
    <Box sx={{ maxWidth: 460, mx: 'auto' }}>
      <AudioPlayer {...args} />
    </Box>
  )
}

export const WaveformSeekbarMode: Story = {
  args: {
    variant: 'card',
    src: sampleAudioUrl,
    title: 'Waveform Seekbar Demo',
    artist: 'Interactive Scrubber',
    album: 'Precision Navigation',
    artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    seekbarMode: 'waveform',
    visualizer: 'none',
    accentColor: 'secondary'
  },
  render: (args) => (
    <Box sx={{ maxWidth: 480, mx: 'auto' }}>
      <AudioPlayer {...args} />
    </Box>
  )
}

export const SpectrumVisualizerMode: Story = {
  args: {
    variant: 'card',
    src: sampleAudioUrl,
    title: 'Graphic Spectrum Analyzer',
    artist: 'Dynamic Frequency Bars',
    album: 'Peak Hold Physics',
    artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    visualizer: 'spectrum',
    seekbarMode: 'slider',
    accentColor: 'primary'
  },
  render: (args) => (
    <Box sx={{ maxWidth: 480, mx: 'auto' }}>
      <AudioPlayer {...args} />
    </Box>
  )
}

export const SynchronizedLyricsAndEditor: Story = {
  args: {
    variant: 'card',
    src: sampleAudioUrl,
    title: 'Blizzard (Karaoke Lyrics)',
    artist: 'Kai Engel',
    album: 'Chapter One / Cold',
    artwork: sampleArtwork,
    lyrics: SAMPLE_LYRICS,
    accentColor: 'primary',
    showWaveform: true,
  },
  render: (args) => (
    <Box sx={{ maxWidth: 500, mx: 'auto' }}>
      <AudioPlayer {...args} />
    </Box>
  )
}

export const WaveSurferAudioVisualizer: Story = {
  args: {
    variant: 'full',
    src: sampleAudioUrl,
    title: 'WaveSurfer Canvas Visualizer',
    artist: 'Kai Engel',
    album: 'Deep Space Frequencies',
    artwork: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    visualizer: 'wavesurfer',
    seekbarMode: 'waveform',
    lyrics: SAMPLE_LYRICS,
    accentColor: 'secondary',
  },
  render: (args) => (
    <Box sx={{ maxWidth: 860, mx: 'auto' }}>
      <AudioPlayer {...args} />
    </Box>
  )
}

export const CompactVariant: Story = {
  args: {
    variant: 'compact',
    src: sampleAudioUrl,
    title: 'Podcast Episode 42: Modern React Architecture',
    artist: 'Engineering Insights',
    artwork: sampleArtwork,
    visualizer: 'wavesurfer',
    seekbarMode: 'slider',
    accentColor: 'secondary'
  },
  render: (args) => (
    <Box sx={{ maxWidth: 640, mx: 'auto' }}>
      <AudioPlayer {...args} />
    </Box>
  )
}

export const FullHeroVariant: Story = {
  args: {
    variant: 'full',
    src: sampleAudioUrl,
    title: 'Blizzard (Full Hero)',
    artist: 'Kai Engel',
    album: 'Chapter One / Cold',
    artwork: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    accentColor: 'secondary',
    visualizer: 'wavesurfer',
    seekbarMode: 'waveform',
    showWaveform: true
  },
  render: (args) => (
    <Box sx={{ maxWidth: 860, mx: 'auto' }}>
      <AudioPlayer {...args} />
    </Box>
  )
}

export const AllVariantsShowcase: Story = {
  render: () => (
    <Stack spacing={4} sx={{ maxWidth: 860, mx: 'auto' }}>
      <Box>
        <h3>Card Variant (WaveData Seekbar)</h3>
        <AudioPlayer
          variant="card"
          src={sampleAudioUrl}
          title="Ambient Sunlight"
          artist="Solar Frequencies"
          artwork={sampleArtwork}
          seekbarMode="waveform"
          visualizer="wavesurfer"
          accentColor="primary"
        />
      </Box>

      <Box>
        <h3>Compact Variant</h3>
        <AudioPlayer
          variant="compact"
          src={sampleAudioUrl}
          title="Daily Tech Roundup: The Future of UI"
          artist="Daily Briefing"
          artwork={sampleArtwork}
          visualizer="spectrum"
          accentColor="secondary"
        />
      </Box>

      <Box>
        <h3>Full Hero Variant</h3>
        <AudioPlayer
          variant="full"
          src={sampleAudioUrl}
          title="Symphony No. 5 in C Minor"
          artist="Vienna Philharmonic"
          album="Masterpieces of Classical Music"
          artwork="https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80"
          accentColor="primary"
          visualizer="wavesurfer"
          showWaveform={true}
        />
      </Box>
    </Stack>
  )
}

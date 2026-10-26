import type { Meta, StoryObj } from '@storybook/react'
import { Box, Stack } from '@mui/material'
import { AudioPlayer } from './AudioPlayer'
import { SAMPLE_LYRICS } from '../../demo/sampleData'

const sampleAudioUrl =
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
const sampleArtwork =
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'

const meta: Meta<typeof AudioPlayer> = {
  title: 'Components/AudioPlayer',
  component: AudioPlayer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A modern MUI-based audio player with three distinct layout variants (`card`, `compact`, `full`), real-time synchronized karaoke lyrics with click-to-seek and live transcribing editor, ID3 tag auto-extraction for embedded artwork/lyrics, and interactive WaveSurfer.js waveform visualizer.'
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['card', 'compact', 'full'],
      description: 'Layout variant of audio player'
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
    title: 'Acoustic Horizon',
    artist: 'SoundHelix Collective',
    album: 'Deep Focus Chillout',
    artwork: sampleArtwork,
    accentColor: 'primary',
    showWaveform: true
  },
  render: (args) => (
    <Box sx={{ maxWidth: 460, mx: 'auto' }}>
      <AudioPlayer {...args} />
    </Box>
  )
}

export const SynchronizedLyricsAndEditor: Story = {
  args: {
    variant: 'card',
    src: sampleAudioUrl,
    title: 'Midnight Resonance',
    artist: 'Aura Soundscape',
    album: 'Nocturne Horizons',
    artwork: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80',
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
    title: 'Neon Odyssey (WaveSurfer Visualizer)',
    artist: 'Cyber Echo',
    album: 'Deep Space Frequencies',
    artwork: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    enableWaveSurfer: true,
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
    title: 'Midnight Synthwave Journey',
    artist: 'Cybernetic Echoes',
    album: 'Neon Skyline (Deluxe Edition)',
    artwork: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    accentColor: 'secondary',
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
        <h3>Card Variant</h3>
        <AudioPlayer
          variant="card"
          src={sampleAudioUrl}
          title="Ambient Sunlight"
          artist="Solar Frequencies"
          artwork={sampleArtwork}
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
          showWaveform={true}
        />
      </Box>
    </Stack>
  )
}

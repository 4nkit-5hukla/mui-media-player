import type { Meta, StoryObj } from '@storybook/react'
import { Box } from '@mui/material'
import { MediaPlayer } from './MediaPlayer'
import { SAMPLE_SUBTITLES, SAMPLE_AUDIO_TRACKS, SAMPLE_LYRICS } from '../../demo/sampleData'

const meta: Meta<typeof MediaPlayer> = {
  title: 'Components/MediaPlayer',
  component: MediaPlayer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Universal media component with intelligent format auto-detection. Automatically switches between `VideoPlayer` (for `.mp4`, `.webm`, etc.), `AudioPlayer` (for `.mp3`, `.wav`, etc.), and YouTube embedded player based on file extensions or URL structures, or accepts an explicit `type` override.'
      }
    }
  },
  argTypes: {
    src: { control: 'text' },
    type: {
      control: 'select',
      options: ['auto', 'video', 'audio', 'youtube']
    },
    visualizer: {
      control: 'select',
      options: ['wavesurfer', 'spectrum', 'bars', 'none']
    },
    seekbarMode: {
      control: 'select',
      options: ['slider', 'waveform']
    },
    title: { control: 'text' },
    artist: { control: 'text' },
    accentColor: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info']
    }
  }
}

export default meta
type Story = StoryObj<typeof MediaPlayer>

export const AutoDetectVideo: Story = {
  args: {
    type: 'auto',
    src: 'https://filesamples.com/samples/video/mp4/sample_1280x720_surfing_with_audio.mp4',
    title: 'Surfing Adventure 720p HD (.mp4)',
    subtitle: 'Action Sports Series',
    poster: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: '16/9',
    accentColor: 'primary',
    subtitles: SAMPLE_SUBTITLES,
    audioTracks: SAMPLE_AUDIO_TRACKS,
  },
  render: (args) => (
    <Box sx={{ maxWidth: 860, mx: 'auto' }}>
      <MediaPlayer {...args} />
    </Box>
  )
}

export const AutoDetectAudio: Story = {
  args: {
    type: 'auto',
    src: 'https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample.mp3',
    title: 'Blizzard (Auto-Detected MP3)',
    artist: 'Kai Engel',
    album: 'Chapter One / Cold',
    artwork: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80',
    lyrics: SAMPLE_LYRICS,
    audioVariant: 'card',
    visualizer: 'wavesurfer',
    seekbarMode: 'waveform',
    accentColor: 'primary'
  },
  render: (args) => (
    <Box sx={{ maxWidth: 460, mx: 'auto' }}>
      <MediaPlayer {...args} />
    </Box>
  )
}

export const AutoDetectYouTube: Story = {
  args: {
    type: 'auto',
    src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Never Gonna Give You Up (Auto-Detected YouTube)',
    aspectRatio: '16/9',
    accentColor: 'secondary'
  },
  render: (args) => (
    <Box sx={{ maxWidth: 860, mx: 'auto' }}>
      <MediaPlayer {...args} />
    </Box>
  )
}

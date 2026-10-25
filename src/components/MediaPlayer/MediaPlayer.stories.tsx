import type { Meta, StoryObj } from '@storybook/react'
import { Box } from '@mui/material'
import { MediaPlayer } from './MediaPlayer'

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
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    title: 'Auto-Detected Video Stream (.mp4)',
    poster: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: '16/9',
    accentColor: 'primary'
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
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    title: 'Auto-Detected Audio Track (.mp3)',
    artist: 'SoundHelix Acoustic',
    artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    audioVariant: 'card',
    accentColor: 'secondary'
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
    src: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    title: 'Auto-Detected YouTube Video',
    aspectRatio: '16/9',
    accentColor: 'primary'
  },
  render: (args) => (
    <Box sx={{ maxWidth: 860, mx: 'auto' }}>
      <MediaPlayer {...args} />
    </Box>
  )
}

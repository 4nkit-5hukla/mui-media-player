import type { Meta, StoryObj } from '@storybook/react'
import { Box, Typography } from '@mui/material'
import { MediaBar } from './MediaBar'
import { PlaylistProvider } from '../../context/PlaylistContext'
import { PlaylistItem } from '../../types/playlist'

const samplePlaylist: PlaylistItem[] = [
  {
    id: 'track-1',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    type: 'audio',
    title: 'Solar Echoes',
    artist: 'Cosmic Soundscapes',
    album: 'Deep Space Chill',
    artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    duration: 372
  },
  {
    id: 'track-2',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    type: 'audio',
    title: 'Neon Nights',
    artist: 'Retro Waveform',
    album: 'Cyber Odyssey',
    artwork: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    duration: 420
  },
  {
    id: 'track-3',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'video',
    title: 'Big Buck Bunny (Video)',
    artist: 'Blender Foundation',
    artwork: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=600&q=80',
    duration: 596
  }
]

const meta: Meta<typeof MediaBar> = {
  title: 'Components/MediaBar',
  component: MediaBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A persistent floating or docked media bar with sleek glassmorphism, top-edge scrub slider, playback controls, volume popup, and queue drawer. Supports positions: `floating` (floating pill island), `bottom` (docked across bottom viewport), and `top` (docked across top).'
      }
    }
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['floating', 'bottom', 'top'],
      description: 'Docked or floating position style'
    },
    accentColor: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info']
    }
  }
}

export default meta
type Story = StoryObj<typeof MediaBar>

export const FloatingIsland: Story = {
  args: {
    position: 'floating',
    accentColor: 'primary'
  },
  render: (args) => (
    <PlaylistProvider initialItems={samplePlaylist}>
      <Box sx={{ height: 400, position: 'relative', bgcolor: 'background.paper', p: 4, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          Page Content (MediaBar floats over page)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          The floating bar floats above other content, ideal for persistent background audio or podcasts across site navigation.
        </Typography>
        <MediaBar {...args} />
      </Box>
    </PlaylistProvider>
  )
}

export const DockedBottom: Story = {
  args: {
    position: 'bottom',
    accentColor: 'secondary'
  },
  render: (args) => (
    <PlaylistProvider initialItems={samplePlaylist}>
      <Box sx={{ height: 350, position: 'relative', bgcolor: 'background.paper', p: 4, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          Docked Bottom Player
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Full-width docked bar at the bottom edge.
        </Typography>
        <MediaBar {...args} />
      </Box>
    </PlaylistProvider>
  )
}

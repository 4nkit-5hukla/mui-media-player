import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Box, Button } from '@mui/material'
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite'
import { MediaCenter } from './MediaCenter'
import { PlaylistItem } from '../../types/playlist'

const samplePlaylist: PlaylistItem[] = [
  {
    id: 'vid-1',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'video',
    title: 'Big Buck Bunny',
    artist: 'Blender Foundation',
    artwork: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=600&q=80',
    duration: 596
  },
  {
    id: 'aud-1',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    type: 'audio',
    title: 'SoundHelix Ambient Flow',
    artist: 'SoundHelix Acoustic',
    album: 'Serenity Vol. 1',
    artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    duration: 372
  },
  {
    id: 'aud-2',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    type: 'audio',
    title: 'Electronic Pulse',
    artist: 'Digital Odyssey',
    album: 'Future Beats',
    artwork: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    duration: 420
  }
]

const meta: Meta<typeof MediaCenter> = {
  title: 'Components/MediaCenter',
  component: MediaCenter,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Comprehensive workstation and media hub. Offers two distinct modes: `embedded` (in-page side-by-side workstation with search, filter, queue management, and active player) and `modal` (lightbox dialog popup).'
      }
    }
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['embedded', 'modal'],
      description: 'Display mode for MediaCenter'
    },
    title: { control: 'text' },
    accentColor: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info']
    }
  }
}

export default meta
type Story = StoryObj<typeof MediaCenter>

export const EmbeddedWorkstation: Story = {
  args: {
    mode: 'embedded',
    title: 'Production Media Studio',
    playlist: samplePlaylist,
    accentColor: 'primary'
  },
  render: (args) => (
    <Box sx={{ maxWidth: 1200, mx: 'auto', height: 700 }}>
      <MediaCenter {...args} />
    </Box>
  )
}

export const ModalLightbox: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Button
          variant="contained"
          size="large"
          color="primary"
          startIcon={<PlayCircleFilledWhiteIcon />}
          onClick={() => setOpen(true)}
          sx={{ borderRadius: 3, px: 4, py: 1.5, textTransform: 'none', fontWeight: 600 }}
        >
          Open Media Center Lightbox
        </Button>

        <MediaCenter
          mode="modal"
          open={open}
          onClose={() => setOpen(false)}
          title="Media Center Hub"
          playlist={samplePlaylist}
          accentColor="secondary"
        />
      </Box>
    )
  }
}

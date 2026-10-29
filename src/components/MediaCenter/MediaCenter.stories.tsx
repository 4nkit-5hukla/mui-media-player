import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Box, Button } from '@mui/material'
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite'
import { MediaCenter } from './MediaCenter'
import { SAMPLE_PLAYLIST } from '../../demo/sampleData'

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
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', '#6366f1']
    }
  }
}

export default meta
type Story = StoryObj<typeof MediaCenter>

export const EmbeddedWorkstation: Story = {
  args: {
    mode: 'embedded',
    title: 'Studio Media Hub',
    playlist: SAMPLE_PLAYLIST,
    accentColor: 'primary'
  },
  render: (args) => (
    <Box sx={{ width: '100%', height: 600 }}>
      <MediaCenter {...args} />
    </Box>
  )
}

export const ModalLightbox: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          color="primary"
          startIcon={<PlayCircleFilledWhiteIcon />}
          onClick={() => setOpen(true)}
          sx={{ textTransform: 'none', px: 4, py: 1.5, borderRadius: 3, fontWeight: 700 }}
        >
          Open Media Center Lightbox
        </Button>

        <MediaCenter
          mode="modal"
          open={open}
          onClose={() => setOpen(false)}
          title="Media Library & Player"
          playlist={SAMPLE_PLAYLIST}
          accentColor="primary"
        />
      </Box>
    )
  }
}

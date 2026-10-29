import type { Meta, StoryObj } from '@storybook/react'
import { Box, Typography } from '@mui/material'
import { MediaBar } from './MediaBar'
import { PlaylistProvider } from '../../context/PlaylistContext'
import { SAMPLE_PLAYLIST } from '../../demo/sampleData'

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
    <PlaylistProvider initialItems={SAMPLE_PLAYLIST}>
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
    <PlaylistProvider initialItems={SAMPLE_PLAYLIST}>
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

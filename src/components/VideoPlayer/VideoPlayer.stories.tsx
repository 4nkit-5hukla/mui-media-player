import type { Meta, StoryObj } from '@storybook/react'
import { Box, Button } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ShareIcon from '@mui/icons-material/Share'
import { VideoPlayer } from './VideoPlayer'
import { SAMPLE_SUBTITLES, SAMPLE_AUDIO_TRACKS } from '../../demo/sampleData'

const sampleVideoUrl =
  'https://filesamples.com/samples/video/mp4/sample_1280x720_surfing_with_audio.mp4'
const samplePoster =
  'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80'

const meta: Meta<typeof VideoPlayer> = {
  title: 'Components/VideoPlayer',
  component: VideoPlayer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A sleek, responsive, production-ready video player component built on MUI. Includes subtitles with language switching (English, Spanish, French), multiple audio track switching (Original, Commentary, Dubbed), time scrubbing with buffer progress indicator, auto-hiding glassmorphic controls, volume slider with mute toggle, playback rate controls, picture-in-picture (PiP), fullscreen mode, keyboard shortcuts, and YouTube embed support.'
      }
    }
  },
  argTypes: {
    src: {
      control: 'text',
      description: 'Video source URL (HTML5 direct link or YouTube URL)'
    },
    title: {
      control: 'text',
      description: 'Primary title displayed in the top bar'
    },
    subtitle: {
      control: 'text',
      description: 'Subtitle / author / creator displayed beneath title'
    },
    poster: {
      control: 'text',
      description: 'Poster image URL before playback begins'
    },
    accentColor: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', '#f43f5e'],
      description: 'MUI palette accent or custom hex color'
    },
    aspectRatio: {
      control: 'select',
      options: ['16/9', '4/3', '1/1', '21/9', 'auto'],
      description: 'Aspect ratio container sizing'
    },
    autoPlay: { control: 'boolean' },
    muted: { control: 'boolean' },
    loop: { control: 'boolean' },
    disablePiP: { control: 'boolean' },
    disableFullscreen: { control: 'boolean' },
    disableKeyboard: { control: 'boolean' }
  }
}

export default meta
type Story = StoryObj<typeof VideoPlayer>

export const Default: Story = {
  args: {
    src: sampleVideoUrl,
    title: 'Surfing Adventure (720p HD)',
    subtitle: 'Action Sports Series',
    poster: samplePoster,
    aspectRatio: '16/9',
    accentColor: 'primary'
  },
  render: (args) => (
    <Box sx={{ maxWidth: 860, mx: 'auto' }}>
      <VideoPlayer {...args} />
    </Box>
  )
}

export const SubtitlesAndMultiAudioTracks: Story = {
  args: {
    src: sampleVideoUrl,
    title: 'Surfing with Subtitles & Multi-Audio Tracks',
    subtitle: 'Switch languages (English / Spanish / French) & Audio commentary in bottom bar',
    poster: samplePoster,
    aspectRatio: '16/9',
    accentColor: 'primary',
    subtitles: SAMPLE_SUBTITLES,
    audioTracks: SAMPLE_AUDIO_TRACKS,
  },
  render: (args) => (
    <Box sx={{ maxWidth: 860, mx: 'auto' }}>
      <VideoPlayer {...args} />
    </Box>
  )
}

export const YouTubeEmbed: Story = {
  args: {
    src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Never Gonna Give You Up (YouTube Stream)',
    subtitle: 'Embedded via smart YouTube fallback detection',
    aspectRatio: '16/9',
    accentColor: 'secondary'
  },
  render: (args) => (
    <Box sx={{ maxWidth: 860, mx: 'auto' }}>
      <VideoPlayer {...args} />
    </Box>
  )
}

export const CustomHeaderAndControls: Story = {
  args: {
    src: sampleVideoUrl,
    title: 'Cinematic Reel with Header Actions',
    subtitle: 'Custom buttons injected in header and control bar',
    poster: samplePoster,
    aspectRatio: '21/9',
    accentColor: 'secondary'
  },
  render: (args) => (
    <Box sx={{ maxWidth: 960, mx: 'auto' }}>
      <VideoPlayer
        {...args}
        headerActions={
          <Button
            size="small"
            variant="contained"
            color="secondary"
            startIcon={<ShareIcon />}
            sx={{ textTransform: 'none', borderRadius: 2 }}
            onClick={() => alert('Share clicked!')}
          >
            Share
          </Button>
        }
        extraControls={
          <Button
            size="small"
            variant="text"
            sx={{ color: '#fff', textTransform: 'none' }}
            startIcon={<InfoOutlinedIcon />}
            onClick={() => alert('Details overlay')}
          >
            Info
          </Button>
        }
      />
    </Box>
  )
}

export const CompactRatio: Story = {
  args: {
    src: sampleVideoUrl,
    title: 'Square Format (1:1 Ratio)',
    subtitle: 'Optimized for social feeds and cards',
    poster: samplePoster,
    aspectRatio: '1/1',
    accentColor: 'primary'
  },
  render: (args) => (
    <Box sx={{ maxWidth: 500, mx: 'auto' }}>
      <VideoPlayer {...args} />
    </Box>
  )
}

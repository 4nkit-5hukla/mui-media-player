import React, { useMemo } from 'react'
import type { Preview, StoryFn, StoryContext } from '@storybook/react'
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material'

export const globalTypes = {
  themeMode: {
    name: 'Theme Mode',
    description: 'Global theme mode for MUI components',
    defaultValue: 'dark',
    toolbar: {
      icon: 'mirror',
      items: [
        { value: 'light', title: 'Light Theme', icon: 'sun' },
        { value: 'dark', title: 'Dark Theme', icon: 'moon' }
      ],
      dynamicTitle: true
    }
  }
}

const withMuiTheme = (Story: StoryFn, context: StoryContext) => {
  const mode = (context.globals.themeMode as 'light' | 'dark') || 'dark'

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'dark' ? '#38bdf8' : '#0284c7'
          },
          secondary: {
            main: '#a855f7'
          },
          background: {
            default: mode === 'dark' ? '#0b0f19' : '#f8fafc',
            paper: mode === 'dark' ? '#111827' : '#ffffff'
          }
        },
        typography: {
          fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif'
          ].join(',')
        },
        shape: {
          borderRadius: 12
        }
      }),
    [mode]
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          p: 3,
          bgcolor: 'background.default',
          color: 'text.primary',
          boxSizing: 'border-box'
        }}
      >
        <Story />
      </Box>
    </ThemeProvider>
  )
}

const preview: Preview = {
  decorators: [withMuiTheme],
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    }
  }
}

export default preview

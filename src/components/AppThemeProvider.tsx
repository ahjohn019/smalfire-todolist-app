'use client'

import * as React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'

const DARK_MODE_MEDIA_QUERY = '(prefers-color-scheme: dark)'

function subscribeToColorScheme(onStoreChange: () => void) {
  const mediaQueryList = window.matchMedia(DARK_MODE_MEDIA_QUERY)

  mediaQueryList.addEventListener('change', onStoreChange)

  return () => {
    mediaQueryList.removeEventListener('change', onStoreChange)
  }
}

function getColorSchemeSnapshot() {
  return window.matchMedia(DARK_MODE_MEDIA_QUERY).matches
}

function getServerColorSchemeSnapshot() {
  return false
}

export default function AppThemeProvider({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const isDarkMode = React.useSyncExternalStore(
    subscribeToColorScheme,
    getColorSchemeSnapshot,
    getServerColorSchemeSnapshot
  )

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
          primary: {
            main: '#ef4444',
            contrastText: '#ffffff'
          },
          background: {
            default: isDarkMode ? '#0a0a0a' : '#ffffff',
            paper: isDarkMode ? '#171717' : '#ffffff'
          },
          text: {
            primary: isDarkMode ? '#ededed' : '#171717',
            secondary: isDarkMode ? '#a3a3a3' : '#525252'
          }
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none'
              }
            }
          }
        }
      }),
    [isDarkMode]
  )

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

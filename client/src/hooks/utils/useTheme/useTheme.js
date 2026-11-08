import { useCallback, useEffect, useState } from 'react'

export const THEME_STORAGE_KEY = 'theme'

function readStoredTheme() {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return stored === 'dark' || stored === 'light' ? stored : null
  } catch {
    return null
  }
}

function getSystemTheme() {
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
  return prefersDark ? 'dark' : 'light'
}

export function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  return readStoredTheme() ?? getSystemTheme()
}

/**
 * Light/dark theme state. Applies the `dark` class to <html> and
 * persists an explicit user choice in localStorage. Without a saved
 * choice it follows the system `prefers-color-scheme`.
 */
export function useTheme() {
  const [theme, setThemeState] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const setTheme = useCallback((next) => {
    setThemeState(next)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Storage may be unavailable (private mode); theme still applies for the session
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  return { theme, isDark: theme === 'dark', setTheme, toggleTheme }
}

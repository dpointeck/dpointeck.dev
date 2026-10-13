import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Get theme from localStorage or default to system
    const savedTheme = localStorage.getItem('theme') as Theme | null
    const initialTheme = savedTheme || 'system'
    setTheme(initialTheme)

    // Apply the theme
    const root = document.documentElement
    if (initialTheme === 'system') {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches
      if (prefersDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    } else if (initialTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      const currentTheme = localStorage.getItem('theme') as Theme | null
      if (!currentTheme || currentTheme === 'system') {
        if (e.matches) {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
      }
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    const root = document.documentElement
    let newTheme: Theme

    if (theme === 'system') {
      newTheme = 'light'
      root.classList.remove('dark')
    } else if (theme === 'light') {
      newTheme = 'dark'
      root.classList.add('dark')
    } else {
      newTheme = 'system'
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches
      if (prefersDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }

    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  // Prevent hydration mismatch - show a proper icon placeholder
  if (!mounted) {
    return (
      <button
        className="text-muted transition-colors p-1.5"
        aria-label="Toggle theme"
        style={{
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: '16px', height: '16px', opacity: 0.6 }}
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      </button>
    )
  }

  const getIcon = () => {
    if (theme === 'system') {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="16"
          height="16"
          style={{ width: '16px', height: '16px' }}
        >
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      )
    } else if (theme === 'light') {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="16"
          height="16"
          style={{ width: '16px', height: '16px' }}
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )
    } else {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="16"
          height="16"
          style={{ width: '16px', height: '16px' }}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="text-muted hover:text-primary transition-colors p-1.5 rounded-md bg-hover"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} mode`}
      title={`Current: ${theme === 'system' ? 'system' : theme === 'light' ? 'light' : 'dark'}`}
    >
      {getIcon()}
    </button>
  )
}

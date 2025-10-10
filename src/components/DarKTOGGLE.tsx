import { useState, useEffect } from 'react'

export function DarKTOGGLE() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark)

    if (shouldUseDark) {
      document.documentElement.classList.add('dark')
      setIsDark(true)
    } else {
      document.documentElement.classList.remove('dark')
      setIsDark(false)
    }
  }, [])

  const toggleDarkMode = () => {
    const nextIsDark = !isDark
    setIsDark(nextIsDark)

    if (nextIsDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <button
      onClick={toggleDarkMode}
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        padding: '10px',
        borderRadius: '50%',
        backgroundColor: isDark ? '#333' : '#eee',
        color: isDark ? '#fff' : '#000',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}

export default DarKTOGGLE;
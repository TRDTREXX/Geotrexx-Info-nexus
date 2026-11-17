"use client"

import { useEffect, useState } from 'react'

export function LiveClock() {
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      const formatted = now.toLocaleTimeString('en-GB', {
        timeZone: 'GMT',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      setTime(formatted)
    }

    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className="text-gray-300 font-mono">
      ACCRA • {time ? `${time} GMT` : 'GMT'}
    </span>
  )
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('geotrexx-theme')
    if (savedTheme === 'dark') {
      setDark(true)
      document.documentElement.classList.add('dark')
    } else {
      setDark(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const nextDark = !dark
    setDark(nextDark)
    if (nextDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('geotrexx-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('geotrexx-theme', 'light')
    }
  }

  if (!mounted) {
    return (
      <div className="w-20 h-5 border border-geotrexx-charcoal bg-transparent inline-block" />
    )
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Light and Dark Theme"
      className="px-2.5 py-0.5 border border-gray-500 text-[10px] font-mono font-bold uppercase tracking-widest text-white hover:border-geotrexx-crimson hover:bg-geotrexx-crimson transition-colors cursor-pointer"
    >
      {dark ? '☀ LIGHT' : '☾ DARK'}
    </button>
  )
}
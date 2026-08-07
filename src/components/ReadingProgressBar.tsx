'use client'
import { useEffect, useState } from 'react'

export default function ReadingProgressBar() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTotal = document.documentElement.scrollTop
      const heightWin = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scroll = `${(scrollTotal / heightWin) * 100}%`
      setWidth(scrollTotal / heightWin * 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 z-[100] h-1 bg-geo-red transition-all duration-150 ease-out" style={{ width: `${width}%` }} />
  )
}
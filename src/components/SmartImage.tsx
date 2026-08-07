'use client'
import { useState, useEffect } from 'react'

interface Props {
  baseName: string;
  altName: string;
  className: string;
}

export default function SmartImage({ baseName, altName, className }: Props) {
  const [errorCount, setErrorCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => setMounted(true), [])

  // The scanner checks every possible way Windows might have named the file
  const paths = [
    `/${baseName}.jpg`,
    `/${baseName}.jpeg`,
    `/${baseName}.png`,
    `/${baseName}.png.jpeg`,
    `/${baseName}.jpeg.jpg`
  ]

  // Prevents screen flashing before the client loads
  if (!mounted) return <div className={`${className} bg-gray-200 dark:bg-gray-800 animate-pulse`} />

  // If the file absolutely isn't on Vercel, generate a premium red avatar fallback
  if (errorCount >= paths.length) {
    const formattedName = altName.replace(/\s+/g, '+')
    return <img src={`https://ui-avatars.com/api/?name=${formattedName}&background=C8102E&color=fff&bold=true`} alt={altName} className={className} />
  }

  return (
    <img 
      src={paths[errorCount]} 
      alt={altName} 
      className={className}
      onError={() => setErrorCount(prev => prev + 1)}
    />
  )
}
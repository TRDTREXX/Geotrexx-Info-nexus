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

  // 🚀 VERCEL CASE-SENSITIVITY BYPASS
  // Vercel/Linux is strictly case-sensitive. This array checks every possible 
  // combination of capitalizations and extensions your file might be hiding under.
  const CapitalizedBase = baseName.charAt(0).toUpperCase() + baseName.slice(1);
  
  const paths = [
    `/${baseName}.png`,
    `/${baseName}.jpg`,
    `/${baseName}.jpeg`,
    `/${baseName}.PNG`,
    `/${baseName}.JPG`,
    `/${CapitalizedBase}.png`,
    `/${CapitalizedBase}.jpg`,
    `/${CapitalizedBase}.PNG`,
    `/${CapitalizedBase}.JPG`,
    `/${baseName}.png.jpeg`,
    `/${baseName}.jpeg.jpg`
  ]

  // Prevents screen flashing before the client loads
  if (!mounted) return <div className={`${className} bg-gray-200 dark:bg-gray-800 animate-pulse`} />

  // If absolutely none of those paths exist on Vercel, use the red initials fallback
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
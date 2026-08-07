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

  const CapitalizedBase = baseName.charAt(0).toUpperCase() + baseName.slice(1);
  
  // 🚀 Added the EXACT file name you created right at the top!
  const paths = [
    `/${baseName}.png.JPG`,
    `/${baseName}.png.jpg`,
    `/${baseName}.png`,
    `/${baseName}.jpg`,
    `/${baseName}.jpeg`,
    `/${baseName}.PNG`,
    `/${baseName}.JPG`,
    `/${CapitalizedBase}.png`,
    `/${CapitalizedBase}.jpg`,
    `/${baseName}.png.jpeg`
  ]

  if (!mounted) return <div className={`${className} bg-gray-200 dark:bg-gray-800 animate-pulse`} />

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
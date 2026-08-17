"use client";
import { useState } from 'react';

export default function SmartImage({ src, alt, className, fallbackText = "GEOTREXX" }: any) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 dark:bg-gray-800 ${className}`}>
        <span className="text-gray-400 dark:text-gray-600 text-xs font-black uppercase tracking-widest">{fallbackText}</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt || "Geotrexx Image"} 
      className={className} 
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
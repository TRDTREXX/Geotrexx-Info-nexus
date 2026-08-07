'use client'

import { useState } from 'react'
import NewsCard from '../../components/NewsCard'

export default function SearchPage() {
  const [query, setQuery] = useState('')

  // In a full production setup, this would connect to an API route to fetch search results from Hygraph. 
  // For now, it establishes the elite UI placeholder.
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[70vh]">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6">Search GEOTREXX</h1>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search for news, analytics, or authors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#1a1b23] text-gray-900 dark:text-white px-6 py-4 rounded-full border-2 border-gray-200 dark:border-gray-800 focus:border-[#C8102E] focus:outline-none focus:ring-0 transition-colors text-lg shadow-sm"
          />
          <button className="absolute right-2 top-2 bottom-2 bg-[#C8102E] text-white px-6 rounded-full font-bold uppercase tracking-wider hover:bg-red-800 transition-colors">
            Search
          </button>
        </div>
      </div>

      {query && (
        <div className="text-center text-gray-500 py-10">
          <p>Search indexing is currently being optimized. Displaying results for: <span className="font-bold text-gray-900 dark:text-white">{query}</span></p>
        </div>
      )}
    </div>
  )
}
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function SiteNavigation() {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (isSidebarOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'auto'
  }, [isSidebarOpen])

  const tabs = ['Politics', 'Business', 'Sports', 'Technology', 'Entertainment', 'World', 'Opinion']

  return (
    <>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
        .animate-ticker {
          display: inline-block;
          white-space: nowrap;
          animation: ticker 30s linear infinite;
        }
        .ticker-container:hover .animate-ticker {
          animation-play-state: paused;
        }
      `}</style>

      {/* Sidebar */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]" onClick={() => setSidebarOpen(false)} />}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-[#0a0b10] z-[90] transform transition-transform duration-300 border-r border-gray-200 dark:border-gray-800 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <Link href="/" onClick={() => setSidebarOpen(false)} className="block">
            <img src="/geotrexx-logo.png" alt="GEOTREXX Logo" className="h-10 w-10 object-cover rounded-full shadow-sm bg-gray-100 dark:bg-gray-800 p-1" />
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-[#C8102E] transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Sections</h3>
          {tabs.map((tab) => (
            <Link key={tab} href={`/category/${tab.toLowerCase()}`} onClick={() => setSidebarOpen(false)} className="text-xl font-bold text-gray-900 dark:text-white hover:text-[#C8102E] transition-colors">
              {tab}
            </Link>
          ))}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
            <Link href="/creator" onClick={() => setSidebarOpen(false)} className="text-xl font-bold text-gray-900 dark:text-white hover:text-[#C8102E] transition-colors">
              Our Creators
            </Link>
          </div>
        </div>
      </div>

      {/* Scrolling Breaking News Ticker */}
      <div className="w-full bg-[#C8102E] text-white py-1.5 px-4 text-xs font-bold tracking-widest flex items-center overflow-hidden ticker-container relative z-50">
        <div className="flex items-center gap-2 mr-4 flex-shrink-0 z-10 bg-[#C8102E] pr-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="uppercase">Breaking</span>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-ticker text-white/90 uppercase">
            Global Markets see unprecedented shifts &bull; Major political summit concludes in Accra &bull; Tech giants announce breakthrough AI frameworks &bull; GEOTREXX brings you the truth first.
          </div>
        </div>
        <div className="hidden md:flex gap-6 text-white/80 ml-4 flex-shrink-0 z-10 bg-[#C8102E] pl-2 border-l border-red-800">
          <Link href="/login" className="hover:text-white transition-colors">SIGN IN</Link>
          <Link href="/subscribe" className="hover:text-white transition-colors">SUBSCRIBE</Link>
        </div>
      </div>

      {/* Main Centered Header - Forced White in Light Mode, Black in Dark Mode with Top Crimson Border */}
      <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#0a0b10] border-t-4 border-[#C8102E] shadow-sm transition-all">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <div className="flex-1">
            <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-gray-900 dark:text-white hover:text-[#C8102E] transition-colors flex items-center gap-2 font-bold uppercase text-sm tracking-widest">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              <span className="hidden md:block">Menu</span>
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            <Link href="/" className="block group">
              <img src="/geotrexx-logo.png" alt="GEOTREXX Logo" className="h-12 w-12 md:h-14 md:w-14 object-cover rounded-full shadow-md bg-white dark:bg-gray-800 p-1 group-hover:opacity-80 transition-opacity border border-gray-200 dark:border-gray-700" />
            </Link>
          </div>
          <div className="flex-1 flex justify-end items-center gap-4">
            <Link href="/search" className="p-2 text-gray-900 dark:text-white hover:text-[#C8102E] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </Link>
            <ThemeToggle />
          </div>
        </div>

        {/* TABS - Forced White in Light Mode */}
        <div className="w-full bg-white dark:bg-[#0a0b10] border-b border-gray-200 dark:border-gray-800 hidden md:block overflow-x-auto shadow-sm">
          <div className="max-w-[1400px] mx-auto px-4 flex justify-center gap-10 py-3">
            {tabs.map((tab) => (
              <Link key={tab} href={`/category/${tab.toLowerCase()}`} className="text-xs font-black uppercase tracking-widest text-gray-900 hover:text-[#C8102E] dark:text-gray-300 dark:hover:text-[#C8102E] transition-colors relative group py-1">
                {tab}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#C8102E] transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>
        </div>
      </header>
    </>
  )
}
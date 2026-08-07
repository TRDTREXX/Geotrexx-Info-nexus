'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function SiteNavigation() {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [authModal, setAuthModal] = useState<'signin' | 'subscribe' | null>(null)

  // Prevent background scrolling when a menu or modal is open
  useEffect(() => {
    if (isSidebarOpen || authModal) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'auto'
  }, [isSidebarOpen, authModal])

  const tabs = ['Politics', 'Business', 'Sports', 'Technology', 'Entertainment', 'World', 'Opinion']

  return (
    <>
      {/* 1. Working Authentication Modal */}
      {authModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 transition-opacity">
          <div className="bg-white dark:bg-[#1a1b23] p-8 rounded-2xl shadow-2xl max-w-md w-full relative border border-gray-200 dark:border-gray-800">
            <button onClick={() => setAuthModal(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="text-center mb-6">
              <img src="/geotrexx-logo.png" alt="GEOTREXX" className="h-10 mx-auto mb-4 object-contain" />
              <h2 className="text-2xl font-black uppercase tracking-widest text-gray-900 dark:text-white">
                {authModal === 'signin' ? 'Welcome Back' : 'Join the Elite'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {authModal === 'signin' ? 'Sign in to access premium analytics and saved articles.' : 'Subscribe for unrestricted access to world-class journalism.'}
              </p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert('Authentication endpoint connecting...') }}>
              <input type="email" placeholder="Email Address" className="w-full bg-gray-50 dark:bg-[#0a0b10] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-[#C8102E] dark:text-white transition-colors" required />
              {authModal === 'signin' && (
                <input type="password" placeholder="Password" className="w-full bg-gray-50 dark:bg-[#0a0b10] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-[#C8102E] dark:text-white transition-colors" required />
              )}
              <button type="submit" className="w-full bg-[#C8102E] text-white font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-red-800 transition-colors">
                {authModal === 'signin' ? 'Sign In' : 'Subscribe Now'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Slide-out Sidebar (Contains Logo #1) */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]" onClick={() => setSidebarOpen(false)} />}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-[#0a0b10] z-[90] transform transition-transform duration-300 border-r border-gray-200 dark:border-gray-800 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <Link href="/" onClick={() => setSidebarOpen(false)} className="block">
            {/* LOGO 1: SIDEBAR */}
            <img src="/geotrexx-logo.png" alt="GEOTREXX Logo" className="h-8 w-auto object-contain" />
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
        </div>
      </div>

      {/* 3. Top Utility Bar */}
      <div className="w-full bg-[#1a1b23] text-white py-1.5 px-4 text-xs font-medium tracking-wide flex justify-between items-center border-b border-[#C8102E]">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8102E] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C8102E]"></span>
          </span>
          <span className="uppercase text-gray-300">Live: Global Markets Update</span>
        </div>
        <div className="hidden md:flex gap-6 text-gray-400">
          <button onClick={() => setAuthModal('signin')} className="hover:text-white uppercase font-bold tracking-wider transition-colors">Sign In</button>
          <button onClick={() => setAuthModal('subscribe')} className="hover:text-white uppercase font-bold tracking-wider transition-colors">Subscribe</button>
        </div>
      </div>

      {/* 4. Main Centered Header (Contains Logo #2) */}
      <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#0a0b10]/95 backdrop-blur-md shadow-sm transition-all">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          
          {/* Left: Hamburger Icon */}
          <div className="flex-1">
            <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:text-[#C8102E] transition-colors flex items-center gap-2 font-bold uppercase text-sm tracking-widest">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              <span className="hidden md:block">Menu</span>
            </button>
          </div>

          {/* Center: LOGO 2 */}
          <div className="flex-1 flex justify-center">
            <Link href="/" className="block group">
              <img src="/geotrexx-logo.png" alt="GEOTREXX Logo" className="h-10 md:h-12 w-auto object-contain group-hover:opacity-80 transition-opacity" />
            </Link>
          </div>

          {/* Right: Search & Theme */}
          <div className="flex-1 flex justify-end items-center gap-4">
            <Link href="/search" className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#C8102E] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </Link>
            <ThemeToggle />
          </div>
        </div>

        {/* 5. TABS / Secondary Navigation Bar */}
        <div className="w-full bg-white dark:bg-[#0a0b10] border-b border-gray-200 dark:border-gray-800 hidden md:block overflow-x-auto shadow-sm">
          <div className="max-w-[1400px] mx-auto px-4 flex justify-center gap-10 py-3">
            {tabs.map((tab) => (
              <Link key={tab} href={`/category/${tab.toLowerCase()}`} className="text-xs font-black uppercase tracking-widest text-gray-600 hover:text-[#C8102E] dark:text-gray-400 dark:hover:text-[#C8102E] transition-colors relative group py-1">
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
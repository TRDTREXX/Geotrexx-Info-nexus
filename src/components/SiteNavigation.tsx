"use client";

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function SiteNavigation({ tickerText = "GEOTREXX: UNBIASED, ACCURATE AND AUTHORITATIVE." }: { tickerText?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'GHANA', path: '/category/ghana', sub: ['Latest', 'Accra', 'Regions', 'Society', 'Education', 'Health', 'Crime & Security'] },
    { name: 'POLITICS', path: '/category/politics', sub: ['Ghana Politics', 'Government', 'Parliament', 'Elections', 'Political Analysis'] },
    { name: 'BUSINESS', path: '/category/business', sub: ['Economy', 'Finance', 'Banking', 'Markets', 'Companies', 'Energy'] },
    { name: 'SPORTS', path: '/category/sports', sub: ['Football', 'Transfers', 'Basketball', 'Tennis', 'Boxing', 'Athletics', 'Motorsport'] },
    { name: 'STEM', path: '/category/stem', sub: ['Science', 'Technology', 'Engineering', 'Mathematics', 'AI', 'Innovation', 'Space'] },
    { name: 'ENTERTAINMENT', path: '/category/entertainment', sub: ['Music', 'Movies & TV', 'Celebrity', 'Arts', 'Lifestyle'] },
    { name: 'WORLD', path: '/category/world', sub: ['Africa', 'Europe', 'Americas', 'Asia', 'Middle East', 'International'] },
    { name: 'OPINION', path: '/category/opinion', sub: ['Editorial', 'Analysis', 'Commentary', 'Columns'] },
  ];

  return (
    <div className="w-full flex flex-col sticky top-0 z-50 bg-white dark:bg-[#0a0b10]">
      
      {/* 1. TICKER TAPE */}
      <div className="bg-[#C8102E] text-white flex items-center h-10 text-xs font-bold tracking-[0.2em] overflow-hidden relative shadow-md z-20">
        <div className="px-4 z-10 flex items-center bg-[#C8102E] h-full border-r border-white/20 whitespace-nowrap absolute left-0 shadow-[5px_0_15px_rgba(200,16,46,1)]">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse mr-2"></span>
          BREAKING
        </div>
        <div className="flex-1 overflow-hidden h-full flex items-center relative">
          <div className="animate-ticker">
            {tickerText} {tickerText}
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <header className="w-full border-b border-gray-200 dark:border-gray-800 h-20 md:h-24 flex items-center justify-between px-4 md:px-8 transition-colors z-30 relative shadow-sm">
        
        {/* Mobile Menu Button */}
        <div className="flex items-center w-1/3 md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="flex items-center space-x-2 text-gray-900 dark:text-white hover:text-[#C8102E] dark:hover:text-[#C8102E] transition-colors p-2 -ml-2"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#C8102E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        <div className="hidden md:block w-1/3"></div>

        {/* Center: Premium Logo */}
        {/* 🔥 THE FIX: Added relative, z-50, and cursor-pointer to force clickability over anything else on the page */}
        <Link href="/" onClick={() => setMobileMenuOpen(false)} className="relative z-50 cursor-pointer flex flex-col items-center justify-center w-1/3 group">
          <img 
            src="/geotrexx-logo.png" 
            alt="GEOTREXX" 
            className="h-14 w-14 md:h-20 md:w-20 object-cover rounded-full border-2 border-gray-200 dark:border-gray-800 block group-hover:scale-105 group-hover:border-[#C8102E] transition-all duration-300 drop-shadow-md cursor-pointer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <h1 className="hidden text-3xl md:text-5xl font-black tracking-tighter text-gray-900 dark:text-white leading-none group-hover:scale-105 transition-transform duration-300 cursor-pointer">
            GEO<span className="text-[#C8102E]">TREXX</span>
          </h1>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center justify-end space-x-4 md:space-x-6 w-1/3 relative z-50">
          {mounted && (
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className="text-gray-900 dark:text-white hover:text-[#C8102E] dark:hover:text-[#C8102E] transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
          )}
        </div>
      </header>

      {/* 3. DESKTOP MEGA-MENU */}
      <nav className="w-full bg-gray-100 dark:bg-[#1a1b23] border-b border-gray-200 dark:border-gray-800 transition-colors hidden md:block shadow-sm z-20">
        <ul className="flex justify-center space-x-8 text-xs font-bold tracking-[0.15em] text-gray-900 dark:text-gray-300 uppercase">
          {navLinks.map((link) => (
            <li key={link.name} className="relative group py-4">
              <Link href={link.path} className="hover:text-[#C8102E] dark:hover:text-[#C8102E] transition-colors pb-4">
                {link.name}
              </Link>
              
              {link.sub && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-0 hidden group-hover:block bg-white dark:bg-[#0a0b10] shadow-xl border border-gray-200 dark:border-gray-800 rounded-b-lg py-2 w-48 z-50">
                  {link.sub.map((subItem) => {
                    const formatPath = subItem.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
                    return (
                      <Link 
                        key={subItem} 
                        href={`${link.path}/${formatPath}`}
                        className="block px-4 py-2.5 text-[10px] tracking-widest text-gray-700 dark:text-gray-400 hover:text-[#C8102E] dark:hover:text-[#C8102E] hover:bg-gray-50 dark:hover:bg-[#1a1b23] transition-colors cursor-pointer"
                      >
                        {subItem}
                      </Link>
                    );
                  })}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* 4. FULLSCREEN MOBILE OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[116px] md:top-[136px] bg-white dark:bg-[#0a0b10] z-40 overflow-y-auto pb-32 border-t border-gray-200 dark:border-gray-800 transition-all">
          <ul className="flex flex-col py-6 px-6 space-y-6 text-sm font-bold tracking-widest text-gray-900 dark:text-white uppercase">
            {navLinks.map((link) => (
              <li key={link.name} className="border-b border-gray-100 dark:border-gray-800 pb-6">
                <Link href={link.path} onClick={() => setMobileMenuOpen(false)} className="block text-xl hover:text-[#C8102E] transition-colors cursor-pointer">
                  {link.name}
                </Link>
                {link.sub && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {link.sub.map((subItem) => {
                      const formatPath = subItem.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
                      return (
                        <Link 
                          key={subItem}
                          href={`${link.path}/${formatPath}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-[10px] bg-gray-100 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-3 py-2 rounded-md hover:border-[#C8102E] hover:text-[#C8102E] transition-colors cursor-pointer"
                        >
                          {subItem}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
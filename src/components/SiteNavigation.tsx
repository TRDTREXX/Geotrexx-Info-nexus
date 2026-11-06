'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';

export default function SiteNavigation() {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Ghana', href: '/category/ghana' },
    { name: 'Politics', href: '/category/politics' },
    { name: 'Sports', href: '/category/sports' },
  ];

  const breakingNewsText = "OFFICIAL: CRISTIANO RONALDO CONFIRMS NEXT CAREER MOVE • GHANA SUPREME COURT DELIVERS LANDMARK RULING ON DECENTRALIZATION • NEW PARLIAMENTARY FISCAL BILL PROPOSED";

  return (
    <header className="w-full bg-white dark:bg-[#121826] shadow-sm sticky top-0 z-40 transition-colors duration-300">
      
      {/* SEAMLESS TICKER CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          display: flex;
          width: max-content;
          animation: ticker 35s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}} />

      {/* Tier 1: Red Breaking News Bar */}
      <div className="w-full bg-[#C8102E] text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center overflow-hidden relative h-8 sm:h-9">
        
        {/* Static Breaking Badge (Sits on top to hide scrolling text underneath) */}
        <div className="flex items-center gap-2 whitespace-nowrap z-20 bg-[#C8102E] h-full px-4 border-r border-red-800 shadow-[5px_0_10px_rgba(200,16,46,1)]">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          <span>BREAKING</span>
        </div>
        
        {/* Seamless Scrolling Ticker Track */}
        <div className="flex-1 overflow-hidden h-full flex items-center relative z-10">
          <div className="animate-ticker cursor-pointer">
            {/* We render the text twice side-by-side to create an infinite gapless loop */}
            <span className="px-8 whitespace-nowrap">{breakingNewsText}</span>
            <span className="px-8 whitespace-nowrap">{breakingNewsText}</span>
          </div>
        </div>
      </div>

      {/* Tier 2: Centered Circular Logo & Dark Mode Toggle */}
      <div className="relative w-full max-w-7xl mx-auto px-4 py-3 sm:py-5 flex items-center justify-center">
        <Link href="/" className="focus:outline-none shrink-0 rounded-full shadow-md border border-gray-200">
          <img 
            src="/geotrexx-logo.png" 
            alt="GEOTREXX INFO NEXUS" 
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full" 
          />
        </Link>
        <button 
          onClick={toggleDarkMode}
          className="absolute right-4 sm:right-8 text-gray-800 dark:text-gray-200 hover:text-[#C8102E] dark:hover:text-[#C8102E] transition-colors"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun className="w-5 h-5 sm:w-6 sm:h-6" /> : <Moon className="w-5 h-5 sm:w-6 sm:h-6" />}
        </button>
      </div>

      {/* Tier 3: Navigation Tab Bar (Unified for Desktop & Mobile) */}
      <div className="w-full border-t border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <nav 
          aria-label="Primary Editorial Navigation" 
          className="max-w-7xl mx-auto px-2 flex items-center justify-start lg:justify-center overflow-x-auto no-scrollbar"
        >
          <ul className="flex items-center space-x-1 sm:space-x-6 py-2.5 whitespace-nowrap">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className={`px-3 py-1 text-[10px] sm:text-xs font-black tracking-widest uppercase transition-colors ${
                      isActive 
                        ? 'text-[#C8102E]' 
                        : 'text-gray-800 dark:text-gray-300 hover:text-[#C8102E] dark:hover:text-white'
                    }`}
                    style={{ fontFamily: 'Oswald, sans-serif' }}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
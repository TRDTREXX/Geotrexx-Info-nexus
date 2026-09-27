'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SiteNavigationProps {
  tickerText?: string;
}

export default function SiteNavigation({ tickerText }: SiteNavigationProps) {
  const pathname = usePathname();

  // Active Core Pillars for Google AdSense Review
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Ghana', href: '/category/ghana' },
    { name: 'Politics', href: '/category/politics' },
    { name: 'Sports', href: '/category/sports' },

    // TEMPORARILY COMMENTED OUT FOR REVIEW COMPLIANCE:
    // { name: 'Business', href: '/category/business' },
    // { name: 'STEM', href: '/category/stem' },
    // { name: 'Entertainment', href: '/category/entertainment' },
    // { name: 'World', href: '/category/world' },
    // { name: 'Opinion', href: '/category/opinion' },
  ];

  return (
    <nav className="w-full bg-[#121826] text-white border-t border-b border-gray-800">
      {tickerText && (
        <div className="bg-[#C8102E] px-4 py-1.5 text-xs font-bold truncate text-center tracking-wider">
          {tickerText}
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between overflow-x-auto">
        <div className="flex items-center space-x-1 sm:space-x-4 py-3 whitespace-nowrap">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors duration-150 rounded ${
                  isActive
                    ? 'bg-[#C8102E] text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
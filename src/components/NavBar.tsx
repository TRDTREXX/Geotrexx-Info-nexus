'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export interface SubItem {
  name: string;
  slug: string;
}

interface NavBarProps {
  dynamicSubsections?: Record<string, SubItem[]>;
}

const BASE_TABS = [
  { name: 'Top News', href: '/', sectionSlug: '' },
  { name: 'Ghana', href: '/category/ghana', sectionSlug: 'ghana' },
  { name: 'Politics', href: '/category/politics', sectionSlug: 'politics' },
  { name: 'World', href: '/category/world', sectionSlug: 'world' },
  { name: 'Business & Tech', href: '/category/business', sectionSlug: 'business' },
  { name: 'TREXXfield', href: '/category/sports', sectionSlug: 'sports' },
];

export default function NavBar({ dynamicSubsections = {} }: NavBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      setSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <div className="w-full lg:w-auto flex flex-col">
      <div className="flex items-center justify-between gap-2 w-full">
        <nav className="flex-1 overflow-x-auto lg:overflow-visible no-scrollbar py-0">
          <ul className="flex items-center space-x-4 sm:space-x-6 md:space-x-7 text-[11px] sm:text-xs md:text-sm font-extrabold uppercase tracking-wider text-geotrexx-black list-none m-0 p-0 min-w-max">
            {BASE_TABS.map((tab) => {
              const isActive =
                tab.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(tab.href) ||
                    (tab.sectionSlug === 'sports' && pathname.includes('/trexxfield'));

              const subs = tab.sectionSlug ? dynamicSubsections[tab.sectionSlug] || [] : [];

              return (
                <li key={tab.name} className="relative group shrink-0">
                  <Link
                    href={tab.href}
                    className={`block py-2.5 lg:py-3.5 border-b-[3px] transition-colors whitespace-nowrap no-underline ${
                      isActive
                        ? 'border-geotrexx-crimson text-geotrexx-crimson font-black'
                        : 'border-transparent text-geotrexx-black hover:border-geotrexx-crimson hover:text-geotrexx-crimson'
                    }`}
                  >
                    {tab.name}
                  </Link>

                  {subs.length > 0 && (
                    <div className="hidden lg:group-hover:block absolute left-0 top-full w-56 bg-white border-2 border-geotrexx-black border-t-[3px] border-t-geotrexx-crimson z-50 shadow-lg">
                      <ul className="divide-y divide-gray-200 list-none m-0 p-0">
                        {subs.map((sub) => (
                          <li key={sub.slug}>
                            <Link
                              href={`/category/${tab.sectionSlug}/${sub.slug}`}
                              className="block px-3.5 py-2.5 text-xs font-mono font-bold uppercase text-geotrexx-black hover:bg-geotrexx-crimson hover:text-white no-underline transition-colors"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center shrink-0 pl-2">
          <button
            type="button"
            onClick={() => setSearchOpen((prev) => !prev)}
            aria-label="Search GEOTREXX Database"
            className="flex items-center gap-1.5 px-2.5 py-1.5 border border-geotrexx-black bg-white text-geotrexx-black hover:bg-geotrexx-crimson hover:text-white hover:border-geotrexx-crimson text-[11px] font-mono font-bold uppercase tracking-wider cursor-pointer transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </div>

      {searchOpen && (
        <form
          onSubmit={handleSearchSubmit}
          className="w-full py-2.5 border-t border-geotrexx-black flex items-center gap-2 bg-white"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, topics, authors, or keywords..."
            autoFocus
            className="flex-1 px-3 py-1.5 text-xs md:text-sm font-mono border border-geotrexx-black bg-white text-geotrexx-black focus:outline-none focus:border-geotrexx-crimson"
          />
          <button
            type="submit"
            className="px-4 py-1.5 bg-geotrexx-crimson text-white text-xs font-mono font-bold uppercase tracking-widest border border-geotrexx-crimson hover:bg-geotrexx-black cursor-pointer transition-colors"
          >
            Search
          </button>
        </form>
      )}
    </div>
  );
}
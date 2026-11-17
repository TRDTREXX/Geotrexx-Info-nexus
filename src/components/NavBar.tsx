'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navTabs = [
  { name: 'Top News', href: '/', subsections: [] },
  {
    name: 'Ghana',
    href: '/category/ghana',
    sectionSlug: 'ghana',
    subsections: [
      { name: 'National', slug: 'national' },
      { name: 'Crime & Justice', slug: 'crime-justice' },
      { name: 'Education', slug: 'education' },
      { name: 'Regions', slug: 'regions' },
    ],
  },
  {
    name: 'Politics',
    href: '/category/politics',
    sectionSlug: 'politics',
    subsections: [
      { name: 'Elections', slug: 'elections' },
      { name: 'Parliament', slug: 'parliament' },
      { name: 'Public Policy', slug: 'policy' },
      { name: 'Governance', slug: 'governance' },
    ],
  },
  {
    name: 'World',
    href: '/category/world',
    sectionSlug: 'world',
    subsections: [
      { name: 'Africa', slug: 'africa' },
      { name: 'Diaspora', slug: 'diaspora' },
      { name: 'Global Affairs', slug: 'global' },
    ],
  },
  {
    name: 'Business & Tech',
    href: '/category/business',
    sectionSlug: 'business',
    subsections: [
      { name: 'Economy & Markets', slug: 'economy' },
      { name: 'Tech & STEM', slug: 'stem' },
      { name: 'Corporate & Energy', slug: 'corporate' },
    ],
  },
  {
    name: 'TREXXfield',
    href: '/category/sports',
    sectionSlug: 'sports',
    subsections: [
      { name: 'European Football', slug: 'european-football' },
      { name: 'Black Stars & Africa', slug: 'african-football' },
      { name: 'Tactics & Transfers', slug: 'tactics' },
    ],
  },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="flex overflow-x-auto lg:overflow-visible hide-scrollbar py-0 bg-white">
      <ul className="flex space-x-6 md:space-x-8 text-xs md:text-sm font-extrabold uppercase tracking-wider text-geotrexx-black list-none m-0 p-0">
        {navTabs.map((tab) => {
          const isActive =
            tab.href === '/'
              ? pathname === '/'
              : pathname.startsWith(tab.href) ||
                (tab.sectionSlug === 'sports' && pathname.includes('/trexxfield'));

          return (
            <li key={tab.name} className="relative group">
              <Link
                href={tab.href}
                className={`block py-3.5 border-b-[3px] transition-colors whitespace-nowrap no-underline ${
                  isActive
                    ? 'border-geotrexx-crimson text-geotrexx-crimson font-black'
                    : 'border-transparent text-geotrexx-black hover:border-geotrexx-crimson hover:text-geotrexx-crimson'
                }`}
              >
                {tab.name}
              </Link>

              {/* Clean Dropdown Menu — No "SUBSECTIONS" Header Text */}
              {tab.subsections && tab.subsections.length > 0 && (
                <div className="hidden lg:group-hover:block absolute left-0 top-full w-52 bg-white border-2 border-geotrexx-black border-t-[3px] border-t-geotrexx-crimson z-50 shadow-lg">
                  <ul className="divide-y divide-gray-200 list-none m-0 p-0">
                    {tab.subsections.map((sub) => (
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
  );
}
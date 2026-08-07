import './globals.css'
import Script from 'next/script'
import Link from 'next/link'
import Image from 'next/image'
import ThemeToggle from '../components/ThemeToggle'

export const metadata = {
  title: 'GEOTREXX | The Global Information Nexus',
  description: 'Premium digital destination for global news, sports analytics, and deep editorial coverage.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth antialiased">
      <head>
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6716191654210557" crossOrigin="anonymous" strategy="afterInteractive" />
      </head>
      <body className="flex flex-col min-h-screen bg-[#f9fafb] dark:bg-[#0a0b10] text-gray-900 dark:text-white selection:bg-[#C8102E] selection:text-white transition-colors duration-300">
        
        {/* Top Utility Bar (Breaking News / Luxury touch) */}
        <div className="w-full bg-[#1a1b23] text-white py-1 px-4 text-xs font-medium tracking-wide flex justify-between items-center border-b border-[#C8102E]">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8102E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C8102E]"></span>
            </span>
            <span className="uppercase text-gray-300">Breaking: Global Markets React</span>
          </div>
          <div className="hidden md:flex gap-4 text-gray-400">
            <span className="hover:text-white cursor-pointer transition-colors">Sign In</span>
            <span className="hover:text-white cursor-pointer transition-colors">Subscribe</span>
          </div>
        </div>

        {/* Sticky Glassmorphic Header */}
        <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/85 dark:bg-[#0a0b10]/85 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-all">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="relative z-[60] flex items-center cursor-pointer group">
              {/* Ensure geotrexx-logo.png is in your public folder */}
              <div className="font-black text-3xl tracking-tighter uppercase flex items-center gap-1">
                GEO<span className="text-[#C8102E]">TREXX</span>
              </div>
            </Link>
            
            {/* Enterprise Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {['Politics', 'Business', 'Sports', 'Technology', 'Opinion'].map((item) => (
                <Link key={item} href={`/category/${item.toLowerCase()}`} className="text-sm font-bold uppercase tracking-wider text-gray-600 hover:text-[#C8102E] dark:text-gray-300 dark:hover:text-[#C8102E] transition-colors relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#C8102E] transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {/* Search Icon Placeholder */}
              <button aria-label="Search" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-grow w-full max-w-[1400px] mx-auto">
          {children}
        </main>

        <footer className="bg-[#0a0b10] text-white pt-16 pb-8 border-t-4 border-[#C8102E] mt-20">
          <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <h3 className="font-black text-2xl tracking-widest mb-4">GEO<span className="text-[#C8102E]">TREXX</span></h3>
              <p className="text-gray-400 text-sm max-w-md leading-relaxed">The premier destination for uncompromising journalism, elite sports analytics, and global market insights. Designed for the informed.</p>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-wider mb-4 text-[#C8102E]">Sections</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">World News</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Markets</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Tech</Link></li>
              </ul>
            </div>
          </div>
          <div className="max-w-[1400px] mx-auto px-6 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <p>© {new Date().getFullYear()} GEOTREXX Media Group. All Rights Reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="hover:text-white">Privacy Policy</Link>
              <Link href="#" className="hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
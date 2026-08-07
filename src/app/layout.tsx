import './globals.css'
import Script from 'next/script'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

export const metadata = {
  title: 'GEOTREXX | Info Nexus',
  description: 'Premium digital destination for global news, sports analytics, and deep editorial coverage.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6716191654210557"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="flex flex-col min-h-screen selection:bg-geo-red selection:text-white">
        
        {/* Sticky Glassmorphic Header */}
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-geo-dark/80 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-black text-2xl tracking-widest uppercase text-gray-900 dark:text-white group-hover:opacity-80 transition-opacity">
                GEO<span className="text-geo-red">TREXX</span>
              </span>
            </Link>
            
            <nav className="flex items-center gap-6">
              <Link href="/category/politics" className="text-sm font-bold uppercase hidden md:block hover:text-geo-red dark:text-gray-300 dark:hover:text-geo-red transition-colors">Politics</Link>
              <Link href="/category/sports" className="text-sm font-bold uppercase hidden md:block hover:text-geo-red dark:text-gray-300 dark:hover:text-geo-red transition-colors">Sports</Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>

        <main className="flex-grow w-full">
          {children}
        </main>

        <footer className="bg-geo-dark text-white py-12 border-t-4 border-geo-red">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h3 className="font-black text-xl mb-4 tracking-widest">GEO<span className="text-geo-red">TREXX</span></h3>
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} GEOTREXX Media Group. All Rights Reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
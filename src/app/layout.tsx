import './globals.css'
import Script from 'next/script'
import Link from 'next/link'
import SiteNavigation from '../components/SiteNavigation'

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
        
        {/* Elite Interactive Navigation System */}
        <SiteNavigation />

        <main className="flex-grow w-full max-w-[1400px] mx-auto">
          {children}
        </main>

        <footer className="bg-[#0a0b10] text-white pt-16 pb-8 border-t-4 border-[#C8102E] mt-20">
          <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <img src="/geotrexx-logo.png" alt="GEOTREXX" className="h-10 w-auto object-contain mb-4 grayscale brightness-200" />
              <p className="text-gray-400 text-sm max-w-md leading-relaxed">The premier destination for uncompromising journalism, elite sports analytics, and global market insights. Designed for the informed.</p>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-wider mb-4 text-[#C8102E]">Sections</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/category/world" className="hover:text-white transition-colors">World News</Link></li>
                <li><Link href="/category/business" className="hover:text-white transition-colors">Markets</Link></li>
                <li><Link href="/category/technology" className="hover:text-white transition-colors">Tech</Link></li>
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
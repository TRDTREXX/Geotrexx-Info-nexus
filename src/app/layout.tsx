import './globals.css'
import Script from 'next/script'
import Link from 'next/link'
import SiteNavigation from '../components/SiteNavigation'

export const metadata = {
  title: 'GEOTREXX | The Global Information Nexus',
  description: 'Premium digital destination for global news, sports analytics, and deep editorial coverage.',
}

export const revalidate = 0; 

const HYGRAPH_ENDPOINT = "https://eu-west-2.cdn.hygraph.com/content/cmrms81py00mq07w07a3zcs1e/master"

async function getDynamicTickerHeadlines() {
  // 🚀 Restored sorting to your custom 'publishedDate' field here too!
  const query = `
    query GetHeadlines {
      articles(orderBy: publishedDate_DESC, first: 5) {
        title
      }
    }
  `
  try {
    const res = await fetch(HYGRAPH_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      cache: 'no-store',
      next: { revalidate: 0 }
    })
    const json = await res.json()
    if (json.data?.articles && json.data.articles.length > 0) {
      const titles = json.data.articles.map((a: any) => a.title).join(' • ')
      return titles + ' • GEOTREXX brings you the truth first.'
    }
  } catch (error) {
    return null
  }
  return null
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const tickerText = await getDynamicTickerHeadlines() || "Global Markets see unprecedented shifts • Major political summit concludes in Accra • GEOTREXX brings you the truth first."

  return (
    <html lang="en" className="scroll-smooth antialiased">
      <head>
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6716191654210557" crossOrigin="anonymous" strategy="afterInteractive" />
      </head>
      <body className="flex flex-col min-h-screen bg-[#f9fafb] dark:bg-[#0a0b10] text-gray-900 dark:text-white selection:bg-[#C8102E] selection:text-white transition-colors duration-300">
        
        <SiteNavigation tickerText={tickerText} />

        <main className="flex-grow w-full max-w-[1400px] mx-auto">
          {children}
        </main>

        <footer className="bg-[#0a0b10] text-white pt-20 pb-10 border-t-4 border-[#C8102E] mt-20">
          <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <img src="/geotrexx-logo.png" alt="GEOTREXX" className="h-16 w-16 object-cover rounded-full bg-white p-1 shadow-lg" />
                <h3 className="font-black text-3xl tracking-widest">GEO<span className="text-[#C8102E]">TREXX</span></h3>
              </div>
              <p className="text-gray-400 text-sm max-w-md leading-relaxed mb-8">
                The premier destination for uncompromising journalism, elite sports analytics, and global market insights. Designed for the informed.
              </p>
              <div className="space-y-3 text-sm text-gray-400 mb-8 font-medium">
                <p className="flex items-center gap-3"><span className="text-[#C8102E]">📍</span> Accra, Greater Accra Region, Ghana</p>
                <p className="flex items-center gap-3"><span className="text-[#C8102E]">✉️</span> info@geotrexx.com</p>
                <p className="flex items-center gap-3"><span className="text-[#C8102E]">📞</span> +233 53 553 1860</p>
              </div>

              <div className="flex gap-4">
                <a href="https://www.facebook.com/Granite.WebGad" target="_blank" rel="noopener noreferrer" aria-label="Facebook Personal" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#C8102E] hover:text-white transition-colors text-gray-400">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                </a>
                <a href="https://www.facebook.com/Geotrexx1" target="_blank" rel="noopener noreferrer" aria-label="GEOTREXX Facebook Page" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#C8102E] hover:text-white transition-colors text-gray-400">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14-3.442 0-5.328 2.204-5.328 5.76V9.5H7v4h2.315v10.5h4.685V13.5z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider mb-6 text-[#C8102E]">Sections</h4>
              <ul className="space-y-3 text-gray-400 text-sm font-medium">
                <li><Link href="/category/world" className="hover:text-white hover:translate-x-1 transition-all inline-block">World News</Link></li>
                <li><Link href="/category/business" className="hover:text-white hover:translate-x-1 transition-all inline-block">Markets</Link></li>
                <li><Link href="/category/technology" className="hover:text-white hover:translate-x-1 transition-all inline-block">Tech</Link></li>
                {/* 🚀 Moved Network Founders here for high visibility! */}
                <li><Link href="/creator" className="hover:text-white hover:translate-x-1 transition-all inline-block font-bold text-gray-300">Network Founders</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider mb-6 text-[#C8102E]">Portal</h4>
              <ul className="space-y-3 text-gray-400 text-sm font-medium">
                <li>
                  <Link href="/search" className="hover:text-white transition-colors flex items-center gap-2 group">
                    <svg className="w-4 h-4 group-hover:text-[#C8102E] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> Search News
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors flex items-center gap-2 group">
                    <svg className="w-4 h-4 group-hover:text-[#C8102E] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg> Member Login
                  </Link>
                </li>
                <li>
                  <Link href="/subscribe" className="hover:text-white transition-colors flex items-center gap-2 group">
                    <svg className="w-4 h-4 group-hover:text-[#C8102E] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> Subscribe
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="max-w-[1400px] mx-auto px-6 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <p>Copyright © {new Date().getFullYear()} GEOTREXX Media Group. All Rights Reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
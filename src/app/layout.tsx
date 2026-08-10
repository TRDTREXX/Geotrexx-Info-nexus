import './globals.css'
import Script from 'next/script'
import Link from 'next/link'
import SiteNavigation from '../components/SiteNavigation'

export const metadata = {
  title: 'GEOTREXX | The Global Information Nexus',
  description: 'Premium digital destination for global news, sports analytics, and deep editorial coverage.',
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const HYGRAPH_ENDPOINT = "https://eu-west-2.cdn.hygraph.com/content/cmrms81py00mq07w07a3zcs1e/master"

const getSortTime = (article: any) => {
  let time = 0;
  if (article.publishedDate) {
    if (article.publishedDate.includes('/')) {
      const [d, m, y] = article.publishedDate.split('/');
      time = new Date(`${y}-${m}-${d}T12:00:00`).getTime();
    } else {
      time = new Date(article.publishedDate).getTime();
    }
  } else if (article.publishedAt) {
    time = new Date(article.publishedAt).getTime();
  }
  return isNaN(time) ? 0 : time;
}

async function getDynamicTickerHeadlines() {
  const query = `
    query GetHeadlines {
      articles(first: 20, orderBy: publishedAt_DESC) {
        title
        publishedDate
        publishedAt
      }
    }
  `
  try {
    const res = await fetch(HYGRAPH_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      cache: 'no-store'
    })
    const json = await res.json()
    
    if (json.data?.articles && json.data.articles.length > 0) {
      let articles = json.data.articles;
      articles.sort((a: any, b: any) => getSortTime(b) - getSortTime(a));
      
      const titles = articles.slice(0, 5).map((a: any) => a.title).join(' • ')
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
        {/* Google AdSense */}
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6716191654210557" crossOrigin="anonymous" strategy="afterInteractive" />
        
        {/* 🚀 Google Analytics - Load the tracking script */}
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-DR60BNWQE5" />
        
        {/* 🚀 Google Analytics - Initialize the tracker */}
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DR60BNWQE5');
          `}
        </Script>
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
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider mb-6 text-[#C8102E]">Sections</h4>
              <ul className="space-y-3 text-gray-400 text-sm font-medium mb-10">
                <li><Link href="/category/world" className="hover:text-white hover:translate-x-1 transition-all inline-block">World News</Link></li>
                <li><Link href="/category/business" className="hover:text-white hover:translate-x-1 transition-all inline-block">Markets</Link></li>
                <li><Link href="/category/technology" className="hover:text-white hover:translate-x-1 transition-all inline-block">Tech</Link></li>
              </ul>

              <h4 className="font-bold uppercase tracking-wider mb-6 text-[#C8102E]">About Us</h4>
              <ul className="space-y-3 text-gray-400 text-sm font-medium">
                <li>
                  <Link href="/creator" className="hover:text-[#C8102E] hover:translate-x-1 transition-all inline-flex items-center gap-2 font-bold text-white group">
                    <svg className="w-4 h-4 text-[#C8102E] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    Network Founders
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider mb-6 text-[#C8102E]">Portal</h4>
              <ul className="space-y-3 text-gray-400 text-sm font-medium">
                <li><Link href="/search" className="hover:text-white transition-colors">Search News</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Member Login</Link></li>
                <li><Link href="/subscribe" className="hover:text-white transition-colors">Subscribe</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="max-w-[1400px] mx-auto px-6 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <p>Copyright © {new Date().getFullYear()} GEOTREXX Media Group. All Rights Reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
import './globals.css'
import type { Metadata } from 'next'
import { Public_Sans, Merriweather, JetBrains_Mono } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle, LiveClock } from '@/components/ThemeToggle'
import NavBar from '@/components/NavBar'

const publicSans = Public_Sans({ 
  subsets: ['latin'],
  variable: '--font-public-sans',
  display: 'swap',
})

const merriweather = Merriweather({ 
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-merriweather',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'GEOTREXX | News, Policy & Global Analysis',
  description: 'The news belongs to the people. Straight facts across politics, business, tech, sports, history, and culture.',
}

const tickerItems = [
  "ACCRA: Electoral Commission finalizes biometric verification protocols ahead of national polls",
  "WEST AFRICA: ECOWAS finance ministers convene in Abuja over regional trade corridor tariffs",
  "MARKETS: Bank of Ghana Monetary Policy Committee holds benchmark rate steady amid inflation dip",
  "TECH: New fiber-optic submarine cable capacity goes live across Gulf of Guinea data centers",
  "SPORTS: European Champions League quarterfinal draw sets up heavyweight tactical clashes",
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${publicSans.variable} ${merriweather.variable} ${jetbrainsMono.variable} bg-white`}>
      <body className="font-sans bg-white text-geotrexx-black antialiased min-h-screen flex flex-col">
        
        {/* TOP UTILITY BAR WITH LIVE CLOCK, SOCIAL LOGOS & THEME TOGGLE */}
        <div className="w-full bg-geotrexx-black text-white text-[11px] font-mono border-b border-geotrexx-charcoal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="font-bold tracking-widest uppercase text-geotrexx-crimson flex items-center gap-1.5">
                <span className="w-2 h-2 bg-geotrexx-crimson inline-block animate-pulse" />
                LIVE UPDATES
              </span>
              <span className="text-geotrexx-grey">|</span>
              <LiveClock />
            </div>

            <div className="flex items-center gap-4">
              {/* Top Bar Quick Social Logos */}
              <div className="hidden sm:flex items-center gap-3.5 border-r border-geotrexx-charcoal pr-4">
                <a
                  href="https://whatsapp.com/channel/0029Vb8pufeI7BeGrtBtUU0c"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GEOTREXX WhatsApp Channel"
                  className="text-gray-300 hover:text-[#25D366] transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.125.556 4.119 1.529 5.853l-1.529 5.581 5.717-1.499c1.693.922 3.631 1.448 5.695 1.448 6.627 0 12-5.373 12-12s-5.373-12-12.412-11.383z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/Geotrexx1"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GEOTREXX Facebook"
                  className="text-gray-300 hover:text-[#1877F2] transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com/@geotrexx_field?si=XmM6VxcO6ce21yed"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TREXXfield YouTube"
                  className="text-gray-300 hover:text-[#FF0000] transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@nexus_news_"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Nexus News TikTok"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* MAIN HEADER WITH ROUNDED CONCENTRIC LOGO SEAL + DYNAMIC NAVBAR */}
        <header className="w-full bg-white border-b-2 border-geotrexx-black sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-6">
              
              <Link
                href="/"
                aria-label="GEOTREXX Home"
                className="group shrink-0 py-2 flex items-center gap-3 no-underline cursor-pointer"
              >
                <div className="relative w-11 h-11 rounded-full border-2 border-geotrexx-black p-0.5 bg-white flex items-center justify-center transition-colors group-hover:border-geotrexx-crimson">
                  <div className="relative w-full h-full rounded-full border border-geotrexx-crimson overflow-hidden bg-white flex items-center justify-center">
                    <Image
                      src="/geotrexx-logo.png"
                      alt="GEOTREXX Seal"
                      fill
                      className="object-cover rounded-full"
                      priority
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xl md:text-2xl font-black tracking-tighter uppercase text-geotrexx-black leading-none group-hover:text-geotrexx-crimson transition-colors">
                    GEOTREXX
                  </span>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-geotrexx-crimson leading-none mt-0.5">
                    THE NEWS BELONGS TO THE PEOPLE
                  </span>
                </div>
              </Link>

              <NavBar />

            </div>
          </div>

          {/* BREAKING NEWS TICKER */}
          <div className="w-full bg-white border-t border-geotrexx-black overflow-hidden flex items-center h-9">
            <div className="bg-geotrexx-crimson text-white text-[10px] font-black uppercase tracking-widest px-3 h-full flex items-center shrink-0 z-10">
              BREAKING
            </div>
            <div className="overflow-hidden whitespace-nowrap w-full relative bg-white">
              <div className="animate-ticker">
                {[...tickerItems, ...tickerItems].map((item, index) => (
                  <span key={index} className="inline-flex items-center text-xs font-bold text-geotrexx-black mx-8">
                    <span className="w-1.5 h-1.5 bg-geotrexx-crimson mr-3 inline-block" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT PORTAL */}
        <div className="flex-grow bg-white">
          {children}
        </div>

        {/* CLEAN FOOTER WITH VERIFIED SOCIAL MEDIA LINKS & LOGOS */}
        <footer className="w-full bg-geotrexx-black text-white pt-14 pb-10 mt-16 border-t-4 border-geotrexx-crimson">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-geotrexx-charcoal pb-8 mb-10 gap-4">
              <Link
                href="/"
                className="group flex items-center gap-3.5 no-underline cursor-pointer"
              >
                <div className="relative w-12 h-12 rounded-full border-2 border-geotrexx-crimson p-0.5 bg-white flex items-center justify-center">
                  <div className="relative w-full h-full rounded-full border border-geotrexx-black overflow-hidden bg-white">
                    <Image
                      src="/geotrexx-logo.png"
                      alt="GEOTREXX"
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-black tracking-tighter uppercase text-white group-hover:text-geotrexx-crimson transition-colors block leading-none">
                    GEOTREXX
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-geotrexx-crimson block mt-1">
                    ACCRA • GLOBAL DESK
                  </span>
                </div>
              </Link>
              <span className="text-xs font-mono uppercase tracking-widest text-geotrexx-grey">
                STRAIGHT FACTS FROM THE SOURCE • THE NEWS BELONGS TO THE PEOPLE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12 border-b border-geotrexx-charcoal pb-12">
              
              {/* Column 1: Core Desks */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-geotrexx-crimson mb-4">
                  News Desks
                </h4>
                <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider list-none p-0 m-0">
                  <li><Link href="/category/ghana" className="text-gray-300 hover:text-white no-underline">Ghana & National Affairs</Link></li>
                  <li><Link href="/category/politics" className="text-gray-300 hover:text-white no-underline">Politics & Elections</Link></li>
                  <li><Link href="/category/world" className="text-gray-300 hover:text-white no-underline">World, Africa & Diaspora</Link></li>
                  <li><Link href="/category/business" className="text-gray-300 hover:text-white no-underline">Business, Economy & Tech</Link></li>
                  <li><Link href="/category/sports" className="text-gray-300 hover:text-white no-underline">TREXXfield Sports</Link></li>
                </ul>
              </div>

              {/* Column 2: ONLY Meet the Founders & Advertise With Us */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-geotrexx-crimson mb-4">
                  Organization
                </h4>
                <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider list-none p-0 m-0">
                  <li><Link href="/founders" className="text-gray-300 hover:text-white no-underline">Meet the Founders</Link></li>
                  <li><Link href="/subscribe" className="text-gray-300 hover:text-white no-underline">Advertise With Us</Link></li>
                </ul>
              </div>

              {/* Column 3: Legal & Standards */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-geotrexx-crimson mb-4">
                  Policies & Legal
                </h4>
                <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider list-none p-0 m-0">
                  <li><Link href="/standards" className="text-gray-300 hover:text-white no-underline">Editorial Standards</Link></li>
                  <li><Link href="/privacy" className="text-gray-300 hover:text-white no-underline">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="text-gray-300 hover:text-white no-underline">Terms of Service</Link></li>
                </ul>
              </div>

              {/* Column 4: Social Media & Connect (With Official Logos) */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-geotrexx-crimson mb-4">
                  Connect & Follow
                </h4>
                <ul className="space-y-3 text-xs font-bold uppercase tracking-wider list-none p-0 m-0">
                  
                  {/* 1. WhatsApp Channel */}
                  <li>
                    <a
                      href="https://whatsapp.com/channel/0029Vb8pufeI7BeGrtBtUU0c"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 text-gray-300 hover:text-white no-underline transition-colors"
                    >
                      <span className="w-7 h-7 rounded-full bg-[#25D366] text-black flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.125.556 4.119 1.529 5.853l-1.529 5.581 5.717-1.499c1.693.922 3.631 1.448 5.695 1.448 6.627 0 12-5.373 12-12s-5.373-12-12.412-11.383z" />
                        </svg>
                      </span>
                      <span>WhatsApp Channel</span>
                    </a>
                  </li>

                  {/* 2. Facebook — GEOTREXX Main */}
                  <li>
                    <a
                      href="https://www.facebook.com/Geotrexx1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 text-gray-300 hover:text-white no-underline transition-colors"
                    >
                      <span className="w-7 h-7 rounded-full bg-[#1877F2] text-white flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                        </svg>
                      </span>
                      <span>Facebook (GEOTREXX)</span>
                    </a>
                  </li>

                  {/* 3. Facebook — Totally Barça / Sports Network */}
                  <li>
                    <a
                      href="https://www.facebook.com/Granite.WebGad"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 text-gray-300 hover:text-white no-underline transition-colors"
                    >
                      <span className="w-7 h-7 rounded-full bg-geotrexx-crimson text-white flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                        </svg>
                      </span>
                      <span>Facebook (Sports Desk)</span>
                    </a>
                  </li>

                  {/* 4. YouTube — @geotrexx_field */}
                  <li>
                    <a
                      href="https://youtube.com/@geotrexx_field?si=XmM6VxcO6ce21yed"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 text-gray-300 hover:text-white no-underline transition-colors"
                    >
                      <span className="w-7 h-7 rounded-full bg-[#FF0000] text-white flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      </span>
                      <span>YouTube (TREXXfield)</span>
                    </a>
                  </li>

                  {/* 5. TikTok — @nexus_news_ */}
                  <li>
                    <a
                      href="https://www.tiktok.com/@nexus_news_"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 text-gray-300 hover:text-white no-underline transition-colors"
                    >
                      <span className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                        </svg>
                      </span>
                      <span>TikTok (@nexus_news_)</span>
                    </a>
                  </li>

                </ul>
              </div>

            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-geotrexx-grey font-mono gap-4">
              <p>&copy; {new Date().getFullYear()} GEOTREXX. All rights reserved.</p>
            </div>
          </div>
        </footer>

      </body>
    </html>
  )
}
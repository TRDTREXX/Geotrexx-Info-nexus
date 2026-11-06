import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#f8f9fa] border-t-[4px] border-[#C8102E] pt-12 pb-6 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6 mb-12">
        
        {/* Column 1: Brand & Bio (Now using actual logo image) */}
        <div className="flex flex-col items-start">
          <Link href="/" className="mb-5 inline-block focus:outline-none">
            <img 
              src="/geotrexx-logo.png" 
              alt="GEOTREXX INFO NEXUS" 
              className="w-16 h-16 object-cover rounded-full shadow-sm border border-gray-200" 
            />
          </Link>
          
          <p className="text-gray-700 font-serif text-sm leading-relaxed mb-6">
            Unbiased, Accurate and Authoritative. GEOTREXX delivers premium journalism, breaking news, and in-depth analysis on politics, business, STEM, and global affairs.
          </p>
          
          <Link href="/founders" className="inline-block w-fit border border-gray-300 bg-white text-xs font-bold uppercase tracking-widest px-4 py-2 hover:bg-gray-100 transition-colors">
            Meet the Founders
          </Link>
        </div>

        {/* Column 2: Contact Desk */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-black border-b border-gray-200 pb-2 mb-4">Contact Desk</h4>
          <ul className="space-y-4 text-sm text-gray-700 font-serif">
            <li className="flex items-start gap-2">
              <span className="text-[#C8102E] mt-1.5 text-[10px]">●</span>
              <span>Ga East, Ashongman Estate<br/>Accra, Ghana</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#C8102E] text-[10px]">●</span>
              <a href="mailto:Swissagem11@gmail.com" className="hover:text-[#C8102E] transition-colors break-all">Swissagem11@gmail.com</a>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#C8102E] text-[10px]">●</span>
              <a href="tel:+233535531860" className="hover:text-[#C8102E] transition-colors">+233 53 553 1860</a>
            </li>
          </ul>
        </div>

        {/* Column 3: Connect (Inline SVGs used to bypass Lucide brand icon errors) */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-black border-b border-gray-200 pb-2 mb-4">Connect</h4>
          <ul className="space-y-4 text-sm text-gray-800 font-bold">
            <li>
              <a href="https://www.facebook.com/Geotrexx1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#C8102E] transition-colors">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-gray-500"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6c1.05 0 2.05.2 2.05.2v2.25h-1.16c-1.14 0-1.5.71-1.5 1.44V12h2.5l-.4 3h-2.1v6.8C18.56 20.87 22 16.84 22 12z"/></svg>
                GEOTREXX Facebook
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/Granite.WebGad" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#C8102E] transition-colors">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-gray-500"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6c1.05 0 2.05.2 2.05.2v2.25h-1.16c-1.14 0-1.5.71-1.5 1.44V12h2.5l-.4 3h-2.1v6.8C18.56 20.87 22 16.84 22 12z"/></svg>
                Granite WebGad
              </a>
            </li>
            <li>
              {/* Replace # with your actual X (Twitter) URL */}
              <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#C8102E] transition-colors">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-gray-500"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                X (Twitter)
              </a>
            </li>
            <li>
              <a href="https://www.tiktok.com/@nexus_news_?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#C8102E] transition-colors">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-gray-500"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.66-.46 3.32-1.46 4.67-1.19 1.6-3 2.65-4.99 2.87-2.02.23-4.14-.15-5.83-1.32-1.74-1.2-2.9-3.08-3.21-5.17-.32-2.13.06-4.33 1.25-6.1 1.18-1.76 3-2.93 5-3.32.18-.03.36-.06.54-.08V11.2c-.37.07-.75.14-1.11.27-1.35.49-2.5 1.55-3.02 2.88-.5 1.29-.44 2.83.2 4.07.61 1.2 1.72 2.14 3.03 2.47 1.34.33 2.82.08 3.93-.72 1.09-.79 1.79-2.04 1.9-3.37.06-.71.04-1.42.04-2.13V.02h3.64Z"/></svg>
                TikTok
              </a>
            </li>
            <li>
              <a href="https://whatsapp.com/channel/0029Vb8pufeI7BeGrtBtUU0c" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#C8102E] transition-colors">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-gray-500"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                WhatsApp Channel
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Governance & Trust */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-black border-b border-gray-200 pb-2 mb-4">Governance & Trust</h4>
          <ul className="space-y-3 text-sm text-gray-700 font-serif">
            <li><Link href="/editorial-guidelines" className="block py-1 hover:text-[#C8102E] transition-colors">Editorial Guidelines</Link></li>
            <li><Link href="/fact-checking" className="block py-1 hover:text-[#C8102E] transition-colors">Fact-Checking Policy</Link></li>
            <li><Link href="/privacy" className="block py-1 hover:text-[#C8102E] transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="block py-1 hover:text-[#C8102E] transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

      </div>
      
      {/* Copyright Bar */}
      <div className="border-t border-gray-200 pt-6 text-center">
        <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">
          © 2026 Geotrexx Media Group. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
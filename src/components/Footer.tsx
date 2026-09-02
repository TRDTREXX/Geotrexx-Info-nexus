import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#faf9f6] dark:bg-[#0a0b10] text-gray-800 dark:text-gray-300 border-t-4 border-[#C8102E] mt-16 pt-12 pb-6 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-gray-300 dark:border-gray-800 pb-10">
          
          {/* Brand & Founders */}
          <div className="space-y-6 lg:col-span-1">
            <Link href="/" className="inline-block group">
              <h2 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                GEO<span className="text-[#C8102E]">TREXX</span>
              </h2>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold block mt-1">Media Group</span>
            </Link>
            <p className="text-sm text-gray-700 dark:text-gray-400 font-serif leading-relaxed">
              Unbiased, Accurate and Authoritative. GEOTREXX delivers premium journalism, breaking news, and in-depth analysis on politics, business, STEM, and global affairs.
            </p>
            <Link href="/founders" className="inline-block border border-gray-400 dark:border-gray-600 text-gray-800 dark:text-gray-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-xs font-bold uppercase tracking-widest px-6 py-3 transition-colors">
              Meet The Founders
            </Link>
          </div>

          {/* Contact Desk */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-black dark:text-white uppercase tracking-widest font-mono border-b border-gray-300 dark:border-gray-800 pb-2">
              Contact Desk
            </h3>
            <ul className="space-y-4 text-sm text-gray-700 dark:text-gray-400 font-medium">
              <li className="flex items-start">
                <span className="text-[#C8102E] mr-3 font-bold">●</span>
                <span>Accra, Greater Accra Region<br/>Ghana</span>
              </li>
              <li className="flex items-center">
                <span className="text-[#C8102E] mr-3 font-bold">●</span>
                <a href="mailto:INFO@GEOTREXX.COM" className="hover:text-[#C8102E] transition-colors">INFO@GEOTREXX.COM</a>
              </li>
              <li className="flex items-center">
                <span className="text-[#C8102E] mr-3 font-bold">●</span>
                <a href="tel:0535531860" className="hover:text-[#C8102E] transition-colors">0535531860</a>
              </li>
            </ul>
          </div>

          {/* Connect (Social Links) */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-black dark:text-white uppercase tracking-widest font-mono border-b border-gray-300 dark:border-gray-800 pb-2">
              Connect
            </h3>
            <ul className="space-y-4 text-sm font-bold text-gray-700 dark:text-gray-400">
              <li>
                <a href="https://www.facebook.com/Geotrexx1" target="_blank" rel="noopener noreferrer" className="hover:text-[#C8102E] transition-colors flex items-center group">
                  <svg className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-[#C8102E] transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/Granite.WebGad" target="_blank" rel="noopener noreferrer" className="hover:text-[#C8102E] transition-colors flex items-center group">
                  <svg className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-[#C8102E] transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Granite WebGad
                </a>
              </li>
              <li>
                <a href="https://x.com/trexx84" target="_blank" rel="noopener noreferrer" className="hover:text-[#C8102E] transition-colors flex items-center group">
                  <svg className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-[#C8102E] transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.007 4.15H5.028z"/></svg>
                  X (Twitter)
                </a>
              </li>
              <li>
                <a href="https://whatsapp.com/channel/0029Vb8pufeI7BeGrtBtUU0c" target="_blank" rel="noopener noreferrer" className="hover:text-[#C8102E] transition-colors flex items-center group">
                  <svg className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-[#C8102E] transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.383 0 0 5.383 0 12.031c0 2.128.552 4.148 1.536 5.952L.15 23.85l6.027-1.579A11.96 11.96 0 0 0 12.031 24c6.648 0 12.031-5.383 12.031-12.031S18.679 0 12.031 0zm3.855 17.181c-.165.465-.96 1.02-1.545 1.155-.585.135-1.29.3-3.6-1.125-2.79-1.725-4.575-4.59-4.71-4.77-.135-.18-1.125-1.485-1.125-2.835 0-1.35.705-2.01 1.005-2.31.255-.255.6-.33.885-.33.285 0 .57 0 .84.015.27.015.63-.09 1.005.81.405.975 1.11 2.715 1.2 2.91.09.195.18.435.03.69-.15.255-.225.42-.45.675-.225.255-.48.555-.675.765-.225.225-.465.48-.21.915.255.435 1.14 1.89 2.46 3.075 1.71 1.53 3.12 2.01 3.555 2.22.435.21.69.18 1.005-.135.315-.315 1.23-1.425 1.56-1.905.33-.48.66-.405 1.125-.225.465.18 2.88 1.35 3.375 1.59.495.24.81.36.93.57.12.21.12 1.215-.045 1.68z"/></svg>
                  WhatsApp Channel
                </a>
              </li>
            </ul>
          </div>

          {/* Governance & Trust (AdSense Compliance) */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-black dark:text-white uppercase tracking-widest font-mono border-b border-gray-300 dark:border-gray-800 pb-2">
              Governance & Trust
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-400">
              <li><Link href="/standards" className="hover:text-[#C8102E] transition-colors">Editorial Guidelines</Link></li>
              <li><Link href="/standards" className="hover:text-[#C8102E] transition-colors">Fact-Checking Policy</Link></li>
              <li><Link href="/privacy" className="hover:text-[#C8102E] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#C8102E] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        {/* Legal & Compliance */}
        <div className="mt-6 text-center text-xs font-mono text-gray-500 dark:text-gray-400">
          <p>© {currentYear} Geotrexx Media Group. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
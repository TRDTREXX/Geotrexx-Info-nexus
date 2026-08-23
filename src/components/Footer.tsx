import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 dark:bg-[#0a0b10] border-t border-gray-200 dark:border-gray-800 py-12 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white group">
            GEO<span className="text-[#C8102E]">TREXX</span>
          </Link>
          <p className="text-sm text-gray-500 mt-2 font-medium">© {new Date().getFullYear()} GEOTREXX MEDIA GROUP. All rights reserved.</p>
        </div>

        <div className="flex items-center space-x-6 text-xs font-bold tracking-widest text-gray-500 uppercase">
          <Link href="/privacy" className="hover:text-[#C8102E] transition-colors cursor-pointer">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-[#C8102E] transition-colors cursor-pointer">
            Terms & Conditions
          </Link>
        </div>

      </div>
    </footer>
  );
}
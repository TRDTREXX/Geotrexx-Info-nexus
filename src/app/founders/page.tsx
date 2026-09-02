import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Network Founders | GEOTREXX',
  description: 'Meet Orpheus Grant-Essilfie and Quist Ebenezer Assan, the editorial team and founders behind GEOTREXX Media Group. Discover our commitment to fast, accurate, and unbiased digital journalism.',
};

export default function FoundersPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 bg-[#faf9f6] text-[#121826] min-h-screen font-sans">
      <header className="border-b-2 border-gray-900 pb-6 mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C8102E] font-mono">GEOTREXX Media Group</span>
        <h1 className="text-4xl md:text-5xl font-black text-black mt-2 uppercase tracking-tighter" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
          Network Founders
        </h1>
      </header>
      
      <div className="space-y-12">
        
        {/* Editor in Chief */}
        <div className="bg-white p-8 rounded-sm border border-gray-300 shadow-sm flex flex-col md:flex-row gap-8 items-start relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#C8102E]"></div>
          <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-full overflow-hidden border-2 border-gray-300">
            <Image src="/orpheus.png" alt="Orpheus Grant-Essilfie" fill className="object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Newsreader, Georgia, serif' }}>
              Orpheus Grant-Essilfie
            </h2>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 font-mono">
              Co-Founder & Editor-in-Chief
            </h3>
            <p className="text-gray-700 font-serif leading-relaxed">
              Orpheus is a student at the University of Ghana who brings sharp analytical rigor to digital journalism, overseeing the platform's editorial direction. He specializes in political analysis, structural governance, and data-driven sports reporting, ensuring authoritative coverage across all major categories.
            </p>
          </div>
        </div>

        {/* Managing Editor */}
        <div className="bg-white p-8 rounded-sm border border-gray-300 shadow-sm flex flex-col md:flex-row gap-8 items-start relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#C8102E]"></div>
          <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-full overflow-hidden border-2 border-gray-300">
            <Image src="/quist.png" alt="Quist Ebenezer Assan" fill className="object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Newsreader, Georgia, serif' }}>
              Quist Ebenezer Assan
            </h2>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 font-mono">
              Co-Founder & Managing Editor
            </h3>
            <p className="text-gray-700 font-serif leading-relaxed">
              With a strong foundation in digital media operations and content strategy, Quist drives the day-to-day editorial workflow. He is dedicated to maintaining the desk's standard for fast, accurate, and unbiased reporting.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
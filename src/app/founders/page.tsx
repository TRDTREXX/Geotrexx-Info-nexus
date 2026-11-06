import Head from 'next/head';
import Image from 'next/image';

export default function FoundersPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4 md:px-8 text-[#121826]">
      <div className="max-w-5xl mx-auto bg-white p-8 md:p-16 shadow-sm border border-gray-200">
        
        {/* Header Section */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
            Meet The Founders
          </h1>
          <div className="w-16 h-1 bg-[#C8102E] mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-gray-700 font-serif leading-relaxed max-w-2xl mx-auto">
            GEOTREXX Media Group is led by a dedicated team committed to unbiased, accurate, and authoritative journalism across Ghana and the globe.
          </p>
        </header>
        
        {/* Founders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Founder 1: Quist Ebenezer Assan */}
          <div className="flex flex-col items-center p-8 border border-gray-100 shadow-sm bg-gray-50">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-200 rounded-full mb-6 border-4 border-white shadow-sm overflow-hidden relative">
              {/* Ensure quist.png is in your public folder, or remove the Image tag if missing */}
              <Image src="/quist.png" alt="Quist Ebenezer Assan" fill className="object-cover" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center" style={{ fontFamily: 'Newsreader, Georgia, serif' }}>
              Quist Ebenezer Assan
            </h2>
            <h3 className="text-xs font-black uppercase tracking-widest text-[#C8102E] mb-4 text-center">
              Co-Founder & Managing Editor
            </h3>
            <p className="text-sm text-gray-600 font-serif text-center leading-relaxed">
              With a strong foundation in digital media operations and content strategy, Quist drives the core editorial vision and digital execution at GEOTREXX.
            </p>
          </div>

          {/* Founder 2: Orpheus Grant-Essilfie */}
          <div className="flex flex-col items-center p-8 border border-gray-100 shadow-sm bg-gray-50">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-200 rounded-full mb-6 border-4 border-white shadow-sm overflow-hidden relative">
              {/* Ensure orpheus.png is in your public folder, or remove the Image tag if missing */}
              <Image src="/orpheus.png" alt="Orpheus Grant-Essilfie" fill className="object-cover" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center" style={{ fontFamily: 'Newsreader, Georgia, serif' }}>
              Orpheus Grant-Essilfie
            </h2>
            <h3 className="text-xs font-black uppercase tracking-widest text-[#C8102E] mb-4 text-center">
              Editor in Chief
            </h3>
            <p className="text-sm text-gray-600 font-serif text-center leading-relaxed">
              An experienced journalist specializing in investigative reporting and political analysis. Orpheus ensures the accuracy and integrity of every breaking story.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
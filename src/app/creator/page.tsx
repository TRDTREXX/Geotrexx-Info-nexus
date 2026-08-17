import SmartImage from '../../components/SmartImage';export default function FoundersPage() {
return (

    <div className="text-center mb-16">
      <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">Meet The Founders</h1>
      <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        The visionary leaders behind GEOTREXX Media Group, committed to delivering unbiased, accurate, and authoritative journalism to Ghana and the world.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      
      {/* Orpheus */}
      <div className="bg-white dark:bg-[#1a1b23] rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center transition-colors">
        <div className="w-48 h-48 rounded-full border-4 border-red-600 overflow-hidden mb-6 shadow-xl bg-gray-100 dark:bg-gray-800">
          <SmartImage src="/orpheus.jpg" alt="Orpheus Grant-Essilfie" className="w-full h-full object-cover" />
        </div>
        <span className="text-red-600 font-bold tracking-widest uppercase text-xs mb-2">Editor in Chief & Co-Founder</span>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Orpheus Grant-Essilfie</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Leading the editorial vision and structural integrity of GEOTREXX. Orpheus ensures that every story meets the highest standard of modern journalism.
        </p>
      </div>

      {/* Quist */}
      <div className="bg-white dark:bg-[#1a1b23] rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center transition-colors">
        <div className="w-48 h-48 rounded-full border-4 border-red-600 overflow-hidden mb-6 shadow-xl bg-gray-100 dark:bg-gray-800">
          <SmartImage src="/quist.jpg" alt="Quist Ebenezer Assan" className="w-full h-full object-cover" />
        </div>
        <span className="text-red-600 font-bold tracking-widest uppercase text-xs mb-2">Co-Founder & Editor</span>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Quist Ebenezer Assan</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          A driving force behind the platform's creation and news gathering operations. Quist brings rigorous fact-checking and dynamic storytelling to the forefront.
        </p>
      </div>

    </div>
  </div>
</main>
);
}
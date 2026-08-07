import SmartImage from '../../components/SmartImage'

export const metadata = {
  title: 'Founders | GEOTREXX',
}

export default function CreatorPage() {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6">Network Founders</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">The architects behind the global information nexus.</p>
      </div>

      <div className="flex flex-col gap-12 max-w-5xl mx-auto">
        
        {/* Orpheus Profile */}
        <div className="bg-white dark:bg-[#1a1b23] rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row">
          <div className="md:w-2/5 bg-gray-200 dark:bg-gray-800">
            <SmartImage 
              baseName="orpheus" 
              altName="Orpheus Grant-Essilfie" 
              className="w-full h-96 md:h-full object-cover object-top"
            />
          </div>
          <div className="md:w-3/5 p-10 md:p-14 flex flex-col justify-center">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Orpheus Grant-Essilfie</h2>
            <p className="text-[#C8102E] font-bold uppercase tracking-widest text-sm mb-6">Co-Founder & Lead Publisher</p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              Orpheus drives the editorial and technical vision of the GEOTREXX network. Blending elite front-end architecture with hard-hitting global coverage, Orpheus established GEOTREXX to deliver uncompromising information directly to the informed.
            </p>
          </div>
        </div>

        {/* Quist Profile */}
        <div className="bg-white dark:bg-[#1a1b23] rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row-reverse">
          <div className="md:w-2/5 bg-gray-200 dark:bg-gray-800">
            <SmartImage 
              baseName="quist" 
              altName="Quist Ebenezer Assan" 
              className="w-full h-96 md:h-full object-cover object-top"
            />
          </div>
          <div className="md:w-3/5 p-10 md:p-14 flex flex-col justify-center">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Quist Ebenezer Assan</h2>
            <p className="text-[#C8102E] font-bold uppercase tracking-widest text-sm mb-6">Co-Founder</p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              Quist co-engineers the strategic direction of GEOTREXX. Working alongside Orpheus, Quist ensures the platform maintains its rigorous standards in both technological deployment and global narrative structuring.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
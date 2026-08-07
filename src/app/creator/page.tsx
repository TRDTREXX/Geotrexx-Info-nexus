import Image from 'next/image'

export const metadata = {
  title: 'Our Creators | GEOTREXX',
}

export default function CreatorPage() {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6">Our Creators</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">The minds engineering the global information nexus. Combining rigorous journalism with elite digital architecture.</p>
      </div>

      {/* Primary Creator Profile */}
      <div className="max-w-5xl mx-auto bg-white dark:bg-[#1a1b23] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row">
        
        {/* Creator Image Area */}
        <div className="md:w-2/5 bg-gray-200 dark:bg-gray-800 relative h-96 md:h-auto">
          {/* Replace this placeholder with your actual picture URL from Hygraph or public folder */}
          <Image 
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80" 
            alt="Orpheus Grant-Essilfie" 
            fill 
            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6">
            <span className="bg-[#C8102E] text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-sm shadow-md">
              Lead Architect & Publisher
            </span>
          </div>
        </div>

        {/* Creator Bio Area */}
        <div className="md:w-3/5 p-10 md:p-14 flex flex-col justify-center">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Orpheus Grant-Essilfie</h2>
          <p className="text-[#C8102E] font-bold uppercase tracking-widest text-sm mb-6">GEOTREXX Network Founder</p>
          
          <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
            <p>
              Orpheus Grant-Essilfie drives the editorial and technical vision of the GEOTREXX network. Blending elite front-end architecture with hard-hitting global coverage, Orpheus established GEOTREXX to deliver uncompromising information directly to the informed.
            </p>
            <p>
              Based in Accra, Ghana, his work spans advanced sports statistical analysis, cutting-edge digital platform deployment, and overseeing real-time breaking news delivery.
            </p>
          </div>

          <div className="flex gap-4">
            <a href="https://www.facebook.com/Granite.WebGad" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold bg-gray-100 dark:bg-[#0a0b10] px-4 py-2 rounded-lg hover:text-[#C8102E] transition-colors border border-gray-200 dark:border-gray-800">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              Follow
            </a>
            <a href="https://whatsapp.com/channel/0029Vb8pufeI7BeGrtBtUU0c" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold bg-gray-100 dark:bg-[#0a0b10] px-4 py-2 rounded-lg hover:text-[#C8102E] transition-colors border border-gray-200 dark:border-gray-800">
               <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Channel
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}
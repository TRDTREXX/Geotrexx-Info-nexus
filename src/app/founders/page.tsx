import Link from 'next/link';

export const metadata = {
  title: 'Network Founders | GEOTREXX',
  description: 'The architects behind the global information nexus.',
}

export default function CreatorPage() {
  return (
    <div className="w-full bg-white dark:bg-[#0a0b10] mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[70vh]">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6">
          Network Founders
        </h1>
        <div className="w-24 h-2 bg-[#C8102E] mx-auto mb-8"></div>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          The architects behind the global information nexus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        
        {/* Orpheus Profile */}
        <div className="flex flex-col items-center text-center bg-gray-50 dark:bg-[#1a1b23] p-10 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
          <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg mb-6 border-4 border-gray-200 dark:border-gray-800 bg-gray-200">
             <img src="/orpheus.png.JPG" alt="Orpheus Grant-Essilfie" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider mb-2">
            Orpheus Grant-Essilfie
          </h2>
          <p className="text-[#C8102E] font-bold text-sm tracking-widest uppercase mb-6">
            Co-Founder & Editor-in-Chief
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium text-left">
            Like many massive tech platforms that started in a dorm room, GEOTREXX is the shared birthchild of two students with a big vision. Co-founder Orpheus built the site alongside his long-time friend, Quist. Orpheus drives the editorial direction and technical architecture. He writes with sharp detail on global markets, political science, and high-level sports analytics. But he doesn't just report the news. Orpheus also builds the backend, providing powerful content management solutions to help other brands grow. He perfectly balances his life as a student with running a fast-paced media group, turning a young startup idea into reality.
          </p>
        </div>

        {/* Quist Profile */}
        <div className="flex flex-col items-center text-center bg-gray-50 dark:bg-[#1a1b23] p-10 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
          <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg mb-6 border-4 border-gray-200 dark:border-gray-800 bg-gray-200">
             <img src="/quist.png.jpeg" alt="Quist Ebenezer Assan" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider mb-2">
            Quist Ebenezer Assan
          </h2>
          <p className="text-[#C8102E] font-bold text-sm tracking-widest uppercase mb-6">
            Co-Founder & Lead Editor
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium text-left">
            Every great startup needs a voice that truly understands the internet. For GEOTREXX, that voice is Co-Founder Quist Ebenezer Assan. He shares this ambitious birthchild with his long-time friend, Orpheus. As a student and an active social media influencer, Quist knows exactly how to grab an audience's attention. He spearheads the platform's digital strategy and real-time news reporting across technology, entertainment, and global events. Because of his background as an influencer, Quist also plays a vital role in the content management solutions they offer partners. He brings relentless accuracy to the team, proving that young students can build the future of digital media.
          </p>
        </div>

      </div>
      
      <div className="mt-20 text-center">
         <Link href="/" className="inline-block bg-[#C8102E] text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-red-800 transition-colors shadow-md">
           Return Home
         </Link>
      </div>
    </div>
  )
}
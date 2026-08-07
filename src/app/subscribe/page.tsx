import Link from 'next/link'

export const metadata = {
  title: 'Subscribe | GEOTREXX',
}

export default function SubscribePage() {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6">Join The Elite</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Unrestricted access to world-class journalism, deep sports analytics, and global market insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        
        {/* Basic Tier */}
        <div className="bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow flex flex-col">
          <h3 className="text-2xl font-black uppercase tracking-widest text-gray-900 dark:text-white mb-2">Digital Access</h3>
          <p className="text-gray-500 mb-6">Perfect for staying informed daily.</p>
          <div className="text-4xl font-black text-[#C8102E] mb-6">Free<span className="text-lg text-gray-500 font-medium"> / month</span></div>
          <ul className="space-y-4 mb-8 flex-grow text-gray-600 dark:text-gray-300">
            <li className="flex items-center gap-3"><svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Read up to 5 premium articles/month</li>
            <li className="flex items-center gap-3"><svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Daily News Briefing newsletter</li>
          </ul>
          <button className="w-full py-4 rounded-lg font-bold uppercase tracking-widest border-2 border-[#C8102E] text-[#C8102E] hover:bg-[#C8102E] hover:text-white transition-colors">Create Free Account</button>
        </div>

        {/* Premium Tier */}
        <div className="bg-[#0a0b10] border border-[#C8102E] rounded-2xl p-8 shadow-2xl relative flex flex-col transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#C8102E] text-white text-xs font-black uppercase tracking-widest py-1 px-4 rounded-full">Most Popular</div>
          <h3 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Enterprise Pro</h3>
          <p className="text-gray-400 mb-6">Unlimited intelligence. Zero restrictions.</p>
          <div className="text-4xl font-black text-white mb-6">$15<span className="text-lg text-gray-400 font-medium"> / month</span></div>
          <ul className="space-y-4 mb-8 flex-grow text-gray-300">
            <li className="flex items-center gap-3"><svg className="w-5 h-5 text-[#C8102E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Unlimited access to all articles</li>
            <li className="flex items-center gap-3"><svg className="w-5 h-5 text-[#C8102E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Advanced sports analytics dashboard</li>
            <li className="flex items-center gap-3"><svg className="w-5 h-5 text-[#C8102E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Ad-free reading experience</li>
            <li className="flex items-center gap-3"><svg className="w-5 h-5 text-[#C8102E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Early access to exclusive reports</li>
          </ul>
          <button className="w-full py-4 rounded-lg font-bold uppercase tracking-widest bg-[#C8102E] text-white hover:bg-red-800 transition-colors shadow-lg shadow-red-900/50">Subscribe Now</button>
        </div>

      </div>
    </div>
  )
}
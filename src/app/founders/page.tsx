import { Metadata } from 'next';

// Hardcoded Static SEO
export const metadata: Metadata = {
  title: 'Network Founders | GEOTREXX',
  description: 'Meet Orpheus Grant-Essilfie and Quist Ebenezer Assan, the editorial team and founders behind GEOTREXX Media Group. Discover our commitment to fast, accurate, and unbiased digital journalism.',
};

export default function FoundersPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-300">
      <h1 className="text-4xl md:text-5xl font-black mb-2 text-black dark:text-white uppercase tracking-tighter">
        Network Founders
      </h1>
      <p className="text-sm text-[#C8102E] font-bold tracking-widest uppercase mb-12">
        GEOTREXX Media Group
      </p>
      
      <div className="space-y-8">
        
        {/* Editor in Chief */}
        <div className="bg-gray-50 dark:bg-[#1a1b23] p-8 rounded-xl border-l-4 border-[#C8102E]">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-1">
            Orpheus Grant-Essilfie
          </h2>
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">
            Co-Founder & Editor-in-Chief
          </h3>
          <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
            Orpheus brings sharp analytical rigor to digital journalism, overseeing the platform's editorial direction. He specializes in political analysis, structural governance, and data-driven sports reporting, ensuring authoritative coverage across all major categories.
          </p>
        </div>

        {/* Managing Editor */}
        <div className="bg-gray-50 dark:bg-[#1a1b23] p-8 rounded-xl border-l-4 border-[#C8102E]">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-1">
            Quist Ebenezer Assan
          </h2>
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">
            Co-Founder & Managing Editor
          </h3>
          <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
            With a strong foundation in digital media operations and content strategy, Quist drives the day-to-day editorial workflow. He is dedicated to maintaining the desk's standard for fast, accurate, and unbiased reporting.
          </p>
        </div>

      </div>
    </div>
  );
}
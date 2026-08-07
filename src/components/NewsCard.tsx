import Image from 'next/image'
import Link from 'next/link'

interface NewsCardProps {
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  date: string;
}

export default function NewsCard({ title, slug, excerpt, imageUrl, category, date }: NewsCardProps) {
  return (
    <Link href={`/news/${slug}`} className="group flex flex-col bg-white dark:bg-[#1a1b23] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800">
      {/* Image Container with Hover Zoom */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
        <Image 
          src={imageUrl} 
          alt={title}
          fill
          className="object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-[#C8102E] text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-sm shadow-md">
          {category}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight mb-3 group-hover:text-[#C8102E] transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 flex-grow">
          {excerpt}
        </p>
        
        {/* Read More Link */}
        <div className="mt-auto flex items-center text-sm font-bold text-[#C8102E] uppercase tracking-wide group-hover:translate-x-1 transition-transform">
          Read Story 
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </div>
      </div>
    </Link>
  )
}
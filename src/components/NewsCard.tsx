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
    <Link href={`/news/${slug}`} className="group flex flex-col bg-white border-b border-gray-200 md:border md:rounded-sm overflow-hidden shadow-none md:shadow-sm md:hover:shadow-lg transition-all duration-300 md:border-gray-200 pb-5 md:pb-0 mb-5 md:mb-0">
      
      {/* Image Container with Floating Category Pill */}
      <div className="relative h-56 md:h-48 w-full overflow-hidden bg-gray-100">
        <Image 
          src={imageUrl} 
          alt={title} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <span className="absolute top-3 left-3 bg-[#C8102E] text-white text-[10px] md:text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-sm z-10 shadow-sm">
          {category}
        </span>
      </div>

      {/* Content Container */}
      <div className="pt-4 md:p-5 flex flex-col flex-grow">
        <div className="flex justify-end mb-2">
          <span className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider font-mono">
            {date}
          </span>
        </div>
        
        <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2 group-hover:text-[#C8102E] transition-colors line-clamp-3 leading-snug" style={{ fontFamily: 'Oswald, sans-serif' }}>
          {title}
        </h3>
        
        <p className="text-gray-700 text-sm md:text-base line-clamp-2 md:line-clamp-3 leading-relaxed flex-grow font-serif" style={{ fontFamily: 'Newsreader, Georgia, serif' }}>
          {excerpt}
        </p>
      </div>
    </Link>
  )
}
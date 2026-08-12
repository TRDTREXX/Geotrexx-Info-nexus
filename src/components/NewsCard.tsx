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
    <Link href={`/news/${slug}`} className="group flex flex-col bg-white dark:bg-[#1a1b23] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800">
      <div className="relative h-48 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
        <Image 
          src={imageUrl} 
          alt={title} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[#C8102E] text-[10px] font-black uppercase tracking-widest">
            {category}
          </span>
          <span className="text-gray-400 text-xs font-medium">
            {date}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[#C8102E] transition-colors line-clamp-2 leading-snug">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed flex-grow">
          {excerpt}
        </p>
      </div>
    </Link>
  )
}
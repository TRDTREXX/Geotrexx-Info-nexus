import { client } from '../sanity/lib/client';
import { urlFor } from '../sanity/lib/image';
import Link from 'next/link';
import Image from 'next/image';

// 🔥 Kills the cache so category tags and new articles update instantly
export const dynamic = 'force-dynamic';

// Fetches the top 5 articles for the Hero and Trending Sidebar
const query = `*[_type == "article"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  category,
  "subsection": coalesce(subGhana, subPolitics, subSports, subStem, subEntertainment, subWorld, subOpinion, subBusiness),
  mainImage
}[0...5]`;

export default async function HomePage() {
  const articles = await client.fetch(query, {}, { cache: 'no-store' });

  if (!articles || articles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center">
        <h1 className="text-3xl font-black text-black dark:text-white uppercase">No Articles Published</h1>
      </div>
    );
  }

  // Article 0 is the massive hero image. Articles 1-4 are the Trending sidebar.
  const featuredArticle = articles[0];
  const trendingArticles = articles.slice(1);

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
      
      {/* --- TOP GRID: HERO & TRENDING --- */}
      <div className="flex flex-col lg:flex-row gap-6 mb-16">
        
        {/* LEFT: MAIN FEATURED ARTICLE (Restored overlay design) */}
        {featuredArticle && (
          <Link href={`/news/${featuredArticle.slug}`} className="relative w-full lg:w-2/3 aspect-[4/3] lg:aspect-auto lg:h-[550px] rounded-2xl overflow-hidden group">
            {featuredArticle.mainImage && (
              <Image
                src={urlFor(featuredArticle.mainImage).url()}
                alt={featuredArticle.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            )}
            
            {/* Dark Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            
            {/* Text Content positioned at bottom left */}
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-5/6">
              <div className="bg-[#C8102E] text-white text-[11px] font-black uppercase tracking-widest px-3 py-1 mb-4 inline-block rounded-sm">
                {featuredArticle.category ? featuredArticle.category.replace('-', ' ') : 'NEWS'}
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                {featuredArticle.title}
              </h2>
            </div>
          </Link>
        )}

        {/* RIGHT: TRENDING NOW SIDEBAR */}
        {trendingArticles.length > 0 && (
          <div className="w-full lg:w-1/3 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 flex flex-col">
            
            {/* Sidebar Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
              <div className="w-2.5 h-2.5 rounded-full bg-[#C8102E] animate-pulse"></div>
              <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-widest">
                Trending Now
              </h3>
            </div>

            {/* Sidebar Article List */}
            <div className="flex flex-col gap-6">
              {trendingArticles.map((article: any, index: number) => (
                <div key={article._id} className={`${index !== trendingArticles.length - 1 ? 'border-b border-gray-200 dark:border-gray-800 pb-6' : ''}`}>
                  <Link href={`/news/${article.slug}`} className="group flex flex-col gap-2">
                    <span className="text-[10px] font-black text-[#C8102E] uppercase tracking-widest">
                      {article.category ? article.category.replace('-', ' ') : 'NEWS'}
                    </span>
                    <h4 className="text-base font-bold text-black dark:text-white leading-snug group-hover:text-[#C8102E] transition-colors">
                      {article.title}
                    </h4>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
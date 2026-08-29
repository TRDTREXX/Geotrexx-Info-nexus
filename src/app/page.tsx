import { client } from '../sanity/lib/client';
import { urlFor } from '../sanity/lib/image';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

const query = `*[_type == "article"] | order(publishedAt desc) {
  _id,
  title,
  summary,
  "slug": slug.current,
  publishedAt,
  category,
  mainImage
}[0...50]`;

const CategoryBlock = ({ title, articles }: { title: string, articles: any[] }) => {
  if (!articles || articles.length === 0) return null;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b-[3px] border-gray-200 dark:border-gray-800 pb-2 mb-2">
        <div className="w-3.5 h-3.5 bg-[#C8102E]"></div>
        <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter">
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {articles.map((article: any) => (
          <Link href={`/news/${article.slug}`} key={article._id} className="group flex flex-col gap-3">
             {article.mainImage && (
               <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image src={urlFor(article.mainImage).url()} alt={article.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
               </div>
             )}
             <h4 className="text-sm font-bold text-black dark:text-white leading-snug group-hover:text-[#C8102E] transition-colors line-clamp-3">
                {article.title}
             </h4>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default async function HomePage() {
  const articles = await client.fetch(query, {}, { cache: 'no-store' });

  if (!articles || articles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center">
        <h1 className="text-3xl font-black text-black dark:text-white uppercase">No Articles Published</h1>
      </div>
    );
  }

  const featuredArticle = articles[0];
  const trendingArticles = articles.slice(1, 5);
  
  // Category Grids
  const ghanaArticles = articles.filter((a: any) => a.category === 'ghana').slice(0, 4);
  const politicsArticles = articles.filter((a: any) => a.category === 'politics').slice(0, 4);
  const businessArticles = articles.filter((a: any) => a.category === 'business').slice(0, 4);
  const sportsArticles = articles.filter((a: any) => a.category === 'sports').slice(0, 4);

  // The Wall of News: Grab the next 16 articles that aren't in the Hero or Trending
  const moreLatestArticles = articles.slice(5, 21);

  return (
    <div>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        
        {/* TOP GRID: HERO & TRENDING */}
        <div className="flex flex-col lg:flex-row gap-6 mb-16">
          
          {/* HERO ARTICLE */}
          {featuredArticle && (
            <Link href={`/news/${featuredArticle.slug}`} className="relative w-full lg:w-2/3 aspect-[4/3] lg:aspect-[16/9] rounded-xl overflow-hidden group shadow-sm">
              {featuredArticle.mainImage && (
                <Image src={urlFor(featuredArticle.mainImage).url()} alt={featuredArticle.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-5/6">
                <div className="bg-[#C8102E] text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 mb-4 inline-block rounded-sm">
                  {featuredArticle.category ? featuredArticle.category.toUpperCase() : 'NEWS'}
                </div>
                <h2 className="text-3xl md:text-5xl lg:text-[54px] font-black text-white leading-tight tracking-tighter drop-shadow-md">
                  {featuredArticle.title}
                </h2>
              </div>
            </Link>
          )}

          {/* TRENDING NOW SIDEBAR */}
          {trendingArticles.length > 0 && (
            <div className="w-full lg:w-1/3 bg-white dark:bg-[#121212] border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm p-6 md:p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="w-2 h-2 rounded-full bg-[#C8102E] animate-pulse"></div>
                <h3 className="text-xs font-black text-black dark:text-white uppercase tracking-widest">
                  Trending Now
                </h3>
              </div>
              <div className="flex flex-col gap-6">
                {trendingArticles.map((article: any, index: number) => (
                  <div key={article._id} className={`${index !== trendingArticles.length - 1 ? 'border-b border-gray-100 dark:border-gray-800 pb-6' : ''}`}>
                    <Link href={`/news/${article.slug}`} className="group flex flex-col gap-2">
                      <span className="text-[10px] font-black text-[#C8102E] uppercase tracking-widest">
                        {article.category ? article.category.toUpperCase() : 'NEWS'}
                      </span>
                      <h4 className="text-sm md:text-base font-bold text-black dark:text-white leading-snug group-hover:text-[#C8102E] transition-colors">
                        {article.title}
                      </h4>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CATEGORY GRIDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
          <CategoryBlock title="GHANA" articles={ghanaArticles} />
          <CategoryBlock title="POLITICS" articles={politicsArticles} />
          <CategoryBlock title="BUSINESS" articles={businessArticles} />
          <CategoryBlock title="SPORTS" articles={sportsArticles} />
        </div>

        {/* --- MORE LATEST STORIES WALL --- */}
        {moreLatestArticles.length > 0 && (
          <div className="mt-20 pt-12 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-3 h-3 bg-black dark:bg-white"></div>
              <h3 className="text-2xl md:text-3xl font-black text-black dark:text-white uppercase tracking-tighter">
                More Latest Stories
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {moreLatestArticles.map((article: any) => (
                <Link href={`/news/${article.slug}`} key={article._id} className="group flex flex-col gap-3">
                  {article.mainImage && (
                    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <div className="absolute top-3 left-3 z-10 bg-[#C8102E] text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm shadow-sm">
                        {article.category || 'NEWS'}
                      </div>
                      <Image 
                        src={urlFor(article.mainImage).url()} 
                        alt={article.title} 
                        fill 
                        className="object-cover transition-transform duration-300 group-hover:scale-105" 
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                      {new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
                    <h4 className="text-base font-bold text-black dark:text-white leading-snug group-hover:text-[#C8102E] transition-colors line-clamp-3">
                      {article.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
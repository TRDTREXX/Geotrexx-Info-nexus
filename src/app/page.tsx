import { client } from '../sanity/lib/client';
import { urlFor } from '../sanity/lib/image';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60;

// THE FIX: Using coalesce and dereferencing (->) to resolve the empty category bug
const query = `*[_type == "article"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  "category": coalesce(category->slug.current, category),
  mainImage
}[0...100]`;

const CategoryBlock = ({ title, articles }: { title: string, articles: any[] }) => {
  if (!articles || articles.length === 0) return null;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b-[3px] border-gray-900 pb-2 mb-2">
        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {articles.map((article: any) => (
          <Link href={`/news/${article.slug}`} key={article._id} className="group flex flex-col gap-3">
             {article.mainImage && (
               <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden bg-gray-100 border border-gray-300">
                  <Image src={urlFor(article.mainImage).url()} alt={article.title || 'Thumbnail'} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
               </div>
             )}
             <h4 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-[#C8102E] transition-colors line-clamp-3" style={{ fontFamily: 'Newsreader, Georgia, serif' }}>
                {article.title}
             </h4>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default async function HomePage() {
  const articles = await client.fetch(query, {}, { next: { tags: ['articles', 'homepage'] } });

  if (!articles || articles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center bg-white">
        <h1 className="text-3xl font-black text-gray-900 uppercase">No Articles Published</h1>
      </div>
    );
  }

  const featuredArticle = articles[0];
  const trendingArticles = articles.slice(1, 5);
  
  // Safely matching categories (ignoring case) to populate the grid
  const getCategoryArticles = (catName: string) => 
    articles.filter((a: any) => (a.category || '').toLowerCase() === catName).slice(0, 4);

  const ghanaArticles = getCategoryArticles('ghana');
  const politicsArticles = getCategoryArticles('politics');
  const businessArticles = getCategoryArticles('business');
  const sportsArticles = getCategoryArticles('sports');
  const worldArticles = getCategoryArticles('world');
  const stemArticles = getCategoryArticles('stem');
  const entertainmentArticles = getCategoryArticles('entertainment');
  const opinionArticles = getCategoryArticles('opinion');

  const moreLatestArticles = articles.slice(5, 21);

  return (
    // STRICT GUIDANCE: Pure bright white background (bg-white) applied here
    <div className="bg-white text-[#121826] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        
        {/* TOP GRID: HERO & TRENDING */}
        <div className="flex flex-col lg:flex-row gap-6 mb-16 border-b-2 border-gray-900 pb-10">
          
          {/* HERO ARTICLE */}
          {featuredArticle && (
            <Link href={`/news/${featuredArticle.slug}`} className="relative w-full lg:w-2/3 aspect-[4/3] lg:aspect-[16/9] rounded-sm overflow-hidden group shadow-sm border border-gray-300">
              {featuredArticle.mainImage && (
                <Image src={urlFor(featuredArticle.mainImage).url()} alt={featuredArticle.title || 'Hero'} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#121826]/90 via-[#121826]/20 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-5/6">
                <div className="bg-[#C8102E] text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 mb-4 inline-block rounded-sm">
                  {featuredArticle.category ? featuredArticle.category.toUpperCase() : 'NEWS'}
                </div>
                <h2 className="text-3xl md:text-5xl lg:text-[54px] font-black text-white leading-tight tracking-tighter drop-shadow-md" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  {featuredArticle.title}
                </h2>
              </div>
            </Link>
          )}

          {/* TRENDING NOW SIDEBAR */}
          {trendingArticles.length > 0 && (
            <div className="w-full lg:w-1/3 bg-white border border-gray-300 rounded-sm p-6 md:p-8 flex flex-col shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-2 h-2 rounded-full bg-[#C8102E] animate-pulse"></div>
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">
                  Trending Now
                </h3>
              </div>
              <div className="flex flex-col gap-6">
                {trendingArticles.map((article: any, index: number) => (
                  <div key={article._id} className={`${index !== trendingArticles.length - 1 ? 'border-b border-gray-100 pb-6' : ''}`}>
                    <Link href={`/news/${article.slug}`} className="group flex flex-col gap-2">
                      <span className="text-[10px] font-black text-[#C8102E] uppercase tracking-widest">
                        {article.category ? article.category.toUpperCase() : 'NEWS'}
                      </span>
                      <h4 className="text-sm md:text-base font-bold text-gray-900 leading-snug group-hover:text-[#C8102E] transition-colors" style={{ fontFamily: 'Newsreader, Georgia, serif' }}>
                        {article.title}
                      </h4>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ALL CATEGORY GRIDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
          <CategoryBlock title="GHANA" articles={ghanaArticles} />
          <CategoryBlock title="WORLD" articles={worldArticles} />
          <CategoryBlock title="POLITICS" articles={politicsArticles} />
          <CategoryBlock title="BUSINESS" articles={businessArticles} />
          <CategoryBlock title="SPORTS" articles={sportsArticles} />
          <CategoryBlock title="STEM" articles={stemArticles} />
          <CategoryBlock title="ENTERTAINMENT" articles={entertainmentArticles} />
          <CategoryBlock title="OPINION" articles={opinionArticles} />
        </div>

        {/* MORE LATEST STORIES WALL */}
        {moreLatestArticles.length > 0 && (
          <div className="mt-20 pt-12 border-t-[3px] border-double border-gray-900">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-3 h-3 bg-gray-900"></div>
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                More Latest Dispatches
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {moreLatestArticles.map((article: any) => (
                <Link href={`/news/${article.slug}`} key={article._id} className="group flex flex-col gap-3">
                  {article.mainImage && (
                    <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden bg-gray-100 border border-gray-300 shadow-sm">
                      <div className="absolute top-3 left-3 z-10 bg-[#C8102E] text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm shadow-sm">
                        {article.category || 'NEWS'}
                      </div>
                      <Image 
                        src={urlFor(article.mainImage).url()} 
                        alt={article.title || 'Thumbnail'} 
                        fill 
                        className="object-cover transition-transform duration-300 group-hover:scale-105" 
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="text-base font-bold text-gray-900 leading-snug group-hover:text-[#C8102E] transition-colors line-clamp-3" style={{ fontFamily: 'Newsreader, Georgia, serif' }}>
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
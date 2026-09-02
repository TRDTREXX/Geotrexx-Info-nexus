import { client } from '../sanity/lib/client';
import { urlFor } from '../sanity/lib/image';
import Link from 'next/link';
import Image from 'next/image';

// Utilizes Incremental Static Regeneration (ISR) to keep the homepage fresh without breaking the server
export const revalidate = 60;

const query = `*[_type == "article"] | order(publishedAt desc) {
  _id,
  title,
  summary,
  "slug": slug.current,
  publishedAt,
  "categoryName": category->title,
  mainImage,
  "authorName": author->name
}[0...50]`;

const CategoryBlock = ({ title, articles }: { title: string, articles: any[] }) => {
  if (!articles || articles.length === 0) return null;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b-2 border-gray-900 pb-2 mb-2">
        <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {articles.map((article: any) => (
          <Link href={`/news/${article.slug}`} key={article._id} className="group flex flex-col gap-3">
             {article.mainImage && (
               <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden bg-gray-100 border border-gray-300">
                  <Image src={urlFor(article.mainImage).url()} alt={article.title || 'Thumbnail'} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
               </div>
             )}
             <h4 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-[#0b2545] transition-colors line-clamp-3" style={{ fontFamily: 'Newsreader, Georgia, serif' }}>
                {article.title}
             </h4>
             <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
               {article.authorName || 'Desk'} • {new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
             </div>
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
      <div className="max-w-7xl mx-auto px-6 py-32 text-center bg-[#faf9f6]">
        <h1 className="text-3xl font-black text-gray-900 uppercase">No Articles Published</h1>
      </div>
    );
  }

  const featuredArticle = articles[0];
  const trendingArticles = articles.slice(1, 5);
  
  // Normalized category filtering based on the dereferenced GROQ query
  const ghanaArticles = articles.filter((a: any) => a.categoryName?.toLowerCase() === 'ghana').slice(0, 4);
  const politicsArticles = articles.filter((a: any) => a.categoryName?.toLowerCase() === 'politics').slice(0, 4);
  const businessArticles = articles.filter((a: any) => a.categoryName?.toLowerCase() === 'business').slice(0, 4);
  const sportsArticles = articles.filter((a: any) => a.categoryName?.toLowerCase() === 'sports').slice(0, 4);
  const worldArticles = articles.filter((a: any) => a.categoryName?.toLowerCase() === 'world').slice(0, 4);
  const stemArticles = articles.filter((a: any) => a.categoryName?.toLowerCase() === 'stem').slice(0, 4);
  const entertainmentArticles = articles.filter((a: any) => a.categoryName?.toLowerCase() === 'entertainment').slice(0, 4);

  const moreLatestArticles = articles.slice(5, 21);

  return (
    <div className="bg-[#faf9f6] text-[#121826] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        
        {/* TOP GRID: HERO & TRENDING */}
        <div className="flex flex-col lg:flex-row gap-6 mb-16 border-b-2 border-gray-900 pb-10">
          
          {/* HERO ARTICLE */}
          {featuredArticle && (
            <Link href={`/news/${featuredArticle.slug}`} className="relative w-full lg:w-2/3 aspect-[4/3] lg:aspect-[16/9] rounded-sm overflow-hidden group shadow-sm border border-gray-300">
              {featuredArticle.mainImage && (
                <Image src={urlFor(featuredArticle.mainImage).url()} alt={featuredArticle.title || 'Hero'} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" priority />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#121826]/95 via-[#121826]/30 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-5/6">
                <div className="bg-[#8b0000] text-white text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 mb-4 inline-block rounded-sm">
                  {featuredArticle.categoryName ? featuredArticle.categoryName.toUpperCase() : 'SPECIAL DISPATCH'}
                </div>
                <h2 className="text-3xl md:text-5xl lg:text-[54px] font-black text-white leading-tight drop-shadow-md" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  {featuredArticle.title}
                </h2>
                <div className="mt-4 text-[11px] font-mono text-gray-300 uppercase tracking-widest">
                  By {featuredArticle.authorName || 'GEOTREXX Desk'}
                </div>
              </div>
            </Link>
          )}

          {/* TRENDING NOW SIDEBAR */}
          {trendingArticles.length > 0 && (
            <div className="w-full lg:w-1/3 bg-white border border-gray-300 rounded-sm p-6 md:p-8 flex flex-col shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-gray-900">
                <h3 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-widest">
                  Trending Intelligence
                </h3>
                <div className="w-2 h-2 rounded-full bg-[#8b0000] animate-pulse"></div>
              </div>
              <div className="flex flex-col gap-6">
                {trendingArticles.map((article: any, index: number) => (
                  <div key={article._id} className={`${index !== trendingArticles.length - 1 ? 'border-b border-gray-200 pb-6' : ''}`}>
                    <Link href={`/news/${article.slug}`} className="group flex flex-col gap-2">
                      <span className="text-[10px] font-mono font-bold text-[#8b0000] uppercase tracking-widest">
                        {article.categoryName ? article.categoryName.toUpperCase() : 'NEWS'}
                      </span>
                      <h4 className="text-sm md:text-base font-bold text-gray-900 leading-snug group-hover:text-[#0b2545] transition-colors" style={{ fontFamily: 'Newsreader, Georgia, serif' }}>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10">
          <CategoryBlock title="GHANA" articles={ghanaArticles} />
          <CategoryBlock title="POLITICS" articles={politicsArticles} />
          <CategoryBlock title="BUSINESS" articles={businessArticles} />
          <CategoryBlock title="WORLD" articles={worldArticles} />
          <CategoryBlock title="SPORTS" articles={sportsArticles} />
          <CategoryBlock title="STEM & INNOVATION" articles={stemArticles} />
          <CategoryBlock title="ENTERTAINMENT" articles={entertainmentArticles} />
        </div>

        {/* MORE LATEST STORIES WALL */}
        {moreLatestArticles.length > 0 && (
          <div className="mt-20 pt-12 border-t-[3px] border-double border-gray-900">
            <div className="flex items-center gap-3 mb-10">
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-widest" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                Dispatches by Sector
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {moreLatestArticles.map((article: any) => (
                <Link href={`/news/${article.slug}`} key={article._id} className="group flex flex-col gap-3">
                  {article.mainImage && (
                    <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden bg-gray-100 border border-gray-300 shadow-sm">
                      <div className="absolute top-3 left-3 z-10 bg-[#8b0000] text-white text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-1 rounded-sm shadow-sm">
                        {article.categoryName || 'NEWS'}
                      </div>
                      <Image 
                        src={urlFor(article.mainImage).url()} 
                        alt={article.title || 'Thumbnail'} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" 
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="text-base font-bold text-gray-900 leading-snug group-hover:text-[#0b2545] transition-colors line-clamp-3" style={{ fontFamily: 'Newsreader, Georgia, serif' }}>
                      {article.title}
                    </h4>
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-2 border-t border-gray-200 pt-2">
                      {article.authorName || 'Desk'} • {new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
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
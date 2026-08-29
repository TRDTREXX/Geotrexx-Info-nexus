import { client } from '../sanity/lib/client';
import { urlFor } from '../sanity/lib/image';
import Link from 'next/link';
import Image from 'next/image';

// 🔥 Kills the homepage cache so the latest articles and correct tags show up instantly
export const dynamic = 'force-dynamic';

// The updated query fetching the top 10 most recent articles
const query = `*[_type == "article"] | order(publishedAt desc) {
  _id,
  title,
  summary,
  "slug": slug.current,
  publishedAt,
  category,
  "subsection": coalesce(subGhana, subPolitics, subSports, subStem, subEntertainment, subWorld, subOpinion, subBusiness),
  mainImage
}[0...10]`;

export default async function HomePage() {
  // Fetch data, strictly bypassing the cache
  const articles = await client.fetch(query, {}, { cache: 'no-store' });

  if (!articles || articles.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-32 text-center">
        <h1 className="text-3xl font-black text-black dark:text-white uppercase">No Articles Published</h1>
      </div>
    );
  }

  // Separate the newest article to feature it at the top, and put the rest in a grid
  const featuredArticle = articles[0];
  const gridArticles = articles.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      
      {/* --- FEATURED HERO ARTICLE --- */}
      {featuredArticle && (
        <section className="mb-16">
          <Link href={`/news/${featuredArticle.slug}`} className="group flex flex-col md:flex-row gap-8 items-center">
            {featuredArticle.mainImage && (
              <div className="relative w-full md:w-2/3 aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                {/* THE RED CATEGORY TAG */}
                <div className="absolute top-6 left-6 z-10 bg-[#C8102E] text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-md">
                  {featuredArticle.category ? featuredArticle.category.replace('-', ' ') : 'NEWS'}
                </div>
                <Image
                  src={urlFor(featuredArticle.mainImage).url()}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </div>
            )}
            <div className="w-full md:w-1/3 flex flex-col justify-center">
              <p className="text-sm font-bold text-[#C8102E] uppercase tracking-widest mb-3">
                {new Date(featuredArticle.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <h2 className="text-3xl md:text-5xl font-black text-black dark:text-white group-hover:text-[#C8102E] transition-colors leading-tight mb-4 tracking-tighter">
                {featuredArticle.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg line-clamp-4 leading-relaxed">
                {featuredArticle.summary}
              </p>
            </div>
          </Link>
        </section>
      )}

      {/* --- LATEST NEWS GRID --- */}
      {gridArticles.length > 0 && (
        <section>
          <div className="mb-8 border-b-4 border-black dark:border-white pb-2 inline-block">
            <h3 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter">
              Latest from the Desk
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {gridArticles.map((article: any) => (
              <Link href={`/news/${article.slug}`} key={article._id} className="group flex flex-col gap-4">
                {article.mainImage && (
                  <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {/* THE RED CATEGORY TAG */}
                    <div className="absolute top-4 left-4 z-10 bg-[#C8102E] text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-sm shadow-sm">
                      {article.category ? article.category.replace('-', ' ') : 'NEWS'}
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
                  <p className="text-xs font-bold text-[#C8102E] uppercase tracking-widest mb-2">
                    {new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <h2 className="text-xl font-bold text-black dark:text-white group-hover:text-[#C8102E] transition-colors line-clamp-3 leading-snug">
                    {article.title}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      
    </div>
  );
}
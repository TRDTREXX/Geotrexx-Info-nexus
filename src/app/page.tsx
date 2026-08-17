import { createClient } from '@sanity/client';
import Link from 'next/link';
import SmartImage from '../components/SmartImage';

const client = createClient({
  projectId: 'x0tpoga9',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-03-01',
});

export const revalidate = 10;

const CATEGORY_MATRIX = {
  SPORTS: ['sport', 'football', 'soccer', 'xavi', 'barcelona', 'madrid', 'chelsea', 'arsenal', 'coach', 'stadium', 'match', 'tournament', 'fifa', 'uefa', 'nba', 'basketball', 'tennis', 'transfer', 'premier league', 'black stars', 'la liga', 'athletics'],
  POLITICS: ['politic', 'minister', 'president', 'election', 'government', 'npp', 'ndc', 'parliament', 'mps', 'vote', 'policy', 'campaign', 'mahama', 'bawumia', 'akufo-addo', 'diplomat'],
  BUSINESS: ['business', 'econom', 'market', 'bank', 'finance', 'cedi', 'dollar', 'inflation', 'trade', 'investment', 'imf', 'debt', 'revenue', 'tax', 'corporate', 'industry'],
  STEM: ['stem', 'science', 'tech', 'ai', 'artificial intelligence', 'innovation', 'engineering', 'math', 'software', 'app', 'digital', 'cyber', 'robot', 'space', 'elon', 'musk', 'tesla', 'spacex', 'trillionaire'],
  ENTERTAINMENT: ['entertain', 'music', 'movie', 'film', 'celebrity', 'actor', 'actress', 'singer', 'concert', 'album', 'award', 'hollywood', 'lifestyle', 'artist', 'mrbeast', 'mr beast', 'youtube', 'married', 'marriage', 'wedding']
};

function determineCategory(article: any) {
  if (article.legacyCategory) {
    const exactCat = article.legacyCategory.toLowerCase().trim();
    if (['sports', 'politics', 'business', 'stem', 'entertainment', 'world'].includes(exactCat)) {
      return exactCat.toUpperCase();
    }
  }

  const textToScan = `${article.legacyCategory || ''} ${article.category || ''} ${article.title || ''} ${article.summary || ''}`.toLowerCase();

  for (const [categoryName, keywords] of Object.entries(CATEGORY_MATRIX)) {
    if (keywords.some(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      return regex.test(textToScan);
    })) {
      return categoryName;
    }
  }

  return 'GHANA';
}

export default async function HomePage() {
  const articles = await client.fetch(`
    *[_type == "article"] | order(publishedAt desc)[0...100] {
      _id,
      title,
      summary,
      "slug": slug.current,
      "imageUrl": mainImage.asset->url,
      legacyCategory,
      category,
      publishedAt
    }
  `);

  if (!articles || articles.length === 0) {
    return <div className="text-center py-32 text-gray-900 dark:text-white font-black tracking-widest uppercase text-xl">Loading GEOTREXX Data...</div>;
  }

  const mappedArticles = articles.map((article: any) => ({
    ...article,
    mappedCategory: determineCategory(article)
  }));

  const topStory = mappedArticles[0];
  const trendingNow = mappedArticles.slice(1, 5);
  
  const ghanaNews = mappedArticles.filter((a: any) => a.mappedCategory === 'GHANA').slice(0, 4);
  const politicsNews = mappedArticles.filter((a: any) => a.mappedCategory === 'POLITICS').slice(0, 4);
  const businessNews = mappedArticles.filter((a: any) => a.mappedCategory === 'BUSINESS').slice(0, 4);
  const sportsNews = mappedArticles.filter((a: any) => a.mappedCategory === 'SPORTS').slice(0, 4);
  const stemNews = mappedArticles.filter((a: any) => a.mappedCategory === 'STEM').slice(0, 4);

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center mb-8 border-b-2 border-gray-900 dark:border-white pb-2">
      <div className="w-3 h-3 bg-[#C8102E] mr-3"></div>
      <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{title}</h2>
    </div>
  );

  return (
    <main className="w-full bg-white dark:bg-[#0a0b10] min-h-screen pb-20 transition-colors">
      
      {topStory && (
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8 mb-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <Link href={`/news/${topStory.slug}`} className="group relative block w-full h-[500px] overflow-hidden bg-gray-100 dark:bg-[#1a1b23] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
                {topStory.imageUrl && <img src={topStory.imageUrl} alt={topStory.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:w-5/6">
                  <span className="inline-block bg-[#C8102E] text-white font-black uppercase tracking-[0.2em] text-[10px] px-3 py-1 mb-4 shadow-md">
                    {topStory.mappedCategory}
                  </span>
                  <h1 className="text-3xl md:text-5xl font-black text-white leading-[1.1] mb-4 group-hover:text-gray-200 transition-colors">
                    {topStory.title}
                  </h1>
                </div>
              </Link>
            </div>

            <div className="lg:w-1/3 flex flex-col bg-gray-50 dark:bg-[#1a1b23] p-6 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
              <div className="flex items-center mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
                <div className="w-2 h-2 bg-[#C8102E] rounded-full mr-3 animate-pulse"></div>
                <h2 className="text-gray-900 dark:text-white text-sm font-black uppercase tracking-[0.2em]">Trending Now</h2>
              </div>
              <div className="flex flex-col space-y-6">
                {trendingNow.map((article: any) => (
                  <Link href={`/news/${article.slug}`} key={article._id} className="group flex flex-col border-b border-gray-200 dark:border-gray-800 pb-6 last:border-0 last:pb-0">
                    <span className="text-[#C8102E] text-[10px] font-black uppercase tracking-widest mb-2">{article.mappedCategory}</span>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug group-hover:text-[#C8102E] transition-colors">{article.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          
          <div>
            <SectionHeader title="Ghana"/>
            <div className="flex flex-col space-y-8">
              {ghanaNews.length > 0 ? ghanaNews.map((article: any) => (
                <Link href={`/news/${article.slug}`} key={article._id} className="group flex gap-6 border-b border-gray-200 dark:border-gray-800 pb-8 last:border-0">
                  <div className="w-1/3 aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-[#1a1b23] flex-shrink-0 rounded-lg border border-gray-200 dark:border-gray-800">
                    {article.imageUrl && <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
                  </div>
                  <div className="w-2/3 flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug mb-2 group-hover:text-[#C8102E] transition-colors line-clamp-3">{article.title}</h3>
                  </div>
                </Link>
              )) : <p className="text-gray-500 font-bold text-sm uppercase">Gathering Intel...</p>}
            </div>
          </div>

          <div>
            <SectionHeader title="Politics"/>
            <div className="flex flex-col space-y-8">
              {politicsNews.length > 0 ? politicsNews.map((article: any) => (
                <Link href={`/news/${article.slug}`} key={article._id} className="group flex gap-6 border-b border-gray-200 dark:border-gray-800 pb-8 last:border-0">
                  <div className="w-1/3 aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-[#1a1b23] flex-shrink-0 rounded-lg border border-gray-200 dark:border-gray-800">
                    {article.imageUrl && <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
                  </div>
                  <div className="w-2/3 flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug mb-2 group-hover:text-[#C8102E] transition-colors line-clamp-3">{article.title}</h3>
                  </div>
                </Link>
              )) : <p className="text-gray-500 font-bold text-sm uppercase">Gathering Intel...</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 bg-gray-50 dark:bg-[#1a1b23] p-8 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6 border-b-2 border-[#C8102E] pb-2">Business</h2>
            <div className="flex flex-col space-y-6">
              {businessNews.length > 0 ? businessNews.map((article: any) => (
                <Link href={`/news/${article.slug}`} key={article._id} className="group block border-b border-gray-200 dark:border-gray-800 pb-6 last:border-0 last:pb-0">
                  <h3 className="text-md font-bold text-gray-900 dark:text-white leading-snug group-hover:text-[#C8102E] transition-colors line-clamp-3">{article.title}</h3>
                </Link>
              )) : <p className="text-gray-500 font-bold text-xs uppercase">No business news</p>}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6 border-b-2 border-[#C8102E] pb-2">Sports</h2>
            <div className="flex flex-col space-y-6">
              {sportsNews.length > 0 ? sportsNews.map((article: any) => (
                <Link href={`/news/${article.slug}`} key={article._id} className="group block border-b border-gray-200 dark:border-gray-800 pb-6 last:border-0 last:pb-0">
                  <h3 className="text-md font-bold text-gray-900 dark:text-white leading-snug group-hover:text-[#C8102E] transition-colors line-clamp-3">{article.title}</h3>
                </Link>
              )) : <p className="text-gray-500 font-bold text-xs uppercase">No sports news</p>}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6 border-b-2 border-[#C8102E] pb-2">STEM</h2>
            <div className="flex flex-col space-y-6">
              {stemNews.length > 0 ? stemNews.map((article: any) => (
                <Link href={`/news/${article.slug}`} key={article._id} className="group block border-b border-gray-200 dark:border-gray-800 pb-6 last:border-0 last:pb-0">
                  <h3 className="text-md font-bold text-gray-900 dark:text-white leading-snug group-hover:text-[#C8102E] transition-colors line-clamp-3">{article.title}</h3>
                </Link>
              )) : <p className="text-gray-500 font-bold text-xs uppercase">No STEM news</p>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
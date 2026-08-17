import { createClient } from '@sanity/client';
import Link from 'next/link';

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

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const cleanCategory = slug.replace(/-/g, ' ').toUpperCase();

  const allArticles = await client.fetch(`
    *[_type == "article"] | order(publishedAt desc)[0...200] {
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

  const articles = allArticles.filter((article: any) => determineCategory(article) === cleanCategory);

  return (
    <main className="w-full bg-white dark:bg-[#0a0b10] min-h-screen py-16 transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="mb-12 border-b-2 border-gray-900 dark:border-white pb-4 inline-block">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
            {cleanCategory}
          </h1>
        </div>

        {(!articles || articles.length === 0) ? (
          <p className="text-gray-500 font-bold uppercase tracking-widest text-lg py-20">Gathering Intel for {cleanCategory}...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: any) => (
              <Link href={`/news/${article.slug}`} key={article._id} className="group flex flex-col bg-gray-50 dark:bg-[#1a1b23] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800">
                <div className="w-full h-56 bg-gray-200 dark:bg-gray-800 overflow-hidden relative">
                  {article.imageUrl && <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                  <div className="absolute top-4 left-4 bg-[#C8102E] text-white text-[10px] font-black uppercase px-3 py-1 shadow-sm">
                    {cleanCategory}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white leading-snug mb-3 group-hover:text-[#C8102E] transition-colors line-clamp-3">{article.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mt-auto">{article.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
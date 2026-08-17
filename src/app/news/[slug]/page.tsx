import { createClient } from '@sanity/client';
import { notFound } from 'next/navigation';

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

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const article = await client.fetch(`
    *[_type == "article" && slug.current == $slug][0]{
      title,
      publishedAt,
      "imageUrl": mainImage.asset->url,
      legacyCategory,
      category,
      content,
      "authorNameRef": author->name,
      "authorImageRef": author->image.asset->url,
      authorName,
      author
    }
  `, { slug: slug });

  if (!article) return notFound();

  const mappedCategory = determineCategory(article);
  
  const finalAuthor = article.authorNameRef || article.authorName || article.author || 'Orpheus Grant-Essilfie';
  
  let finalAuthorImage = article.authorImageRef;
  if (!finalAuthorImage) {
    if (finalAuthor.includes('Orpheus')) finalAuthorImage = '/orpheus.png.JPG';
    else if (finalAuthor.includes('Quist')) finalAuthorImage = '/quist.png.jpeg';
  }

  const date = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <article>
        <header className="mb-10 text-center">
          <div className="text-sm font-black text-[#C8102E] uppercase tracking-widest mb-4">
            {mappedCategory}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-800 overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
               {finalAuthorImage ? (
                 <img src={finalAuthorImage} alt={finalAuthor} className="w-full h-full object-cover" />
               ) : (
                 <span className="text-[#C8102E] font-black text-lg">
                   {finalAuthor.charAt(0).toUpperCase()}
                 </span>
               )}
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                By {finalAuthor}
              </p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{date}</p>
            </div>
          </div>
        </header>

        {article.imageUrl && (
          <div className="w-full mb-12 overflow-hidden rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
            <img src={article.imageUrl} alt={article.title} className="w-full h-auto object-cover" />
          </div>
        )}

        <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 font-serif">
          {article.content?.map((block: any, index: number) => {
            if (block._type === 'block') {
              const text = block.children.map((child: any) => child.text).join('');
              return <p key={index} className="mb-6 leading-relaxed">{text}</p>;
            }
            return null;
          })}
        </div>
      </article>
    </main>
  );
}
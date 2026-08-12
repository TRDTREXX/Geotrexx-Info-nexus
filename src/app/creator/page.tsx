import NewsCard from '../../../components/NewsCard'
import Link from 'next/link'

export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const HYGRAPH_ENDPOINT = "https://eu-west-2.cdn.hygraph.com/content/cmrms81py00mq07w07a3zcs1e/master"

const getSortTime = (article: any) => {
  let time = 0;
  if (article.publishedDate) {
    if (article.publishedDate.includes('/')) {
      const [d, m, y] = article.publishedDate.split('/');
      time = new Date(`${y}-${m}-${d}T12:00:00`).getTime();
    } else {
      time = new Date(article.publishedDate).getTime();
    }
  } else if (article.publishedAt) {
    time = new Date(article.publishedAt).getTime();
  }
  return isNaN(time) ? 0 : time;
}

async function getCategoryArticles(slug: string) {
  const query = `
    query GetArticles {
      articles(first: 50, orderBy: publishedAt_DESC) {
        id
        title
        slug
        summary
        publishedDate
        publishedAt
        category
        image { url }
      }
    }
  `
  try {
    const res = await fetch(HYGRAPH_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      cache: 'no-store'
    })
    
    const json = await res.json()
    if (json.errors) return { data: [], error: json.errors[0].message }
    
    let articles = json.data?.articles || [];
    
    // 🚀 THE WORLD TAB FIX: Catches both "World" and "General News"
    articles = articles.filter((a: any) => {
      if (!a.category) return false;
      
      const dbCategory = a.category.toLowerCase();
      const targetSlug = slug.toLowerCase();
      
      // If we are on the World tab, accept multiple variations
      if (targetSlug === 'world') {
        return dbCategory.includes('world') || dbCategory.includes('general');
      }
      
      // Otherwise, just do a fuzzy match for normal tabs (sports, business, tech)
      return dbCategory.includes(targetSlug);
    });

    articles.sort((a: any, b: any) => getSortTime(b) - getSortTime(a));

    return { data: articles, error: null }
  } catch (error: any) {
    return { data: [], error: error.message }
  }
}

export default async function CategoryPage(props: any) {
  const resolvedParams = await Promise.resolve(props.params);
  const slug = resolvedParams?.slug || '';
  
  const { data: articles } = await getCategoryArticles(slug)
  const displayCategory = slug.charAt(0).toUpperCase() + slug.slice(1)

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="border-b-4 border-[#C8102E] pb-4 mb-10 inline-block">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
          {displayCategory}
        </h1>
      </div>

      {(!articles || articles.length === 0) ? (
        <div className="py-20 text-center">
          <p className="text-xl text-gray-500 font-bold">No news currently available for {displayCategory}.</p>
          <Link href="/" className="mt-6 inline-block text-[#C8102E] font-bold uppercase hover:underline tracking-widest">Return Home</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article: any) => (
            <NewsCard 
              key={article.id}
              title={article.title}
              slug={article.slug}
              excerpt={article.summary || "Click to read the full story and dive deep into the analysis."}
              imageUrl={article.image?.url || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167"}
              category={displayCategory}
              date={article.publishedDate || article.publishedAt}
            />
          ))}
        </div>
      )}
    </div>
  )
}
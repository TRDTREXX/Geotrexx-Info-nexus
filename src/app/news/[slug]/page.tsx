import NewsCard from '../../../components/NewsCard'
import Link from 'next/link'

export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const HYGRAPH_ENDPOINT = "https://eu-west-2.cdn.hygraph.com/content/cmrms81py00mq07w07a3zcs1e/master"

async function getCategoryArticles(slug: string) {
  const query = `
    query GetArticles {
      articles(first: 100, orderBy: publishedAt_DESC) {
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
    const res = await fetch(`${HYGRAPH_ENDPOINT}?burst=${Date.now()}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify({ query }),
      cache: 'no-store'
    })
    
    const json = await res.json()
    if (json.errors) return { data: [], error: json.errors[0].message }
    
    let articles = json.data?.articles || [];
    
    // 🚀 Safely filter by category using JavaScript to avoid Hygraph case-sensitivity bugs
    const targetCategory = slug === 'world' ? 'general news' : slug;
    articles = articles.filter((a: any) => a.category && a.category.toLowerCase() === targetCategory.toLowerCase());

    // 🚀 Apply the Indestructible Sort
    articles.sort((a: any, b: any) => {
      let timeA = new Date(a.publishedDate || a.publishedAt || 0).getTime();
      let timeB = new Date(b.publishedDate || b.publishedAt || 0).getTime();
      if (isNaN(timeA)) timeA = 0;
      if (isNaN(timeB)) timeB = 0;
      return timeB - timeA;
    });

    return { data: articles, error: null }
  } catch (error: any) {
    return { data: [], error: error.message }
  }
}

export default async function CategoryPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { data: articles } = await getCategoryArticles(params.slug)
  const displayCategory = params.slug.charAt(0).toUpperCase() + params.slug.slice(1)

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
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
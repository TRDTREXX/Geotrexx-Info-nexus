import Link from 'next/link';

const CMS_URL = "https://eu-west-2.cdn.hygraph.com/content/cmrms81py00mq07w07a3zcs1e/master";
const SITE_URL = 'https://www.geotrexx.com';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  try {
    const query = `
      query GetArticleMeta($slug: String!) {
        articles(where: { slug: $slug }) {
          title
          summary
          image { url }
        }
      }
    `;

    const response = await fetch(CMS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { slug } }),
      next: { revalidate: 60 }
    });

    const result = await response.json();
    const article = result.data?.articles?.[0];

    if (article) {
      return {
        metadataBase: new URL(SITE_URL),
        title: `${article.title} | GEOTREXX`,
        description: article.summary,
        openGraph: {
          title: article.title,
          description: article.summary,
          url: `${SITE_URL}/news/${slug}`,
          siteName: 'GEOTREXX',
          images: [
            {
              url: article.image ? article.image.url : `${SITE_URL}/icon.png`,
              width: 1200,
              height: 630,
              alt: article.title,
            }
          ],
          type: 'article',
        },
      };
    }
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: 'Article | GEOTREXX',
    openGraph: { images: [{ url: `${SITE_URL}/icon.png`, width: 1200, height: 630 }] }
  };
}

export default async function ArticlePage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  let article = null;

  try {
    const query = `
      query GetSingleArticle($slug: String!) {
        articles(where: { slug: $slug }) {
          id
          title
          category
          publishedDate
          readTime
          summary
          content { html text }
          image { url }
        }
      }
    `;

    const response = await fetch(CMS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { slug } }),
      next: { revalidate: 60 }
    });

    const result = await response.json();
    
    // Check for GraphQL errors in the background
    if (result.errors) {
      console.error("GraphQL Errors:", result.errors);
    }

    article = result.data?.articles?.[0];
  } catch (err) {
    console.error(err);
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-black mb-4">Article Not Found</h1>
        <p className="text-gray-600 mb-6">The article you are looking for might have been removed or is temporarily unavailable.</p>
        <Link href="/" className="bg-[#C8102E] text-white px-6 py-3 rounded font-bold uppercase tracking-wider text-sm">
          Back to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b-4 border-[#C8102E] p-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#C8102E] overflow-hidden bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon.png" alt="GEOTREXX" className="w-full h-full object-cover" />
            </div>
            <span className="font-black text-xl tracking-widest uppercase">GEO<span className="text-[#C8102E]">TREXX</span></span>
          </Link>
          <Link href="/" className="text-xs font-black uppercase tracking-widest bg-gray-100 hover:bg-[#C8102E] hover:text-white px-4 py-2 rounded transition-colors">
            ← Back to Feed
          </Link>
        </div>
      </header>

      <main className="grow max-w-4xl mx-auto p-4 md:p-8 w-full">
        <article className="bg-white rounded shadow-sm overflow-hidden border-t-4 border-[#C8102E] p-6 md:p-10">
          <div className="flex gap-3 items-center mb-4">
            <span className="bg-[#C8102E] text-white text-[10px] font-black px-2 py-1 uppercase tracking-widest rounded-sm">{article.category || 'News'}</span>
            {article.readTime && <span className="text-gray-400 text-xs font-bold uppercase">{article.readTime}</span>}
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">{article.title}</h1>
          
          <div className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-8 pb-6 border-b border-gray-100">
            Published: {article.publishedDate ? new Date(article.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently'}
          </div>

          {article.image && (
            <div className="mb-10 overflow-hidden rounded">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={article.image.url} alt={article.title} className="w-full max-h-[500px] object-cover" />
            </div>
          )}

          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed text-lg font-serif break-words">
            {article.content?.html ? (
              <div dangerouslySetInnerHTML={{ __html: article.content.html }} />
            ) : (
              <p>{article.content?.text || article.summary}</p>
            )}
          </div>
        </article>
      </main>

      <footer className="bg-[#111111] text-white border-t-8 border-[#C8102E] p-6 text-center text-xs font-bold uppercase tracking-widest">
        &copy; 2026 GEOTREXX INFO NEXUS. All Rights Reserved.
      </footer>
    </div>
  );
}
import Link from 'next/link';

const CMS_URL = "https://eu-west-2.cdn.hygraph.com/content/cmrms81py00mq07w07a3zcs1e/master";
const SITE_URL = 'https://www.geotrexx.com';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  return { title: 'Article | GEOTREXX' }; // Stripped down for safety
}

export default async function ArticlePage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  let article = null;
  let debugError = null;

  try {
    // OVERHAUL: Stripped out category, readTime, and publishedDate
    const query = `
      query GetSingleArticle($slug: String!) {
        articles(where: { slug: $slug }) {
          id
          title
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
      cache: 'no-store'
    });

    const result = await response.json();
    
    if (result.errors) {
      debugError = result.errors[0].message;
    } else {
      article = result.data?.articles?.[0];
    }
  } catch (err) {
    debugError = err.message;
  }

  // OVERHAUL: If Hygraph rejects it, print the error massively on the screen
  if (debugError) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center">
        <h1 className="text-red-600 font-black text-4xl mb-4">DATABASE ERROR</h1>
        <p className="text-gray-800 mb-6 font-bold">Hygraph rejected the code because:</p>
        <code className="bg-gray-100 p-6 rounded text-red-700 text-lg border-2 border-red-200">{debugError}</code>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-black mb-4">Article Not Found</h1>
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
            <span className="font-black text-xl tracking-widest uppercase">GEO<span className="text-[#C8102E]">TREXX</span></span>
          </Link>
          <Link href="/" className="text-xs font-black uppercase tracking-widest bg-gray-100 hover:bg-[#C8102E] hover:text-white px-4 py-2 rounded transition-colors">
            ← Back to Feed
          </Link>
        </div>
      </header>

      <main className="grow max-w-4xl mx-auto p-4 md:p-8 w-full">
        <article className="bg-white rounded shadow-sm overflow-hidden border-t-4 border-[#C8102E] p-6 md:p-10">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">{article.title}</h1>
          
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
    </div>
  );
}
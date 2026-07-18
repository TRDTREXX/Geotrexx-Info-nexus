import Link from 'next/link';

export default async function PostPage({ params }) {
  const { slug } = params;
  const CMS_URL = "https://eu-west-2.cdn.hygraph.com/content/cmrms81py00mq07w07a3zcs1e/master";

  // Fetch the specific article from your database
  const query = `
    query GetArticle {
      article(where: { slug: "${slug}" }) {
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
    body: JSON.stringify({ query }),
    cache: 'no-store' // Ensures fresh data
  });

  const result = await response.json();
  const article = result?.data?.article;

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-black text-gray-900 mb-4">Article Not Found</h1>
          <Link href="/" className="text-[#C8102E] hover:underline font-bold">← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="mb-8 flex items-center text-xs font-black uppercase tracking-widest text-gray-400 hover:text-[#C8102E] transition-colors bg-white border border-gray-200 px-4 py-2 rounded inline-block shadow-sm">
          ← Back to News Feed
        </Link>
        
        <article className="bg-white rounded shadow-sm overflow-hidden border-t-4 border-[#C8102E]">
          <div className="p-6 md:p-10">
            <div className="flex gap-3 items-center mb-4">
              <span className="bg-[#C8102E] text-white text-[10px] font-black px-2 py-1 uppercase tracking-widest rounded-sm">{article.category || 'News'}</span>
              {article.readTime && <span className="text-gray-400 text-xs font-bold uppercase">{article.readTime}</span>}
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">{article.title}</h1>
            
            <div className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-8 pb-6 border-b border-gray-100">
              Published: {article.publishedDate ? new Date(article.publishedDate).toLocaleDateString() : 'Recently'}
            </div>

            {article.image && (
              <div className="mb-10 overflow-hidden rounded">
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
          </div>
        </article>
      </div>
    </div>
  );
}
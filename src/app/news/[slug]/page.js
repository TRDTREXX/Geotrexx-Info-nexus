import Link from 'next/link';

const CMS_URL = "https://eu-west-2.cdn.hygraph.com/content/cmrms81py00mq07w07a3zcs1e/master";

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
    article = result.data?.articles?.[0];
  } catch (err) {
    console.error("Fetch Error");
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-geo-dark flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-black text-white tracking-widest uppercase mb-6">File Corrupted</h1>
        <Link href="/" className="bg-geo-red text-white px-8 py-4 rounded-full font-black uppercase tracking-wider hover:bg-white hover:text-geo-red transition-all shadow-lg hover:shadow-geo-red/50">
          Abort to Nexus
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Progress/Nav Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-black text-xl tracking-widest uppercase text-gray-900 hover:opacity-70 transition-opacity">
            GEO<span className="text-geo-red">TREXX</span>
          </Link>
          <Link href="/" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-geo-red transition-colors flex items-center gap-2">
            <span>←</span> Return
          </Link>
        </div>
      </header>

      <main>
        {/* Massive Hero Header */}
        <div className="max-w-5xl mx-auto px-4 md:px-8 pt-12 pb-8">
          <span className="text-geo-red font-black uppercase tracking-widest text-sm mb-4 block">{article.category || 'Intelligence'}</span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight mb-6">
            {article.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-serif leading-relaxed max-w-3xl border-l-4 border-gray-200 pl-6">
            {article.summary}
          </p>
        </div>

        {/* Full Bleed Image */}
        {article.image && (
          <div className="w-full max-w-6xl mx-auto px-4 md:px-8 mb-12">
            <div className="w-full h-[50vh] md:h-[70vh] rounded-3xl overflow-hidden shadow-2xl bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={article.image.url} alt={article.title} className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {/* Article Body */}
        <article className="max-w-3xl mx-auto px-4 md:px-8">
          <div className="prose prose-lg md:prose-xl prose-red prose-headings:font-black prose-p:font-serif prose-p:leading-relaxed prose-a:text-geo-red max-w-none text-gray-800">
            {article.content?.html ? (
              <div dangerouslySetInnerHTML={{ __html: article.content.html }} />
            ) : (
              <p>{article.content?.text}</p>
            )}
          </div>
        </article>

        {/* AUTHOR BIO BLOCK */}
        <div className="max-w-3xl mx-auto px-4 md:px-8 mt-20 mb-24">
          <div className="bg-gray-50 border-2 border-gray-100 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg shrink-0 bg-geo-dark">
              {/* NOTE: You can upload a photo of yourself to your public folder and change "/icon.png" to "/your-photo.jpg" */}
              <img src="/icon.png" alt="Orpheus Grant-Essilfie" className="w-full h-full object-cover" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h4 className="text-2xl font-black text-gray-900 mb-1">Orpheus Grant-Essilfie</h4>
              <p className="text-geo-red text-xs font-black uppercase tracking-widest mb-4">Director, GEOTREXX Media Group</p>
              <p className="text-gray-600 font-serif text-sm md:text-base leading-relaxed">
                Leading digital editorial strategy and sports analytics for the GEOTREXX network. 
                Dedicated to bringing you the most accurate global news and live market insights.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
import Image from 'next/image'
import Link from 'next/link'
import ReadingProgressBar from '../../../components/ReadingProgressBar'
const CMS_URL = "https://eu-west-2.cdn.hygraph.com/content/cmrms81py00mq07w07a3zcs1e/master"

async function getArticle(slug: string) {
  const query = `
    query GetSingleArticle($slug: String!) {
      articles(where: { slug: $slug }) {
        id title category summary publishedAt
        content { html }
        image { url }
      }
    }
  `
  const res = await fetch(CMS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { slug } }),
    next: { revalidate: 60 }
  })
  const json = await res.json()
  return json.data?.articles?.[0]
}

// Generate SEO Metadata dynamically
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)
  if (!article) return { title: 'Not Found' }

  return {
    title: `${article.title} | GEOTREXX`,
    description: article.summary,
    openGraph: {
      images: [`/news/${params.slug}/opengraph-image`], // Triggers Edge OG generation
    },
    twitter: {
      card: 'summary_large_image',
      image: `/news/${params.slug}/opengraph-image`,
    }
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)

  if (!article) return (
    <div className="min-h-screen flex items-center justify-center dark:bg-geo-dark">
      <h1 className="text-3xl font-black text-geo-red uppercase tracking-widest">Article Not Found</h1>
    </div>
  )

  // JSON-LD Structured Data for Google News
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    image: [article.image?.url],
    datePublished: article.publishedAt || new Date().toISOString(),
    author: [{ '@type': 'Person', name: 'Orpheus Grant-Essilfie' }],
    publisher: { '@type': 'Organization', name: 'GEOTREXX' }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ReadingProgressBar />
      
      <article className="min-h-screen pb-24 bg-white dark:bg-geo-dark">
        {/* Full Bleed Hero */}
        <div className="w-full h-[50vh] md:h-[70vh] relative bg-gray-900">
          {article?.image?.url && (
            <Image src={article.image.url} alt={article.title} fill className="object-cover opacity-80" priority />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-geo-dark via-transparent to-transparent"></div>
        </div>

        {/* Content Wrapper */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
          
          {/* Header Block */}
          <div className="bg-white dark:bg-geo-gray rounded-2xl p-8 md:p-12 shadow-2xl mb-12 border border-gray-100 dark:border-gray-800">
            <span className="text-geo-red font-black uppercase tracking-widest text-sm mb-4 block">
              {article?.category || 'Intelligence'}
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight mb-6">
              {article?.title}
            </h1>
            <div className="flex items-center gap-4 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest border-t border-gray-100 dark:border-gray-800 pt-6">
              <span>By Orpheus Grant-Essilfie</span>
              <span>•</span>
              <span>{new Date(article?.publishedAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Typography Prose Content */}
          <div 
            className="prose prose-lg md:prose-xl dark:prose-invert prose-red prose-headings:font-black prose-p:font-serif prose-p:leading-relaxed max-w-none 
                       first-letter:text-5xl first-letter:font-black first-letter:text-geo-red first-letter:float-left first-letter:mr-3 first-letter:-mt-1"
            dangerouslySetInnerHTML={{ __html: article?.content?.html || '' }}
          />

          {/* Hardcoded Premium Author Bio */}
          <div className="mt-20 p-8 md:p-10 bg-gray-50 dark:bg-gray-900 rounded-3xl flex flex-col md:flex-row items-center md:items-start gap-8 border border-gray-200 dark:border-gray-800">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-geo-dark shadow-xl shrink-0">
              <Image src="/icon.png" alt="Orpheus Grant-Essilfie" width={96} height={96} className="object-cover" />
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Orpheus Grant-Essilfie</h4>
              <p className="text-geo-red text-xs font-black uppercase tracking-widest mb-4">Director, GEOTREXX Media Group</p>
              <p className="text-gray-600 dark:text-gray-400 font-serif leading-relaxed">
                Leading digital editorial strategy and sports analytics for the GEOTREXX network. 
                Dedicated to bringing you the most accurate global news and live market insights.
              </p>
            </div>
          </div>

        </div>
      </article>
    </>
  )
}
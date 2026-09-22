import { client } from '../../../sanity/lib/client';
import { urlFor } from '../../../sanity/lib/image';
import { PortableText } from '@portabletext/react';
import { Metadata } from 'next';
import Image from 'next/image';

export const revalidate = 60;

// Resolved Section & Sub-Section references alongside legacy fallback fields
const query = `*[_type == "article" && slug.current == $slug][0]{
  title,
  summary,
  publishedAt,
  _updatedAt,
  "categoryName": category,
  "subsectionName": coalesce(subGhana, subPolitics, subSports, subStem, subEntertainment, subWorld, subOpinion, subBusiness),
  "authorName": author->name,
  "authorImage": author->image,
  mainImage,
  body
}`;
// --- METADATA & OPEN GRAPH SCRAPERS ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await client.fetch(query, { slug: resolvedParams.slug });
  
  if (!article) return {};

  const imageUrl = article.mainImage 
    ? urlFor(article.mainImage).width(1200).height(630).format('jpg').quality(80).url()
    : 'https://www.geotrexx.com/logo.png';

  return {
    title: `${article.title} | GEOTREXX`,
    description: article.summary,
    metadataBase: new URL('https://www.geotrexx.com'),
    openGraph: {
      title: `${article.title} | GEOTREXX`,
      description: article.summary,
      url: `/news/${resolvedParams.slug}`,
      siteName: 'GEOTREXX Media Group',
      type: 'article',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: [imageUrl],
    }
  };
}

// --- INLINE IMAGE COMPONENT ---
const ptComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      
      return (
        <figure className="not-prose my-10 w-full clear-both">
          <div className="w-full rounded-sm overflow-hidden border border-gray-200" style={{ backgroundColor: '#ffffff' }}>
            <Image
              src={urlFor(value).url()}
              alt={value.alt || 'Article inline image'}
              width={1200}
              height={800} 
              style={{ width: '100%', height: 'auto' }} 
              unoptimized 
              priority 
            />
          </div>
          {(value.caption || value.attribution) && (
            <figcaption className="mt-2.5 px-1 text-left border-l-2 border-[#C8102E] pl-3">
              {value.caption && (
                <p className="text-sm text-gray-700 leading-snug font-serif">
                  {value.caption}
                </p>
              )}
              {value.attribution && (
                <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-widest text-gray-500 font-mono">
                  Photo: {value.attribution}
                </span>
              )}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const article = await client.fetch(
    query, 
    { slug: resolvedParams.slug },
    { next: { tags: ['articles', `article-${resolvedParams.slug}`] } } 
  );

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 text-center min-h-screen" style={{ backgroundColor: '#ffffff' }}>
        <h1 className="text-3xl md:text-5xl font-black text-[#C8102E] uppercase tracking-tighter mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
          Data Disconnect
        </h1>
        <div className="inline-block p-4 rounded-sm border border-gray-300 mt-4 shadow-sm" style={{ backgroundColor: '#ffffff' }}>
          <code className="text-xl md:text-2xl font-mono font-bold text-black">
            {resolvedParams.slug}
          </code>
        </div>
      </div>
    );
  }

  // Schema.org NewsArticle JSON-LD structured data for Google Search & Top Stories
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.geotrexx.com/news/${resolvedParams.slug}`
    },
    "headline": article.title,
    "description": article.summary,
    "image": article.mainImage ? [urlFor(article.mainImage).url()] : [],
    "datePublished": article.publishedAt,
    "dateModified": article._updatedAt || article.publishedAt,
    "author": {
      "@type": "Person",
      "name": article.authorName || "GEOTREXX Desk",
      "worksFor": {
        "@type": "NewsMediaOrganization",
        "name": "GEOTREXX Media Group",
        "publishingPrinciples": "https://www.geotrexx.com/standards"
      }
    },
    "publisher": {
      "@type": "NewsMediaOrganization",
      "name": "GEOTREXX Media Group",
      "url": "https://www.geotrexx.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.geotrexx.com/logo.png"
      }
    },
    "articleSection": article.categoryName || "News"
  };

  return (
    <article className="min-h-screen text-[#121826]" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Invisible Structured Data for Google Indexing */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        
        <header className="mb-10 border-b-2 border-gray-900 pb-8">
          <div className="flex flex-wrap items-center gap-4 mb-6 text-xs font-bold uppercase tracking-widest text-[#C8102E] font-mono">
            <span>
              {article.categoryName ? article.categoryName.toUpperCase() : 'NEWS'}
              {article.subsectionName ? ` • ${article.subsectionName.toUpperCase().replace('-', ' ')}` : ''}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">
              {new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-black leading-tight" style={{ fontFamily: 'Oswald, sans-serif' }}>
            {article.title}
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 font-medium leading-relaxed mb-8" style={{ fontFamily: 'Newsreader, Georgia, serif' }}>
            {article.summary}
          </p>

          <div className="flex items-center justify-between border-t border-gray-300 pt-4">
            <div className="flex items-center gap-3 text-sm font-bold text-gray-900 uppercase tracking-wide font-sans">
              {article.authorImage ? (
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-300">
                  <Image src={urlFor(article.authorImage).url()} alt={article.authorName || 'Author'} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-500">
                  {article.authorName ? article.authorName.charAt(0).toUpperCase() : 'G'}
                </div>
              )}
              <span>BY {article.authorName || 'GEOTREXX DESK'}</span>
            </div>
          </div>
        </header>

        {article.mainImage && (
          <div className="relative w-full aspect-video mb-12 rounded-sm overflow-hidden border-b-4 border-[#C8102E] shadow-sm">
            <Image src={urlFor(article.mainImage).url()} alt={article.title} fill className="object-cover" priority />
          </div>
        )}

        <div className="prose prose-lg max-w-none text-gray-900 leading-[1.8]" style={{ fontFamily: 'Newsreader, Georgia, serif' }}>
          <PortableText value={article.body} components={ptComponents} />
        </div>
      </div>
    </article>
  );
}
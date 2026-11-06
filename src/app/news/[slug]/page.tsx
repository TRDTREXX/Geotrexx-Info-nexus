import { client } from '../../../sanity/lib/client';
import { urlFor } from '../../../sanity/lib/image';
import { PortableText } from '@portabletext/react';
import { Metadata } from 'next';
import Image from 'next/image';
import ShareBar from '../../../components/ShareBar';

export const revalidate = 60;

// Helper to safely extract plain text from Sanity Portable Text arrays
function toPlainText(blocks: any) {
  if (!blocks) return '';
  if (typeof blocks === 'string') return blocks;
  if (Array.isArray(blocks)) {
    return blocks
      .map(block => {
        if (block._type !== 'block' || !block.children) return '';
        return block.children.map((child: any) => child.text).join('');
      })
      .join('\n\n');
  }
  return '';
}

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
  "authorBio": author->bio,
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

  const cleanSummary = toPlainText(article.summary);

  return {
    title: `${article.title} | GEOTREXX`,
    description: cleanSummary,
    metadataBase: new URL('https://www.geotrexx.com'),
    openGraph: {
      title: `${article.title} | GEOTREXX`,
      description: cleanSummary,
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
      description: cleanSummary,
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

  const cleanSummary = toPlainText(article.summary);
  const cleanBio = toPlainText(article.authorBio);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.geotrexx.com/news/${resolvedParams.slug}`
    },
    "headline": article.title,
    "description": cleanSummary,
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
    <main className="min-h-screen bg-white md:bg-gray-50 pb-28 md:pb-12 text-[#121826]">
      <article className="max-w-5xl mx-auto bg-white md:mt-8 md:shadow-xl md:border md:border-gray-100 overflow-hidden">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        
        {article.mainImage ? (
          <div className="relative w-full h-[55vh] md:h-[65vh] bg-black">
            <Image 
              src={urlFor(article.mainImage).url()} 
              alt={article.title} 
              fill 
              className="object-cover opacity-85" 
              priority 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
              <span className="inline-block bg-[#C8102E] text-white text-xs font-black uppercase tracking-widest px-3 py-1 mb-4">
                {article.categoryName ? article.categoryName.toUpperCase() : 'NEWS'}
                {article.subsectionName ? ` • ${article.subsectionName.toUpperCase().replace('-', ' ')}` : ''}
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
                {article.title}
              </h1>
              <div className="flex items-center text-gray-200 text-sm font-bold tracking-wide space-x-3 font-sans">
                <span>BY {article.authorName ? article.authorName.toUpperCase() : 'GEOTREXX DESK'}</span>
                <span>•</span>
                <span>{new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        ) : (
          <header className="px-6 md:px-12 pt-12 pb-8 border-b border-gray-200">
            <span className="inline-block text-[#C8102E] text-xs font-black uppercase tracking-widest mb-4">
              {article.categoryName ? article.categoryName.toUpperCase() : 'NEWS'}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-black leading-tight mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
              {article.title}
            </h1>
          </header>
        )}

        <div className="px-5 py-8 md:px-16 md:py-12 max-w-4xl mx-auto">
          {cleanSummary && (
            <p className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed mb-10" style={{ fontFamily: 'Newsreader, Georgia, serif' }}>
              {cleanSummary}
            </p>
          )}

          <ShareBar title={article.title} slug={resolvedParams.slug} />

          <div className="prose prose-lg md:prose-xl max-w-none text-gray-900 leading-[1.8] prose-a:text-[#C8102E] mt-8" style={{ fontFamily: 'Newsreader, Georgia, serif' }}>
            <PortableText value={article.body} components={ptComponents} />
          </div>

          {/* E-E-A-T Author Block (Reduced & Compacted) */}
          <div className="mt-10 bg-gray-50 p-3 md:p-4 flex items-center gap-4 border border-gray-200 shadow-sm rounded-sm max-w-md">
            {article.authorImage ? (
              <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border border-white shadow-sm flex-shrink-0">
                <Image src={urlFor(article.authorImage).url()} alt={article.authorName || 'Author'} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-200 border border-white shadow-sm flex items-center justify-center text-gray-500 text-xl font-black flex-shrink-0">
                {article.authorName ? article.authorName.charAt(0).toUpperCase() : 'O'}
              </div>
            )}
            <div className="flex flex-col justify-center">
              <h3 className="text-base md:text-lg font-black text-[#0f172a] uppercase tracking-wide leading-none" style={{ fontFamily: 'Oswald, sans-serif' }}>
                {article.authorName || 'ORPHEUS GRANT-ESSILFIE'}
              </h3>
              <p className="text-[#C8102E] text-[9px] md:text-[10px] font-bold uppercase tracking-wider mt-1 mb-0.5">
                Editorial Staff
              </p>
              <p className="text-gray-600 text-[11px] md:text-xs font-serif uppercase leading-none">
                {cleanBio || 'EDITOR IN CHIEF'}
              </p>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
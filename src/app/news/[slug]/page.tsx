import { client } from '../../../sanity/lib/client';
import { urlFor } from '../../../sanity/lib/image';
import { PortableText } from '@portabletext/react';
import { Metadata } from 'next';
import Image from 'next/image';

export const revalidate = 60;

const query = `*[_type == "article" && slug.current == $slug][0]{
  title,
  summary,
  publishedAt,
  _updatedAt,
  "categoryName": category->title,
  "categorySlug": category->slug.current,
  "subsection": coalesce(subGhana, subPolitics, subSports, subStem, subEntertainment, subWorld, subOpinion, subBusiness),
  "authorName": author->name,
  mainImage,
  body
}`;

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
      images: [{ url: imageUrl, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: [imageUrl],
    }
  };
}

const ptComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      return (
        <figure className="not-prose my-10 w-full clear-both">
          <div className="w-full rounded-sm overflow-hidden bg-[#faf9f6] dark:bg-[#0a0b10] border border-gray-200 dark:border-gray-800 transition-colors duration-300">
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
              {value.caption && <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug font-serif">{value.caption}</p>}
              {value.attribution && <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 font-mono">Photo: {value.attribution}</span>}
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
      <div className="max-w-4xl mx-auto px-6 py-32 text-center bg-[#faf9f6] dark:bg-[#0a0b10] transition-colors duration-300 min-h-screen">
        <h1 className="text-3xl md:text-5xl font-black text-[#C8102E] uppercase tracking-tighter mb-4" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
          Data Disconnect
        </h1>
        <div className="inline-block bg-white dark:bg-[#1a1b23] p-4 rounded-sm border border-gray-300 dark:border-gray-800 mt-4 shadow-sm transition-colors duration-300">
          <code className="text-xl md:text-2xl font-mono font-bold text-black dark:text-white">
            {resolvedParams.slug}
          </code>
        </div>
      </div>
    );
  }

  // Generate AdSense & Google News Compliant JSON-LD (Kept completely invisible to readers)
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

  const authorNameLower = (article.authorName || '').toLowerCase();
  let authorStaticImg = null;
  if (authorNameLower.includes('orpheus') || authorNameLower.includes('quist')) {
    authorStaticImg = '/orpheus.png'; 
  }

  return (
    <article className="max-w-4xl mx-auto px-6 py-12 bg-[#faf9f6] dark:bg-[#0a0b10] text-[#121826] dark:text-gray-200 transition-colors duration-300 min-h-screen">
      {/* Invisible Structured Data for Google Bots only */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <header className="mb-10 border-b-2 border-gray-900 dark:border-gray-800 pb-8 transition-colors duration-300">
        <div className="flex flex-wrap items-center gap-4 mb-6 text-xs font-bold uppercase tracking-widest text-[#C8102E] font-mono">
          <span>
            {article.categoryName ? article.categoryName.toUpperCase() : 'NEWS'}
            {article.subsection ? ` • ${article.subsection.toUpperCase().replace('-', ' ')}` : ''}
          </span>
          <span className="text-gray-400 dark:text-gray-600">•</span>
          <span className="text-gray-600 dark:text-gray-400">
            {new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-black dark:text-white leading-tight transition-colors duration-300" style={{ fontFamily: 'Playfair Display, Newsreader, Georgia, serif' }}>
          {article.title}
        </h1>
        
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 font-medium leading-relaxed mb-8 transition-colors duration-300" style={{ fontFamily: 'Newsreader, Georgia, serif' }}>
          {article.summary}
        </p>

        <div className="flex items-center justify-between border-t border-gray-300 dark:border-gray-800 pt-4 transition-colors duration-300">
          <div className="flex items-center gap-3 text-sm font-bold text-gray-900 dark:text-gray-300 uppercase tracking-wide font-sans">
            {authorStaticImg && (
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700">
                <Image src={authorStaticImg} alt={article.authorName || 'Author'} fill className="object-cover" />
              </div>
            )}
            <span>By {article.authorName || 'GEOTREXX Desk'}</span>
          </div>
        </div>
      </header>

      {article.mainImage && (
        <div className="relative w-full aspect-video mb-12 rounded-sm overflow-hidden border-b-4 border-[#C8102E] shadow-sm">
          <Image src={urlFor(article.mainImage).url()} alt={article.title} fill className="object-cover" priority />
        </div>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none text-gray-900 dark:text-gray-300 leading-[1.8] transition-colors duration-300" style={{ fontFamily: 'Newsreader, Georgia, serif' }}>
        <PortableText value={article.body} components={ptComponents} />
      </div>

    </article>
  );
}
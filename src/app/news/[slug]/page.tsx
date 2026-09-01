import { client } from '../../../sanity/lib/client';
import { urlFor } from '../../../sanity/lib/image';
import { PortableText } from '@portabletext/react';
import { Metadata } from 'next';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

const query = `*[_type == "article" && slug.current == $slug][0]{
  title,
  summary,
  publishedAt,
  category,
  "subsection": coalesce(subGhana, subPolitics, subSports, subStem, subEntertainment, subWorld, subOpinion, subBusiness),
  "authorName": author->name,
  mainImage,
  body
}`;

// --- THE METADATA FIX: Optimizing for WhatsApp/Twitter scrapers ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await client.fetch(query, { slug: resolvedParams.slug });
  
  if (!article) return {};

  // MAGIC BULLET: Forces Sanity to deliver a perfectly sized, compressed JPG for social media
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

// --- INLINE IMAGE FIX: Natural dimensions without cropping ---
const ptComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <div className="my-10 w-full rounded-xl overflow-hidden shadow-md bg-gray-50 dark:bg-[#1a1b23]">
          <img
            src={urlFor(value).auto('format').url()}
            alt={value.alt || 'Article inline image'}
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
      );
    },
  },
};

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const article = await client.fetch(
    query, 
    { slug: resolvedParams.slug },
    { cache: 'no-store' } 
  );

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 text-center">
        <h1 className="text-3xl md:text-5xl font-black text-[#C8102E] uppercase tracking-tighter mb-4">
          Data Disconnect
        </h1>
        <div className="inline-block bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 mt-4">
          <code className="text-xl md:text-2xl font-mono font-bold text-black dark:text-white">
            {resolvedParams.slug}
          </code>
        </div>
      </div>
    );
  }

  const authorNameLower = (article.authorName || '').toLowerCase();
  let authorStaticImg = null;
  if (authorNameLower.includes('orpheus')) authorStaticImg = '/orpheus.png';
  else if (authorNameLower.includes('quist')) authorStaticImg = '/quist.png';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.summary,
    "image": article.mainImage ? [urlFor(article.mainImage).url()] : [],
    "datePublished": article.publishedAt,
    "dateModified": article.publishedAt,
    "author": [{"@type": "Person", "name": article.authorName || "GEOTREXX Desk"}],
    "publisher": {
        "@type": "Organization",
        "name": "GEOTREXX Media Group",
        "logo": {"@type": "ImageObject", "url": "https://www.geotrexx.com/logo.png"}
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <header className="mb-10">
        <div className="flex items-center gap-4 mb-6 text-xs font-bold uppercase tracking-widest text-[#C8102E]">
          <span>
            {article.category ? article.category.toUpperCase().replace('-', ' ') : 'NEWS'}
            {article.subsection ? ` • ${article.subsection.toUpperCase().replace('-', ' ')}` : ''}
          </span>
          <span>•</span>
          <span>{new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-black dark:text-white leading-tight">
          {article.title}
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-6">
          {article.summary}
        </p>

        <div className="flex items-center gap-3 text-sm font-bold text-gray-800 dark:text-gray-300 uppercase">
          {authorStaticImg && (
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
              <Image src={authorStaticImg} alt={article.authorName || 'Author'} fill className="object-cover" />
            </div>
          )}
          <span>By {article.authorName || 'GEOTREXX Desk'}</span>
        </div>
      </header>

      {article.mainImage && (
        <div className="relative w-full aspect-video mb-12 rounded-lg overflow-hidden border-b-4 border-[#C8102E]">
          <Image src={urlFor(article.mainImage).url()} alt={article.title} fill className="object-cover" priority />
        </div>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <PortableText value={article.body} components={ptComponents} />
      </div>

    </article>
  );
}
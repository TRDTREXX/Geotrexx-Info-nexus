import { client } from '@/sanity/lib/client'; // If Vercel gives you an import error here, change to: '../../../sanity/lib/client'
import { urlFor } from '@/sanity/lib/image';  // If Vercel gives you an import error here, change to: '../../../sanity/lib/image'
import { PortableText } from '@portabletext/react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';

// 1. Sanity GROQ Query
const query = `*[_type == "article" && slug.current == $slug][0]{
  title,
  summary,
  publishedAt,
  category,
  "authorName": author->name,
  mainImage,
  body
}`;

// 2. Generate Standard SEO Metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await client.fetch(query, { slug: params.slug });

  if (!article) return {};

  return {
    title: `${article.title} | GEOTREXX`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: article.mainImage ? [urlFor(article.mainImage).url()] : [],
    },
  };
}

// 3. Main Page Component
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await client.fetch(query, { slug: params.slug });

  if (!article) {
    notFound();
  }

  // 4. Build the Google News JSON-LD Object
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.summary,
    "image": article.mainImage ? [urlFor(article.mainImage).url()] : [],
    "datePublished": article.publishedAt,
    "dateModified": article.publishedAt,
    "author": [{
        "@type": "Person",
        "name": article.authorName || "GEOTREXX Desk",
    }],
    "publisher": {
        "@type": "Organization",
        "name": "GEOTREXX Media Group",
        "logo": {
            "@type": "ImageObject",
            "url": "https://www.geotrexx.com/logo.png" 
        }
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-6 py-12">
      {/* 🔥 THE INVISIBLE GOOGLE NEWS SCRIPT */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* --- VISIBLE ARTICLE HEADER --- */}
      <header className="mb-10">
        <div className="flex items-center gap-4 mb-6 text-xs font-bold uppercase tracking-widest text-[#C8102E]">
          <span>{article.category || 'News'}</span>
          <span>•</span>
          <span>{new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-black dark:text-white leading-tight">
          {article.title}
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-6">
          {article.summary}
        </p>

        <div className="text-sm font-bold text-gray-800 dark:text-gray-300">
          By {article.authorName || 'GEOTREXX Desk'}
        </div>
      </header>

      {/* --- MAIN IMAGE --- */}
      {article.mainImage && (
        <div className="relative w-full aspect-video mb-12 rounded-lg overflow-hidden border-b-4 border-[#C8102E]">
          <Image
            src={urlFor(article.mainImage).url()}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* --- ARTICLE BODY --- */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <PortableText value={article.body} />
      </div>

      {/* --- AUTHOR BIO SECTION --- */}
      <hr className="my-12 border-gray-200 dark:border-gray-800" />
      
      <div className="bg-gray-50 dark:bg-[#1a1b23] p-8 rounded-xl border-l-4 border-[#C8102E]">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">
          About the Author
        </h3>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1">
            <h4 className="text-xl font-bold text-black dark:text-white mb-2">
              {article.authorName || 'GEOTREXX Desk'}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed text-sm">
              {article.authorName === 'Orpheus Grant-Essilfie' 
                ? "Orpheus Grant-Essilfie is the Co-Founder and Editor-in-Chief of GEOTREXX Media Group. He brings sharp analytical rigor to digital journalism, overseeing the platform's editorial direction. He specializes in political analysis, structural governance, and data-driven sports reporting, ensuring authoritative coverage across all major categories."
                : article.authorName === 'Quist Ebenezer Assan' 
                ? "Quist Ebenezer Assan is the Co-Founder and Managing Editor of GEOTREXX Media Group. With a strong foundation in digital media operations and content strategy, he drives the day-to-day editorial workflow. He is dedicated to maintaining the desk's standard for fast, accurate, and unbiased reporting."
                : "The GEOTREXX Desk delivers fast, unbiased, and authoritative news covering Ghana, global politics, business, and sports."
              }
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
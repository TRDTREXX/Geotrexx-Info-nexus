import { client } from '../../../sanity/lib/client';
import { urlFor } from '../../../sanity/lib/image';
import { PortableText } from '@portabletext/react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ShareBar from '../../../components/ShareBar';

export const revalidate = 60;

function toPlainText(blocks: any) {
  if (!blocks) return '';
  if (typeof blocks === 'string') return blocks;
  if (Array.isArray(blocks)) {
    return blocks
      .map((block) => {
        if (block._type !== 'block' || !block.children) return '';
        return block.children.map((child: any) => child.text).join('');
      })
      .join('\n\n');
  }
  return '';
}

const query = `*[_type in ["article", "post"] && slug.current == $slug][0]{
  title,
  summary,
  publishedAt,
  _createdAt,
  _updatedAt,
  "categoryName": category,
  "subsectionName": coalesce(subGhana, subPolitics, subSports, subStem, subEntertainment, subWorld, subOpinion, subBusiness, subsection),
  "authorName": author->name,
  "authorSlug": author->slug.current,
  "authorImage": author->image,
  mainImage,
  body
}`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await client.fetch(query, { slug: resolvedParams.slug });

  if (!article) return {};

  const imageUrl = article.mainImage
    ? urlFor(article.mainImage).width(1200).height(630).format('jpg').quality(80).url()
    : 'https://www.geotrexx.com/geotrexx-logo.png';

  const cleanSummary = toPlainText(article.summary);

  return {
    title: `${article.title} | GEOTREXX`,
    description: cleanSummary,
    metadataBase: new URL('https://www.geotrexx.com'),
    openGraph: {
      title: `${article.title} | GEOTREXX`,
      description: cleanSummary,
      url: `/news/${resolvedParams.slug}`,
      siteName: 'GEOTREXX',
      type: 'article',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: cleanSummary,
      images: [imageUrl],
    },
  };
}

const ptComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;

      return (
        <figure className="not-prose my-10 w-full clear-both">
          <div
            className="w-full overflow-hidden border border-geotrexx-black"
            style={{ backgroundColor: '#ffffff' }}
          >
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
                <p className="text-sm text-gray-800 leading-snug font-serif">
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

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;

  const article = await client.fetch(
    query,
    { slug: resolvedParams.slug },
    { next: { tags: ['articles', `article-${resolvedParams.slug}`] } }
  );

  if (!article) {
    return (
      <div
        className="max-w-4xl mx-auto px-6 py-32 text-center min-h-screen"
        style={{ backgroundColor: '#ffffff' }}
      >
        <h1 className="text-3xl md:text-5xl font-black text-[#C8102E] uppercase tracking-tighter mb-4">
          Article Not Found
        </h1>
        <div
          className="inline-block p-4 border border-geotrexx-black mt-4"
          style={{ backgroundColor: '#ffffff' }}
        >
          <code className="text-xl md:text-2xl font-mono font-bold text-black">
            {resolvedParams.slug}
          </code>
        </div>
      </div>
    );
  }

  const cleanSummary = toPlainText(article.summary);
  const authorAvatarUrl = article.authorImage
    ? urlFor(article.authorImage).width(160).height(160).url()
    : undefined;

  const exactDate = article.publishedAt || article._createdAt;
  const formattedDate = exactDate
    ? new Date(exactDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.geotrexx.com/news/${resolvedParams.slug}`,
    },
    headline: article.title,
    description: cleanSummary,
    image: article.mainImage ? [urlFor(article.mainImage).url()] : [],
    datePublished: exactDate,
    dateModified: article._updatedAt || exactDate,
    author: {
      '@type': 'Person',
      name: article.authorName || 'Orpheus Grant-Essilfie',
      worksFor: {
        '@type': 'NewsMediaOrganization',
        name: 'GEOTREXX',
        publishingPrinciples: 'https://www.geotrexx.com/standards',
      },
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'GEOTREXX',
      url: 'https://www.geotrexx.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.geotrexx.com/geotrexx-logo.png',
      },
    },
    articleSection: article.categoryName || 'News',
  };

  return (
    <main className="min-h-screen bg-white pb-20 text-geotrexx-black">
      <article className="max-w-4xl mx-auto bg-white px-4 sm:px-6 lg:px-8 pt-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="border-t-[3px] border-geotrexx-black pt-3 mb-4 flex flex-wrap items-center gap-2">
          <Link
            href={`/category/${(article.categoryName || 'ghana').toLowerCase()}`}
            className="bg-[#C8102E] text-white text-[11px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 no-underline"
          >
            {article.categoryName ? article.categoryName.toUpperCase() : 'NEWS'}
          </Link>
          {article.subsectionName && (
            <>
              <span className="text-xs font-mono text-geotrexx-black">/</span>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-geotrexx-black">
                {String(article.subsectionName).replace(/-/g, ' ')}
              </span>
            </>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-geotrexx-black leading-tight tracking-tight mb-5">
          {article.title}
        </h1>

        {cleanSummary && (
          <p className="text-lg md:text-xl text-gray-800 font-serif leading-relaxed mb-6">
            {cleanSummary}
          </p>
        )}

        <ShareBar
          title={article.title}
          slug={resolvedParams.slug}
          authorName={article.authorName || 'Orpheus Grant-Essilfie'}
          authorSlug={article.authorSlug}
          authorAvatar={authorAvatarUrl}
          publishedAt={formattedDate}
        />

        {article.mainImage && (
          <div className="relative w-full aspect-video my-8 border border-geotrexx-black bg-black overflow-hidden">
            <Image
              src={urlFor(article.mainImage).url()}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="prose prose-lg md:prose-xl max-w-none text-geotrexx-black font-serif leading-[1.85] prose-a:text-[#C8102E] mt-6">
          <PortableText value={article.body} components={ptComponents} />
        </div>
      </article>
    </main>
  );
}
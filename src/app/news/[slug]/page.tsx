import { client } from '../../../sanity/lib/client';
import { urlFor } from '../../../sanity/lib/image';
import { PortableText } from '@portabletext/react';
import { Metadata } from 'next';
import Link from 'next/link';
import ShareBar from '../../../components/ShareBar';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

function resolveInlineImageUrl(value: any): string | null {
  try {
    if (!value) return null;
    if (typeof value.url === 'string') return value.url;
    if (typeof value?.asset?.url === 'string') return value.asset.url;
    if (value?.asset?._ref || value?.asset?._id || value?.image?.asset) {
      const target = value.image?.asset ? value.image : value;
      return urlFor(target).width(1200).fit('max').auto('format').quality(85).url();
    }
    return urlFor(value).width(1200).fit('max').auto('format').quality(85).url();
  } catch (err) {
    console.error('Inline image resolution error:', err);
    return null;
  }
}

const query = `*[_type in ["article", "post"] && slug.current == $slug][0]{
  title,
  summary,
  publishedAt,
  publishDate,
  date,
  _createdAt,
  _updatedAt,
  "categoryName": coalesce(category->title, category, section, "News"),
  "subsectionName": coalesce(subGhana, subPolitics, subSports, subStem, subEntertainment, subWorld, subOpinion, subBusiness, subsection->title, subCategory->title, subsection, subCategory),
  "authorName": author->name,
  "authorSlug": author->slug.current,
  "authorImage": author->image,
  mainImage,
  body[]{
    ...,
    _type == "image" => {
      ...,
      asset->
    }
  }
}`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await client.fetch(query, { slug: resolvedParams.slug }, { cache: 'no-store' });

  if (!article) return {};

  const imageUrl = article.mainImage
    ? urlFor(article.mainImage).width(1200).height(630).fit('crop').format('jpg').quality(80).url()
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

function InlineImageRenderer({ value }: { value: any }) {
  const imgUrl = resolveInlineImageUrl(value);
  if (!imgUrl) return null;

  const caption = value?.caption || value?.title || '';
  const attribution = value?.attribution || value?.credit || value?.source || '';
  const altText = value?.alt || caption || 'GEOTREXX report image';

  return (
    <figure className="my-8 mx-auto max-w-2xl clear-both">
      <div className="w-full border border-geotrexx-black bg-gray-50 overflow-hidden flex justify-center">
        <img
          src={imgUrl}
          alt={altText}
          loading="lazy"
          className="w-full h-auto max-h-[540px] object-contain block"
        />
      </div>
      {(caption || attribution) && (
        <figcaption className="mt-2.5 text-left border-l-2 border-[#C8102E] pl-3">
          {caption && (
            <p className="text-sm text-gray-800 leading-snug font-serif">
              {caption}
            </p>
          )}
          {attribution && (
            <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-widest text-gray-500 font-mono">
              Photo: {attribution}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}

const ptComponents = {
  types: {
    image: InlineImageRenderer,
    customImage: InlineImageRenderer,
    blockImage: InlineImageRenderer,
    inlineImage: InlineImageRenderer,
  },
  block: {
    normal: ({ children }: any) => (
      <p className="mb-6 text-lg md:text-xl font-serif text-geotrexx-black leading-[1.85] whitespace-pre-line">
        {children}
      </p>
    ),
    h1: ({ children }: any) => (
      <h2 className="mt-10 mb-4 text-2xl md:text-3xl font-sans font-black uppercase tracking-tight text-geotrexx-black">
        {children}
      </h2>
    ),
    h2: ({ children }: any) => (
      <h2 className="mt-10 mb-4 text-2xl md:text-3xl font-sans font-black tracking-tight text-geotrexx-black border-b border-gray-200 pb-2">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="mt-8 mb-3 text-xl md:text-2xl font-sans font-extrabold tracking-tight text-geotrexx-black">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="mt-6 mb-2 text-lg md:text-xl font-sans font-bold text-geotrexx-black">
        {children}
      </h4>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="my-8 pl-5 border-l-4 border-[#C8102E] italic text-lg md:text-xl font-serif text-gray-800 bg-gray-50 py-3 pr-4">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="mb-6 ml-6 list-disc space-y-2.5 text-lg md:text-xl font-serif text-geotrexx-black leading-[1.85]">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="mb-6 ml-6 list-decimal space-y-2.5 text-lg md:text-xl font-serif text-geotrexx-black leading-[1.85]">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => <li className="pl-1">{children}</li>,
    number: ({ children }: any) => <li className="pl-1">{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-bold text-geotrexx-black">{children}</strong>
    ),
    em: ({ children }: any) => <em className="italic">{children}</em>,
    link: ({ value, children }: any) => {
      const href = value?.href || '#';
      const isExternal = href.startsWith('http');
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-[#C8102E] underline underline-offset-4 hover:text-black transition-colors font-semibold"
        >
          {children}
        </a>
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
    { cache: 'no-store' }
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
    ? urlFor(article.authorImage).width(160).height(160).fit('crop').auto('format').url()
    : undefined;

  const mainImageUrl = article.mainImage
    ? urlFor(article.mainImage).width(1400).fit('max').auto('format').quality(90).url()
    : null;

  const exactDate =
    article.publishedAt || article.publishDate || article.date || article._createdAt;
  const formattedDate = exactDate
    ? new Date(exactDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Africa/Accra',
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
    image: mainImageUrl ? [mainImageUrl] : [],
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
            href={`/category/${String(article.categoryName || 'ghana').toLowerCase()}`}
            className="bg-[#C8102E] text-white text-[11px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 no-underline"
          >
            {article.categoryName ? String(article.categoryName).toUpperCase() : 'NEWS'}
          </Link>
          {article.subsectionName && (
            <>
              <span className="text-xs font-mono text-geotrexx-black">/</span>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-geotrexx-black">
                {String(article.subsectionName).replace(/[-_]+/g, ' ')}
              </span>
            </>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-geotrexx-black leading-tight tracking-tight mb-5">
          {article.title}
        </h1>

        {cleanSummary && (
          <p className="text-lg md:text-xl text-gray-800 font-serif leading-relaxed mb-6 whitespace-pre-line">
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

        {mainImageUrl && (
          <figure className="my-8 w-full">
            <div className="w-full border border-geotrexx-black bg-white overflow-hidden">
              <img
                src={mainImageUrl}
                alt={article.title}
                className="w-full h-auto block mx-auto"
              />
            </div>
          </figure>
        )}

        <div className="max-w-none text-geotrexx-black font-serif mt-8">
          {typeof article.body === 'string' ? (
            article.body
              .split(/\n\s*\n/)
              .filter(Boolean)
              .map((para: string, idx: number) => (
                <p
                  key={idx}
                  className="mb-6 text-lg md:text-xl font-serif text-geotrexx-black leading-[1.85] whitespace-pre-line"
                >
                  {para}
                </p>
              ))
          ) : (
            <PortableText value={article.body} components={ptComponents} />
          )}
        </div>
      </article>
    </main>
  );
}
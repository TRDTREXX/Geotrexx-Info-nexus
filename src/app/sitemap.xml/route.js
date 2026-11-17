import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.geotrexx.com';
  let articleEntries: MetadataRoute.Sitemap = [];

  try {
    const articles = await client.fetch(
      `*[_type in ["article", "post"] && defined(slug.current)]{ "slug": slug.current, "updatedAt": coalesce(_updatedAt, publishedAt, _createdAt) }`
    );

    articleEntries = (articles || []).map((art: any) => ({
      url: `${baseUrl}/news/${art.slug}`,
      lastModified: art.updatedAt ? new Date(art.updatedAt) : new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));
  } catch (err) {
    console.error('Sitemap Sanity fetch error:', err);
  }

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: `${baseUrl}/category/ghana`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/category/politics`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/category/world`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/category/business`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/category/sports`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/founders`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ...articleEntries,
  ];
}
import { client } from '@/sanity/lib/client';

export const revalidate = 3600;

export async function GET() {
  const baseUrl = 'https://www.geotrexx.com';
  let articles = [];

  try {
    articles = await client.fetch(
      `*[_type in ["article", "post"] && defined(slug.current)]{
        "slug": slug.current,
        "updatedAt": coalesce(_updatedAt, publishedAt, _createdAt)
      }`
    );
  } catch (err) {
    console.error('Sitemap Sanity fetch error:', err);
  }

  const staticRoutes = [
    '',
    '/category/ghana',
    '/category/politics',
    '/category/world',
    '/category/business',
    '/category/sports',
    '/founders',
    '/standards',
    '/privacy',
    '/terms',
  ];

  const now = new Date().toISOString();

  const staticXml = staticRoutes
    .map(
      (route) => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${route === '' ? 'hourly' : 'daily'}</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`
    )
    .join('');

  const articleXml = (articles || [])
    .map((art) => {
      const lastMod = art.updatedAt
        ? new Date(art.updatedAt).toISOString()
        : now;
      return `
  <url>
    <loc>${baseUrl}/news/${art.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticXml}${articleXml}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
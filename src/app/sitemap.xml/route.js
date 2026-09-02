import { client } from '../../sanity/lib/client';

export const revalidate = 3600; // Revalidates the sitemap automatically every hour

export async function GET() {
  const baseUrl = 'https://www.geotrexx.com';
  
  const query = `*[_type == "article" && defined(slug.current)] | order(publishedAt desc) {
    "slug": slug.current,
    publishedAt
  }`;
  
  const articles = await client.fetch(query, {}, { next: { tags: ['articles'] } });

  const articleUrls = articles.map((article: any) => `
  <url>
    <loc>${baseUrl}/news/${article.slug}</loc>
    <lastmod>${article.publishedAt ? new Date(article.publishedAt).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>
  <url><loc>${baseUrl}/category/ghana</loc><changefreq>hourly</changefreq><priority>0.9</priority></url>
  <url><loc>${baseUrl}/category/politics</loc><changefreq>hourly</changefreq><priority>0.9</priority></url>
  <url><loc>${baseUrl}/category/business</loc><changefreq>hourly</changefreq><priority>0.9</priority></url>
  <url><loc>${baseUrl}/category/world</loc><changefreq>hourly</changefreq><priority>0.9</priority></url>
  <url><loc>${baseUrl}/category/sports</loc><changefreq>hourly</changefreq><priority>0.9</priority></url>
  <url><loc>${baseUrl}/category/stem</loc><changefreq>hourly</changefreq><priority>0.9</priority></url>
  <url><loc>${baseUrl}/category/entertainment</loc><changefreq>hourly</changefreq><priority>0.9</priority></url>
  ${articleUrls}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: { 'Content-Type': 'application/xml' },
  });
}
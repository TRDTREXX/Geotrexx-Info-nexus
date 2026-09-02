export function GET() {
  const robots = `# GEOTREXX Media Group - Production robots.txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /studio/

# Search Crawlers & Google AdSense Indexing
User-agent: Googlebot
Allow: /
User-agent: Googlebot-News
Allow: /
User-agent: Mediapartners-Google
Allow: /

# Canonical XML Sitemap
Sitemap: https://www.geotrexx.com/sitemap.xml
`;

  return new Response(robots, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
}
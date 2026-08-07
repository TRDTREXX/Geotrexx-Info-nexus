import DashboardClient from './DashboardClient';

const CMS_URL = "https://eu-west-2.cdn.hygraph.com/content/cmrms81py00mq07w07a3zcs1e/master";
const SITE_URL = 'https://www.geotrexx.com';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'GEOTREXX | Info Nexus',
  description: 'Your premium digital destination for global news, sports analytics, and deep editorial coverage.',
  openGraph: {
    title: 'GEOTREXX | Info Nexus',
    description: 'Your premium digital destination for global news, sports analytics, and deep editorial coverage.',
    url: SITE_URL,
    siteName: 'GEOTREXX',
    images: [{ url: `${SITE_URL}/icon.png`, width: 1200, height: 630 }],
    type: 'website',
  },
};

export default async function Home() {
  let fetchedArticles = [];
  let serverError = null;

  try {
    const query = `query GetArticles { articles(orderBy: publishedDate_DESC) { id title slug category publishedDate readTime summary content { html text } image { url } } }`;
    const response = await fetch(CMS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      next: { revalidate: 60 }
    });
    const result = await response.json();
    if (result.data?.articles) {
      fetchedArticles = result.data.articles;
    }
  } catch (err) {
    console.error(err);
    serverError = "Database link down. Loading offline fallback news.";
  }

  return (
    <DashboardClient 
      serverArticles={fetchedArticles} 
      serverError={serverError} 
    />
  );
}
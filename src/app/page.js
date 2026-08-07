import DashboardClient from './DashboardClient';

const CMS_URL = "https://eu-west-2.cdn.hygraph.com/content/cmrms81py00mq07w07a3zcs1e/master";
const SITE_URL = 'https://www.geotrexx.com';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'GEOTREXX | Info Nexus',
  description: 'Your premium digital destination for global news, sports analytics, and deep editorial coverage.',
};

export default async function Home() {
  let fetchedArticles = [];
  let serverError = null;

  try {
    // OVERHAUL: Stripped out category, readTime, publishedDate, and orderBy.
    const query = `
      query GetSafeArticles { 
        articles { 
          id 
          title 
          slug 
          summary 
          image { url } 
        } 
      }
    `;
    
    const response = await fetch(CMS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      cache: 'no-store' 
    });
    
    const result = await response.json();
    
    if (result.errors) {
      // OVERHAUL: This forces the exact Hygraph error to display on your screen
      serverError = "DATABASE REJECTED QUERY: " + result.errors[0].message;
    } else if (result.data?.articles) {
      fetchedArticles = result.data.articles;
    }
  } catch (err) {
    serverError = "NETWORK CRASH: " + err.message;
  }

  return (
    <DashboardClient 
      serverArticles={fetchedArticles} 
      serverError={serverError} 
    />
  );
}
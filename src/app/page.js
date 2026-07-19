import { Suspense } from 'react';
import DashboardClient from './DashboardClient'; 

// FIXED: Restored the '1's to match your exact Hygraph endpoint
const CMS_URL = "https://eu-west-2.cdn.hygraph.com/content/cmrms81py00mq07w07a3zcs1e/master";

// This runs on the server to generate Facebook/Twitter tags BEFORE the page loads
export async function generateMetadata({ searchParams }) {
  const postId = searchParams.post;

  // If there is no post ID in the URL, return the default GEOTREXX metadata
  if (!postId) {
    return {
      title: 'GEOTREXX | Info Nexus',
      description: 'Your premium digital destination for global news, sports analytics, and deep editorial coverage.',
      openGraph: {
        images: ['/geotrexx-logo.png'],
      },
    };
  }

  // If there IS a post ID, fetch that specific article from Hygraph
  try {
    const query = `
      query GetArticleMeta($slug: String!) {
        articles(where: { OR: [{ slug: $slug }, { id: $slug }] }) {
          title
          summary
          image { url }
        }
      }
    `;

    const response = await fetch(CMS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { slug: postId }
      }),
      cache: 'no-store' // Added to fix the issue where new Hygraph content wasn't showing
    });

    const result = await response.json();
    const article = result.data?.articles[0];

    if (article) {
      return {
        title: `${article.title} | GEOTREXX`,
        description: article.summary,
        openGraph: {
          title: article.title,
          description: article.summary,
          images: article.image ? [article.image.url] : ['/geotrexx-logo.png'],
        },
      };
    }
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }

  return { title: 'GEOTREXX | Info Nexus' };
}

// The actual page just loads your client component
export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50 w-full">
        <div className="w-12 h-12 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <DashboardClient />
    </Suspense>
  );
}
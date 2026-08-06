import DashboardClient from './DashboardClient'; 

const CMS_URL = "https://eu-west-2.cdn.hygraph.com/content/cmrms81py00mq07w07a3zcs1e/master";
const SITE_URL = 'https://www.geotrexx.com'; 

export async function generateMetadata({ searchParams }) {
  const resolvedParams = await searchParams;
  const postId = resolvedParams?.post;

  // 1. Fallback for the Homepage
  if (!postId) {
    return {
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
  }

  // 2. Dynamic Fetch for Specific Articles
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
      body: JSON.stringify({ query, variables: { slug: postId } }),
      next: { revalidate: 60 } 
    });

    const result = await response.json();
    const article = result.data?.articles[0];

    if (article) {
      return {
        metadataBase: new URL(SITE_URL),
        title: `${article.title} | GEOTREXX`,
        description: article.summary,
        alternates: {
          canonical: `${SITE_URL}/?post=${postId}`,
        },
        openGraph: {
          title: article.title,
          description: article.summary,
          url: `${SITE_URL}/?post=${postId}`, 
          siteName: 'GEOTREXX',
          images: [
            {
              url: article.image ? article.image.url : `${SITE_URL}/icon.png`,
              width: 1200,
              height: 630,
              alt: article.title,
            }
          ],
          type: 'article',
        },
      };
    }
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }

  // 3. Ultimate Fallback if the database fails
  return { 
    metadataBase: new URL(SITE_URL),
    title: 'GEOTREXX | Info Nexus',
    openGraph: { 
      title: 'GEOTREXX | Info Nexus',
      url: SITE_URL,
      images: [{ url: `${SITE_URL}/icon.png`, width: 1200, height: 630 }] 
    }
  };
}

export default async function Home({ searchParams }) {
  const resolvedParams = await searchParams;
  const postId = resolvedParams?.post || null;
  
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
      serverPostId={postId} 
      serverError={serverError} 
    />
  );
}
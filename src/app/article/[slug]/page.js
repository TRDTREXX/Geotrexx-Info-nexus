import Link from 'next/link';
import Image from 'next/image';

async function getArticle(slug) {
  const query = `
    query GetArticle($slug: String!) {
      article(where: { slug: $slug }) {
        title
        content {
          html
        }
        image {
          url
        }
      }
    }
  `;
  
  const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { slug } }),
    cache: 'no-store',
  });

  const json = await res.json();
  return json.data?.article;
}

export default async function ArticlePage({ params }) {
  // NEXT.JS 15 FIX: You must await the params before extracting the slug
  const resolvedParams = await params;
  const article = await getArticle(resolvedParams.slug);

  if (!article) {
    return (
      <div style={{ maxWidth: '800px', margin: '100px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1>Article Not Found</h1>
        <Link href="/" style={{ color: '#0056b3' }}>&larr; Back to GEOTREXX</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <Link href="/" style={{ color: '#0056b3', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block', marginBottom: '30px' }}>
        &larr; Back to Home
      </Link>
      
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', lineHeight: '1.2' }}>{article.title}</h1>
      
      {article.image?.url && (
        <div style={{ position: 'relative', width: '100%', height: '400px', marginBottom: '30px', borderRadius: '12px', overflow: 'hidden' }}>
          <Image src={article.image.url} alt={article.title} fill style={{ objectFit: 'cover' }} />
        </div>
      )}

      <div 
        style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#333' }}
        dangerouslySetInnerHTML={{ __html: article.content?.html || '' }} 
      />
    </div>
  );
}
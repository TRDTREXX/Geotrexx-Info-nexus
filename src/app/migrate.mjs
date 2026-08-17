import { createClient } from '@sanity/client';
import fs from 'fs';

const client = createClient({
  projectId: 'x0tpoga9', // Your exact project ID
  dataset: 'production',
  useCdn: false,
  token: 'YOUR_EDITOR_TOKEN_HERE', // Make sure you generated and pasted that secret token!
  apiVersion: '2024-03-01',
});

// 2. Helper to convert Hygraph's Raw AST into Sanity's Portable Text format
const convertToPortableText = (hygraphNodes) => {
  if (!hygraphNodes || !hygraphNodes.children) return [];
  
  return hygraphNodes.children.map(node => {
    if (node.type === 'paragraph') {
      return {
        _type: 'block',
        style: 'normal',
        children: node.children.map(child => ({
          _type: 'span',
          text: child.text || '',
          marks: child.bold ? ['strong'] : child.italic ? ['em'] : []
        }))
      };
    }
    // Safely ignore unrecognized blocks during the initial text migration
    return null;
  }).filter(Boolean);
};

const runMigration = async () => {
  console.log('🚀 Starting GEOTREXX Content Migration...');
  
  // Read the JSON file you just saved
  const rawData = fs.readFileSync('./hygraph-export.json', 'utf8');
  const { data } = JSON.parse(rawData);
  const articles = data.articles;

  console.log(`Found ${articles.length} articles to process.`);

  for (const article of articles) {
    const oldCategory = article.category ? article.category.toLowerCase().trim() : '';
    
    // STRICT RULE ENFORCEMENT: 
    // We only auto-approve premium categories. 
    // "General News" and "Theme" are deliberately left blank for manual review.
    const confidentCategories = ['sports', 'politics', 'business', 'stem', 'entertainment', 'world', 'opinion', 'ghana'];
    const isConfident = confidentCategories.includes(oldCategory);

    // Structure the new Sanity Document
    const sanityDoc = {
      _type: 'article',
      title: article.title,
      slug: { _type: 'slug', current: article.slug },
      summary: article.summary || '',
      publishedAt: article.publishedDate ? new Date(article.publishedDate).toISOString() : new Date().toISOString(),
      content: convertToPortableText(article.content?.raw),
      // We store the old obsolete category string in a hidden legacy field 
      // just so you know where it originally came from during your manual review
      legacyCategory: article.category, 
    };

    try {
      // Create the article in Sanity
      await client.create(sanityDoc);
      console.log(`✅ Successfully Migrated: ${article.title}`);
    } catch (err) {
      console.error(`❌ Failed to Migrate: ${article.title}`, err.message);
    }
  }
  
  console.log('🎉 Migration Complete! Open your Sanity Studio to review.');
};

runMigration();
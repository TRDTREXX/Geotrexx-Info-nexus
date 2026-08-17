import { createClient } from '@sanity/client';
import fs from 'fs';

// 1. Initialize the Sanity Client
const client = createClient({
  projectId: 'x0tpoga9', 
  dataset: 'production',
  useCdn: false,
  token: 'skmd9iE3c5haGUEo4IddiK3p9HgaPSeK1pKFukr4NhmkKaJMlanu9q3bwqG6Q1tq9xKlvvIpXjNyJboHAwMYRvSAwrGed8sJybIPGManH1nPD1tGgNDs4XQOyTG3TucQKAjHBJ2coxNxB2KqLNYrJVXet0goFTVEgmIsUfCALtzgpAdNAylJ', 
  apiVersion: '2024-03-01',
});

// 2. Helper: Download images from Hygraph and upload them to Sanity
async function uploadImage(imageUrl) {
  if (!imageUrl) return null;
  try {
    const res = await fetch(imageUrl);
    const buffer = await res.arrayBuffer();
    
    // Upload the image buffer directly to your Sanity project
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: imageUrl.split('/').pop() || 'geotrexx-image.jpg'
    });
    
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id
      }
    };
  } catch (e) {
    console.error(`⚠️ Image upload failed for ${imageUrl}:`, e.message);
    return null;
  }
}

// 3. Helper: Convert Hygraph's Raw AST into Sanity's Portable Text format
function convertToPortableText(rawContent) {
  if (!rawContent || !rawContent.children) return [];
  
  return rawContent.children.map((node, index) => {
    if (node.type === 'paragraph') {
      return {
        _type: 'block',
        _key: `block-${index}`,
        style: 'normal',
        children: node.children.map((child, cIndex) => ({
          _type: 'span',
          _key: `span-${index}-${cIndex}`,
          text: child.text || '',
          marks: child.bold ? ['strong'] : child.italic ? ['em'] : []
        }))
      };
    }
    // Ignore unsupported blocks during this raw text migration
    return null;
  }).filter(Boolean);
}

// 4. The Core Migration Function
async function runMigration() {
  console.log('🚀 Starting GEOTREXX Content Migration to Sanity...');
  
  try {
    // Read the JSON file you saved
    const rawData = fs.readFileSync('./hygraph-export.json', 'utf8');
    const { data } = JSON.parse(rawData);
    const articles = data.articles;

    console.log(`📦 Found ${articles.length} articles to process.\n`);

    for (const article of articles) {
      console.log(`Processing: "${article.title}"...`);
      
      // Process the image first
      let mainImage = null;
      if (article.image?.url) {
        mainImage = await uploadImage(article.image.url);
      }

      // Structure the new Sanity Document
      const sanityDoc = {
        _type: 'article',
        title: article.title,
        slug: { _type: 'slug', current: article.slug },
        summary: article.summary || '',
        publishedAt: article.publishedDate ? new Date(article.publishedDate).toISOString() : new Date().toISOString(),
        content: convertToPortableText(article.content?.raw),
        // Storing the old Hygraph category in a hidden field so you can see it 
        // when manually assigning the new nested categories in the Studio
        oldHygraphCategory: article.category 
      };

      if (mainImage) {
        sanityDoc.mainImage = mainImage;
      }

      try {
        // Create the article in Sanity
        await client.create(sanityDoc);
        console.log(`✅ Successfully Migrated!\n`);
      } catch (err) {
        console.error(`❌ Failed to Migrate:`, err.message, `\n`);
      }
    }
    
    console.log('🎉 MIGRATION COMPLETE!');
    console.log('Open http://localhost:3000/studio to review your articles and assign your new premium categories.');
  } catch (error) {
    console.error('❌ Fatal Error reading the JSON file:', error.message);
  }
}

// Execute the script
runMigration();
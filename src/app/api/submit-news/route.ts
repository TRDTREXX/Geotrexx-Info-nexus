import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

// 1. Initialize Sanity Write Client
// NOTE: useCdn MUST be false for mutations and uploads
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'x0tpoga9',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN, 
});

// Configure route to allow max payload on Vercel
export const dynamic = 'force-dynamic';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Convert plain text paragraphs into standard Sanity Portable Text
function toPortableText(text: string) {
  return text
    .split(/\n\s*\n/)
    .filter((para) => para.trim().length > 0)
    .map((para, index) => ({
      _key: `block_${Date.now()}_${index}`,
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _key: `span_${Date.now()}_${index}`,
          _type: 'span',
          marks: [],
          text: para.trim(),
        },
      ],
    }));
}

export async function POST(req: NextRequest) {
  try {
    // 2. Parse FormData
    const formData = await req.formData();

    const passcode = formData.get('passcode') as string;
    const title = formData.get('title') as string;
    const categoryName = formData.get('category') as string;
    const summary = formData.get('summary') as string;
    const bodyText = formData.get('body') as string;
    const authorId = formData.get('authorId') as string;
    const imageFile = formData.get('image') as File | null;

    // 3. Security & Validation (Mapped to your Vercel settings)
    const EDITORIAL_PASSCODE = process.env.WRITER_PORTAL_PASSCODE || 'geotrexx2026';
    if (passcode !== EDITORIAL_PASSCODE) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid editorial passcode.' },
        { status: 401 }
      );
    }

    if (!title || !bodyText || !authorId) {
      return NextResponse.json(
        { error: 'Missing required article fields (title, body, or author).' },
        { status: 400 }
      );
    }

    if (!imageFile || !(imageFile instanceof File) || imageFile.size === 0) {
      return NextResponse.json(
        { error: 'A valid main image file is required.' },
        { status: 400 }
      );
    }

    // Guard against Vercel payload limits
    if (imageFile.size > 4.5 * 1024 * 1024) {
      return NextResponse.json(
        { error: `Image too large (${(imageFile.size / 1024 / 1024).toFixed(1)}MB). Vercel limit is 4.5MB. Please compress or resize the image.` },
        { status: 413 }
      );
    }

    // 4. Convert File into a Node Buffer for Sanity upload
    const arrayBuffer = await imageFile.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // 5. Upload Asset to Sanity Asset Store
    const imageAsset = await writeClient.assets.upload('image', imageBuffer, {
      filename: imageFile.name || 'article-main-image.jpg',
      contentType: imageFile.type || 'image/jpeg',
    });

    if (!imageAsset?._id) {
      throw new Error('Sanity image asset upload failed: no asset ID returned.');
    }

    // 6. Look up Category Reference ID by Title or Slug
    let categoryRef: { _type: 'reference'; _ref: string } | undefined = undefined;
    if (categoryName) {
      const matchedCategory = await writeClient.fetch(
        `*[_type == "category" && (lower(title) == lower($name) || slug.current == lower($name))][0]._id`,
        { name: categoryName }
      );
      if (matchedCategory) {
        categoryRef = { _type: 'reference', _ref: matchedCategory };
      }
    }

    // 7. Generate Document Payload
    const uniqueSlug = `${slugify(title)}-${Date.now().toString().slice(-4)}`;
    const portableTextBody = toPortableText(bodyText);

    const docPayload: any = {
      _type: 'article', // Change to 'post' if your schema uses 'post' instead of 'article'
      title: title.trim(),
      slug: {
        _type: 'slug',
        current: uniqueSlug,
      },
      publishedAt: new Date().toISOString(),
      summary: summary ? summary.trim() : '',
      author: {
        _type: 'reference',
        _ref: authorId,
      },
      mainImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAsset._id,
        },
      },
      body: portableTextBody,
    };

    if (categoryRef) {
      docPayload.category = categoryRef;
    } else if (categoryName) {
      docPayload.categoryString = categoryName;
    }

    // 8. Create Article Document Live in Sanity
    const createdArticle = await writeClient.create(docPayload);

    return NextResponse.json({
      success: true,
      articleId: createdArticle._id,
      slug: uniqueSlug,
      message: 'Article and image successfully published live to Sanity!',
    });
  } catch (error: any) {
    console.error('API /api/submit-news Error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Internal Server Error during publication',
        details: error.response?.body || error.stack,
      },
      { status: 500 }
    );
  }
}
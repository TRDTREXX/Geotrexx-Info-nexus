import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import crypto from 'crypto';

const writeClient = createClient({
  projectId: 'x0tpoga9',
  dataset: 'production',
  apiVersion: '2024-03-01',
  useCdn: false,
  // Hardcoded to bypass any Vercel env variable blocks
  token: 'skr6nvkX51a3wIvGBzYVHPUR9RAY7bMb3KqwANoDz3TSQ3xpKy9KpTxfGbMWWfPDlMIyn0qsrVswX1Nd9TpSHs2SyGVq3b9tJH4ia80Sy9kl2vCYJzdXi6CfbwFyi5xo8xHqKTdmjj0uvi665eMzzFLBVuJN1OvOKQlZlHOTwPZJS57NEm5r',
});

function slugify(text: string) {
  return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').slice(0, 100);
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const passcode = formData.get('passcode') as string;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const summary = formData.get('summary') as string;
    const body = formData.get('body') as string;
    const authorId = formData.get('authorId') as string;
    const imageFile = formData.get('image') as File | null;

    const validPasscode = process.env.WRITER_PORTAL_PASSCODE || 'admin2026';
    if (!passcode || passcode !== validPasscode) {
      return NextResponse.json({ error: 'Invalid access passcode.' }, { status: 401 });
    }

    if (!title || !category || !summary || !body || !authorId || !imageFile) {
      return NextResponse.json({ error: 'All fields are required, including the Main Image.' }, { status: 400 });
    }

    // 1. Upload the Image to Sanity's Asset Server
    const imageBuffer = await imageFile.arrayBuffer();
    const uploadedAsset = await writeClient.assets.upload('image', Buffer.from(imageBuffer), {
      filename: imageFile.name,
      contentType: imageFile.type
    });

    // 2. Format the Text
    const paragraphs = body.split(/\n\s*\n/).map((p: string) => p.trim()).filter((p: string) => p.length > 0);
    const portableTextBody = paragraphs.map((text: string) => ({
      _type: 'block',
      _key: crypto.randomBytes(6).toString('hex'),
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: crypto.randomBytes(6).toString('hex'), marks: [], text }],
    }));

    const cleanSlug = `${slugify(title)}-${Date.now().toString().slice(-4)}`;
    const documentId = crypto.randomUUID();

    // 3. Construct the Article and Link the Uploaded Image
    const doc = {
      _id: documentId,
      _type: 'article',
      title,
      slug: { _type: 'slug', current: cleanSlug },
      category: category.toLowerCase(),
      summary,
      body: portableTextBody,
      mainImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: uploadedAsset._id 
        }
      },
      author: {
        _type: 'reference',
        _ref: authorId 
      },
      publishedAt: new Date().toISOString(),
    };

    await writeClient.create(doc);
    return NextResponse.json({ success: true, message: 'Story published successfully with image!' });

  } catch (error: any) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to submit article.' }, { status: 500 });
  }
}
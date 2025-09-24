
import { addBlogPost, BlogPost } from '@/lib/blog-data';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// This is a simplified schema for validation.
const blogPostSchema = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  date: z.string(),
  author: z.string(),
  image: z.string().url(),
  dataAiHint: z.string(),
  tags: z.array(z.string()),
  content: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const newPost: BlogPost = blogPostSchema.parse(json);
    
    // This function will write to the JSON file
    addBlogPost(newPost);
    
    return NextResponse.json({ success: true, slug: newPost.slug }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to add blog post:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid post data.', details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}

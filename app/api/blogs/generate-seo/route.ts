import { NextRequest, NextResponse } from 'next/server';
import { generateSEOMetadata, validateSEOQuality } from '@/lib/seo-optimizer';

/**
 * POST /api/blogs/generate-seo
 * Generates SEO-optimized metadata for a blog post
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, excerpt } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate SEO metadata
    const seoMetadata = generateSEOMetadata(title, content, excerpt);

    // Validate quality
    const quality = validateSEOQuality(seoMetadata);

    return NextResponse.json({
      success: true,
      data: {
        ...seoMetadata,
        quality,
      },
    });
  } catch (error) {
    console.error('SEO generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate SEO metadata' },
      { status: 500 }
    );
  }
}

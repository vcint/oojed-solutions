import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

function getAuthorFromCookie(req: NextRequest): { authorId: string; role: string } | null {
  const sessionToken = req.cookies.get('author_session')?.value;
  if (!sessionToken) return null;

  try {
    const decoded = JSON.parse(Buffer.from(sessionToken, 'base64').toString());
    return { authorId: decoded.authorId, role: decoded.role };
  } catch {
    return null;
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export async function POST(req: NextRequest) {
  try {
    const author = getAuthorFromCookie(req);

    if (!author) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      title,
      content,
      excerpt,
      category_id,
      featured_image_url,
      tags,
      seo_title,
      seo_description,
      seo_keywords,
      status = 'draft',
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const slug = generateSlug(title);
    const readingTime = calculateReadingTime(content);

    // Determine final status based on role and requested status
    let finalStatus = status;
    let finalPublishedAt = null;
    let finalSubmittedAt = null;

    if (status === 'published') {
      if (author.role === 'admin') {
        // Admins can publish immediately
        finalStatus = 'published';
        finalPublishedAt = new Date();
      } else {
        // Writers submit for approval
        finalStatus = 'pending_approval';
        finalSubmittedAt = new Date();
      }
    } else if (status === 'draft') {
      finalStatus = 'draft';
    }

    const { data, error } = await supabase
      .from('blogs')
      .insert([
        {
          title,
          slug: slug + '-' + Date.now(),
          content,
          excerpt: excerpt || content.substring(0, 160),
          category_id: category_id || null,
          author_id: author.authorId,
          featured_image_url: featured_image_url || null,
          tags: tags || [],
          status: finalStatus,
          seo_title: seo_title || title,
          seo_description: seo_description || excerpt || content.substring(0, 160),
          seo_keywords: seo_keywords || '',
          reading_time_minutes: readingTime,
          published_at: finalPublishedAt,
          submitted_at: finalSubmittedAt,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json(data?.[0], { status: 201 });
  } catch (error) {
    console.error('Blog creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'published';
    const categories = searchParams.get('categories');
    const tags = searchParams.get('tags');
    const author = getAuthorFromCookie(req);

    let query = supabase
      .from('blogs')
      .select('*');

    if (status === 'published') {
      // Only published blogs are visible to public
      query = query.eq('status', 'published').order('published_at', { ascending: false });
    } else if (status === 'pending_approval') {
      // Only admins can see pending blogs
      if (!author || author.role !== 'admin') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }
      query = query.eq('status', 'pending_approval').order('submitted_at', { ascending: false });
    } else if (status === 'all_by_author') {
      // Authors can see their own drafts; admins can see all blogs
      if (!author) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      if (author.role === 'admin') {
        // Admins get all blogs
        query = query.order('created_at', { ascending: false });
      } else {
        // Regular writers only get their blogs
        query = query.eq('author_id', author.authorId).order('created_at', { ascending: false });
      }
    }

    if (categories) {
      query = query.in('category_id', categories.split(','));
    }

    if (tags) {
      const tagArray = tags.split(',');
      query = query.contains('tags', tagArray);
    }

    const { data, error } = await query.limit(100);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Blog fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const author = getAuthorFromCookie(req);

    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Fetch author data
    let blogAuthor = null;
    if (data.author_id) {
      const { data: authorData } = await supabase
        .from('authors')
        .select('id, name, bio, avatar_url')
        .eq('id', data.author_id)
        .single();
      blogAuthor = authorData;
    }

    // Fetch category data
    let category = null;
    if (data.category_id) {
      const { data: categoryData } = await supabase
        .from('blog_categories')
        .select('id, name, slug')
        .eq('id', data.category_id)
        .single();
      category = categoryData;
    }

    // Check visibility
    if (data.status === 'published') {
      // Published blogs are public
    } else if (data.status === 'pending_approval') {
      // Only author and admins can see pending blogs
      if (!author || (author.authorId !== data.author_id && author.role !== 'admin')) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }
    } else {
      // Drafts and rejected: only author can see
      if (!author || author.authorId !== data.author_id) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }
    }

    // Increment view count only for published blogs
    if (data.status === 'published') {
      await supabase
        .from('blogs')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', id);
    }

    return NextResponse.json({ ...data, author: blogAuthor, category });
  } catch (error) {
    console.error('Blog fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const author = getAuthorFromCookie(req);

    if (!author) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const body = await req.json();

    // Verify ownership
    const { data: blog, error: fetchError } = await supabase
      .from('blogs')
      .select('author_id, status')
      .eq('id', id)
      .single();

    if (fetchError || !blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    if (blog.author_id !== author.authorId && author.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Determine status handling
    let updateData: any = { ...body, updated_at: new Date() };

    // Convert empty strings to null for optional fields
    if (updateData.category_id === '') updateData.category_id = null;
    if (updateData.featured_image_url === '') updateData.featured_image_url = null;

    // If trying to publish
    if (body.status === 'published') {
      if (author.role === 'admin') {
        // Admin can publish directly
        updateData.status = 'published';
        updateData.published_at = new Date();
      } else {
        // Writer submits for approval
        updateData.status = 'pending_approval';
        updateData.submitted_at = new Date();
      }
    }

    const { data, error } = await supabase
      .from('blogs')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json(data?.[0]);
  } catch (error) {
    console.error('Blog update error:', error);
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const author = getAuthorFromCookie(req);

    if (!author) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify ownership
    const { data: blog, error: fetchError } = await supabase
      .from('blogs')
      .select('author_id')
      .eq('id', id)
      .single();

    if (fetchError || !blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    if (blog.author_id !== author.authorId && author.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Blog delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}

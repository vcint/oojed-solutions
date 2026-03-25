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

export async function GET(req: NextRequest) {
  try {
    const author = getAuthorFromCookie(req);

    if (!author || author.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get blog stats
    const { data: blogs, error: blogsError } = await supabase
      .from('blogs')
      .select('status, published_at, author:authors(name), category:blog_categories(name)')
      .order('created_at', { ascending: false });

    if (blogsError) throw blogsError;

    const totalBlogs = blogs.length;
    const publishedBlogs = blogs.filter(b => b.status === 'published').length;
    const draftBlogs = blogs.filter(b => b.status === 'draft').length;
    const pendingBlogs = blogs.filter(b => b.status === 'pending_approval').length;

    // Get recent blogs
    const recentBlogs = blogs.slice(0, 5).map(blog => ({
      title: blog.title || 'Untitled',
      status: blog.status,
      author: blog.author?.name || 'Unknown',
      category: blog.category?.name || 'Uncategorized',
      published_at: blog.published_at,
    }));

    // Get author stats
    const { data: authors, error: authorsError } = await supabase
      .from('authors')
      .select('is_approved, role, created_at')
      .order('created_at', { ascending: false });

    if (authorsError) throw authorsError;

    const totalAuthors = authors.length;
    const approvedAuthors = authors.filter(a => a.is_approved).length;
    const adminCount = authors.filter(a => a.role === 'admin').length;
    const writerCount = authors.filter(a => a.role === 'writer').length;

    // Get category stats
    const { data: categories, error: categoriesError } = await supabase
      .from('blog_categories')
      .select('name, created_at');

    if (categoriesError) throw categoriesError;

    const totalCategories = categories.length;

    return NextResponse.json({
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      pendingBlogs,
      totalAuthors,
      approvedAuthors,
      adminCount,
      writerCount,
      totalCategories,
      recentBlogs,
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
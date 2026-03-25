import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Fetch author data
    let author = null;
    if (data.author_id) {
      const { data: authorData } = await supabase
        .from('authors')
        .select('id, name, bio, avatar_url')
        .eq('id', data.author_id)
        .single();
      author = authorData;
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

    // Increment view count
    await supabase
      .from('blogs')
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq('id', data.id);

    return NextResponse.json({ ...data, author, category });
  } catch (error) {
    console.error('Blog fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

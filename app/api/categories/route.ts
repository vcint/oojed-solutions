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
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Categories fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const author = getAuthorFromCookie(req);

    if (!author || author.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, slug, description } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('blog_categories')
      .insert({ name, slug, description })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Category create error:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
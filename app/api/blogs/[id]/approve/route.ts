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

export async function POST(
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

    // Only admins can approve/reject
    if (author.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can approve blogs' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action, notes } = body;

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Use "approve" or "reject"' },
        { status: 400 }
      );
    }

    // Get the blog to verify it's pending
    const { data: blog, error: fetchError } = await supabase
      .from('blogs')
      .select('status')
      .eq('id', id)
      .single();

    if (fetchError || !blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    if (blog.status !== 'pending_approval') {
      return NextResponse.json(
        { error: 'Blog is not pending approval' },
        { status: 400 }
      );
    }

    // Update blog with approval status
    const { data, error } = await supabase
      .from('blogs')
      .update({
        status: action === 'approve' ? 'published' : 'rejected',
        published_at: action === 'approve' ? new Date() : null,
        reviewed_at: new Date(),
        reviewed_by: author.authorId,
        reviewer_notes: notes || null,
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json({
      message: `Blog ${action}d successfully`,
      blog: data?.[0],
    });
  } catch (error) {
    console.error('Blog approval error:', error);
    return NextResponse.json(
      { error: 'Failed to process approval' },
      { status: 500 }
    );
  }
}

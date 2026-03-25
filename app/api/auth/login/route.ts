import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Get author from database
    const { data: author, error } = await supabase
      .from('authors')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !author) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if approved
    if (!author.is_approved) {
      return NextResponse.json(
        { error: 'Your account is pending admin approval' },
        { status: 403 }
      );
    }

    // Verify password
    const passwordHash = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');

    if (passwordHash !== author.password_hash) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session token with role info
    const sessionToken = Buffer.from(
      JSON.stringify({
        authorId: author.id,
        email: author.email,
        role: author.role,
        timestamp: Date.now(),
      })
    ).toString('base64');

    // Set httponly cookie
    const response = NextResponse.json(
      {
        message: 'Login successful',
        author: {
          id: author.id,
          email: author.email,
          name: author.name,
          role: author.role,
        },
      },
      { status: 200 }
    );

    response.cookies.set('author_session', sessionToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

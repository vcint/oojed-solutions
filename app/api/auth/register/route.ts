import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');

    // Insert new author as "writer" role (requires admin approval)
    const { data, error } = await supabaseAdmin
      .from('authors')
      .insert([
        {
          email,
          name,
          password_hash: passwordHash,
          role: 'writer', // Always register as writer
          is_approved: false,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      if (error.message.includes('duplicate')) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: 'Registration successful! Please wait for admin approval to start writing blogs.',
        author: data?.[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Registration failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}

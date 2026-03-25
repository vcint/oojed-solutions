import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

const pageSeoFilePath = path.join(process.cwd(), 'page-seo-settings.json');

function readPageSeoSettings() {
  try {
    if (fs.existsSync(pageSeoFilePath)) {
      const data = fs.readFileSync(pageSeoFilePath, 'utf8');
      const settings = JSON.parse(data);
      console.log('Page SEO settings loaded:', Object.keys(settings));
      return settings;
    }
  } catch (error) {
    console.error('Error reading page SEO settings:', error);
  }
  console.log('No page SEO settings file found, using empty object');
  return {};
}

function writePageSeoSettings(settings: any) {
  try {
    fs.writeFileSync(pageSeoFilePath, JSON.stringify(settings, null, 2));
    console.log('Page SEO settings saved for routes:', Object.keys(settings));
  } catch (error) {
    console.error('Error writing page SEO settings:', error);
    throw error;
  }
}

export async function GET(req: NextRequest) {
  try {
    const author = getAuthorFromCookie(req);

    if (!author || author.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const settings = readPageSeoSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching page SEO settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
        { status: 401 }
      );
    }

    const body = await req.json();
    const { route, seoData } = body;

    if (!route || !seoData) {
      return NextResponse.json(
        { error: 'Route and seoData are required' },
        { status: 400 }
      );
    }

    const settings = readPageSeoSettings();
    settings[route] = {
      ...seoData,
      updatedAt: new Date().toISOString(),
      updatedBy: author.authorId
    };

    writePageSeoSettings(settings);

    return NextResponse.json({
      success: true,
      message: `SEO settings updated for route: ${route}`
    });
  } catch (error) {
    console.error('Error updating page SEO settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
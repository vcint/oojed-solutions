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
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading page SEO settings:', error);
  }
  return {};
}

function writePageSeoSettings(settings: any) {
  try {
    fs.writeFileSync(pageSeoFilePath, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Error writing page SEO settings:', error);
    throw error;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { route: string } }
) {
  try {
    const author = getAuthorFromCookie(req);

    if (!author || author.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const route = decodeURIComponent(params.route);
    const settings = readPageSeoSettings();

    const routeSeo = settings[route] || null;

    return NextResponse.json({
      route,
      seoData: routeSeo
    });
  } catch (error) {
    console.error('Error fetching page SEO settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { route: string } }
) {
  try {
    const author = getAuthorFromCookie(req);

    if (!author || author.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const route = decodeURIComponent(params.route);
    const body = await req.json();
    const { seoData } = body;

    if (!seoData) {
      return NextResponse.json(
        { error: 'seoData is required' },
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { route: string } }
) {
  try {
    const author = getAuthorFromCookie(req);

    if (!author || author.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const route = decodeURIComponent(params.route);
    const settings = readPageSeoSettings();

    if (settings[route]) {
      delete settings[route];
      writePageSeoSettings(settings);

      return NextResponse.json({
        success: true,
        message: `SEO settings deleted for route: ${route}`
      });
    } else {
      return NextResponse.json(
        { error: 'SEO settings not found for this route' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error deleting page SEO settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
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

const settingsFilePath = path.join(process.cwd(), 'seo-settings.json');

function readSettings() {
  try {
    if (fs.existsSync(settingsFilePath)) {
      const data = fs.readFileSync(settingsFilePath, 'utf8');
      const settings = JSON.parse(data);
      console.log('SEO settings loaded:', settings);
      return settings;
    }
  } catch (error) {
    console.error('Error reading settings:', error);
  }
  console.log('No SEO settings file found, using defaults');
  return {};
}

function writeSettings(settings: any) {
  try {
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));
    console.log('SEO settings saved:', settings);
  } catch (error) {
    console.error('Error writing settings:', error);
    throw error;
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

    const settings = readSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('SEO settings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const author = getAuthorFromCookie(req);

    if (!author || author.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await req.json();
    writeSettings(body);

    return NextResponse.json({ message: 'Settings saved successfully' });
  } catch (error) {
    console.error('SEO settings save error:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
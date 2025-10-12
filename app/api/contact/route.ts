import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, phone, message } = data;
    const siteEmail = process.env.CONTACT_EMAIL; // recipient

    if (!siteEmail) {
      return NextResponse.json({ error: 'No site email configured' }, { status: 501 });
    }

    // require SMTP env
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json({ error: 'SMTP not configured' }, { status: 501 });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mail = {
      from: `${name} <${email}>`,
      to: siteEmail,
      subject: `Website enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`,
    };

    await transporter.sendMail(mail);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('contact API error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

interface ContactRequestBody {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const DESTINATION_EMAIL = "knootix@gmail.com";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<ContactRequestBody>;
    const name = body.name?.trim();
    const email = body.email?.trim();
    const subject = body.subject?.trim();
    const message = body.message?.trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Please fill in every field." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (name.length > 200 || subject.length > 300 || message.length > 5000) {
      return NextResponse.json({ error: "One of the fields is too long." }, { status: 400 });
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_APP_PASSWORD;

    if (!emailUser || !emailPassword) {
      return NextResponse.json(
        { error: "Email sending isn't configured yet. Add EMAIL_USER and EMAIL_APP_PASSWORD to .env.local." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: emailUser, pass: emailPassword },
    });

    await transporter.sendMail({
      from: `"Konita AI Contact Form" <${emailUser}>`,
      to: DESTINATION_EMAIL,
      replyTo: email,
      subject: `[Konita AI] ${subject}`,
      text: `New message from the Konita AI contact form\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #0D211B;">
          <h2 style="color: #0A6847;">New message from the Konita AI contact form</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; border-left: 3px solid #22C58E; padding-left: 12px;">${escapeHtml(message)}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong while sending your message.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

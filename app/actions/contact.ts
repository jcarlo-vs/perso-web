"use server";

import nodemailer from "nodemailer";
import { headers } from "next/headers";

export type ContactFormState = {
  success: boolean;
  message: string;
} | null;

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

// Best-effort rate limit (per serverless instance): 3 sends per IP per 10 minutes
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const recentSends = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (recentSends.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    recentSends.set(ip, recent);
    return true;
  }
  recent.push(now);
  recentSends.set(ip, recent);
  if (recentSends.size > 1000) {
    for (const [key, times] of recentSends) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) recentSends.delete(key);
    }
  }
  return false;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactEmail(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;
  const honeypot = formData.get("company") as string;

  // Honeypot - humans never see this field; bots fill it. Pretend success.
  if (honeypot) {
    return {
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
    };
  }

  // Basic validation
  if (!name || !email || !message) {
    return {
      success: false,
      message: "Please fill in all fields",
    };
  }

  if (
    name.length > MAX_NAME_LENGTH ||
    email.length > MAX_EMAIL_LENGTH ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return {
      success: false,
      message: "Message is too long. Please keep it under 5000 characters.",
    };
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: "Please enter a valid email address",
    };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return {
      success: false,
      message: "Too many messages. Please wait a few minutes and try again.",
    };
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "senin.juancarlo@gmail.com",
      subject: `Portfolio Contact: ${name.replace(/[\r\n]+/g, " ").slice(0, 80)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;">
              <strong style="color: #475569;">From:</strong> ${safeName}
            </p>
            <p style="margin: 0 0 10px 0;">
              <strong style="color: #475569;">Email:</strong>
              <a href="mailto:${safeEmail}" style="color: #7c3aed;">${safeEmail}</a>
            </p>
          </div>

          <div style="background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 8px;">
            <h3 style="margin: 0 0 10px 0; color: #a78bfa;">Message:</h3>
            <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</p>
          </div>

          <p style="color: #94a3b8; font-size: 12px; margin-top: 20px; text-align: center;">
            This email was sent from your portfolio contact form.
          </p>
        </div>
      `,
      replyTo: email,
    });

    return {
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
    };
  } catch (error) {
    console.error("Email error:", error);
    return {
      success: false,
      message: "Failed to send message. Please try again or email me directly.",
    };
  }
}

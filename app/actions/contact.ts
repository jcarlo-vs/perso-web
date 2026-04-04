"use server";

import nodemailer from "nodemailer";

export type ContactFormState = {
  success: boolean;
  message: string;
} | null;

export async function sendContactEmail(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  // Basic validation
  if (!name || !email || !message) {
    return {
      success: false,
      message: "Please fill in all fields",
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
      subject: `Portfolio Contact: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;">
              <strong style="color: #475569;">From:</strong> ${name}
            </p>
            <p style="margin: 0 0 10px 0;">
              <strong style="color: #475569;">Email:</strong> 
              <a href="mailto:${email}" style="color: #7c3aed;">${email}</a>
            </p>
          </div>
          
          <div style="background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 8px;">
            <h3 style="margin: 0 0 10px 0; color: #a78bfa;">Message:</h3>
            <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
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

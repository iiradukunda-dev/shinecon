import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body.email?.toLowerCase();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Return a successful response even if the user doesn't exist to prevent email enumeration
      return NextResponse.json({
        success: true,
        message: 'If the email exists, a reset code has been sent.'
      });
    }

    // Generate 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // Invalidate old tokens for this user
    await prisma.passwordReset.deleteMany({
      where: { userId: user.id }
    });

    // Save new token
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: code,
        expiresAt,
        used: false
      }
    });

    let transporter;
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_PORT == 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      // Fallback to Ethereal email for testing without credentials
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.warn("⚠️ Using Ethereal Email (test credentials) since SMTP environment variables are missing.");
    }

    const info = await transporter.sendMail({
      from: '"SM Connect Support" <noreply@smconnect.com>',
      to: email,
      subject: 'Your Password Reset Code',
      text: `Your password reset code is: ${code}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p style="color: #555; font-size: 16px;">You recently requested to reset your password. Use the following 6-digit code to complete the process:</p>
          <div style="background-color: #f4f4f4; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #D4A843;">${code}</span>
          </div>
          <p style="color: #888; font-size: 14px;">This code will expire in 15 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `
    });

    console.log(`✉️ Email sent! Message ID: ${info.messageId}`);
    if (!process.env.SMTP_HOST) {
      console.log(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return NextResponse.json({
      success: true,
      message: 'If the email exists, a reset code has been sent.',
      testUrl: !process.env.SMTP_HOST ? nodemailer.getTestMessageUrl(info) : null
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

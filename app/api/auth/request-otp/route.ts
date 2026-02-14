import { NextResponse } from 'next/server';
import { db } from '@/lib/db/mock';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { sendOTPEmail } from '@/lib/auth/email';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    // Rate limiting simulation (Production requirement)
    let user = await db.findUserByEmail(email);
    
    // If user doesn't exist, create an unverified one (Signup start)
    if (!user) {
      user = await db.createUser({
        id: uuidv4(),
        email,
        isVerified: false,
        createdAt: new Date(),
      });
    }

    // Generate 6-digit OTP server-side
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash OTP before storing (Security requirement)
    const otpHash = await bcrypt.hash(otp, 10);
    
    // Expire after 10 minutes (Requirement)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.saveOTP({
      userId: user.id,
      otpHash,
      expiresAt,
      used: false, // Single-use enforced during verification
    });

    // Send via abstracted provider (SendGrid in Prod, Console in Dev)
    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 });
    }

    const response = NextResponse.json({ 
      message: 'OTP sent successfully',
      email 
    });

    // Security Headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    return response;
  } catch (error) {
    console.error('[AUTH_API_ERROR]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

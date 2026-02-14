import { NextResponse } from 'next/server';
import { db } from '@/lib/db/mock';
import bcrypt from 'bcryptjs';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, SessionData } from '@/lib/auth/session';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) return NextResponse.json({ error: 'Email and OTP required' }, { status: 400 });

    const user = await db.findUserByEmail(email);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const storedOtp = await db.getOTP(user.id);
    if (!storedOtp || storedOtp.used || storedOtp.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
    }

    const isOtpValid = await bcrypt.compare(otp, storedOtp.otpHash);
    if (!isOtpValid) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
    }

    // Mark OTP used and verify user
    await db.markOTPUsed(user.id);
    await db.updateUserVerification(email, true);

    // Create secure session
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    session.user = { id: user.id, email: user.email, isVerified: true };
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({ 
      message: 'Login successful', 
      user: session.user 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

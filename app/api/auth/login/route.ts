import { NextResponse } from 'next/server';
import { db } from '@/lib/db/mock';
import bcrypt from 'bcryptjs';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, SessionData } from '@/lib/auth/session';

export async function POST(req: Request) {
  try {
    const { email, password, otp } = await req.json();
    const user = await db.findUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (password) {
      const isValid = await bcrypt.compare(password, user.passwordHash || '');
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
    } else if (otp) {
      const storedOtp = await db.getOTP(user.id);
      if (!storedOtp || storedOtp.used || storedOtp.expiresAt < new Date()) {
        return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
      }
      const isOtpValid = await bcrypt.compare(otp, storedOtp.otpHash);
      if (!isOtpValid) {
        return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
      }
      await db.markOTPUsed(user.id);
    } else {
      return NextResponse.json({ error: 'Password or OTP required' }, { status: 400 });
    }

    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    session.user = { id: user.id, email: user.email, isVerified: user.isVerified };
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({ message: 'Logged in successfully', user: session.user });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

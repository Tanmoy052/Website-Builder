import { NextResponse } from 'next/server';
import { db } from '@/lib/db/mock';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = {
      id: uuidv4(),
      email,
      passwordHash,
      isVerified: false,
      createdAt: new Date(),
    };

    await db.createUser(newUser);

    // In a real app, send OTP here
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    
    await db.saveOTP({
      userId: newUser.id,
      otpHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
      used: false,
    });

    console.log(`OTP for ${email}: ${otp}`); // For development

    return NextResponse.json({ 
      message: 'User created. Please verify with OTP sent to your email.',
      userId: newUser.id 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

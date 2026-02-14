import { NextResponse } from "next/server";
import { db } from "@/lib/db/mock";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email)
      return NextResponse.json({ error: "Email required" }, { status: 400 });

    // Rate limiting simulation (Production requirement)
    // In a real app, use Redis or DB to track attempts per IP/Email

    let user = await db.findUserByEmail(email);

    // If user doesn't exist, create an unverified one (Signup start)
    if (!user) {
      user = await db.createUser({
        id: crypto.randomUUID(),
        email,
        isVerified: false,
        createdAt: new Date(),
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    await db.saveOTP({
      userId: user.id,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 mins expiry
      used: false,
    });

    console.log(`[SECURITY] OTP for ${email}: ${otp}`);

    const response = NextResponse.json({
      message: "OTP sent successfully",
      email,
    });

    // Security Headers
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

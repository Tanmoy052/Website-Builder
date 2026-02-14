import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, SessionData } from '@/lib/auth/session';

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  
  if (!session.isLoggedIn) {
    return NextResponse.json({ isLoggedIn: false }, { status: 200 });
  }

  return NextResponse.json(session);
}

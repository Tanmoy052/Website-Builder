import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, SessionData } from '@/lib/auth/session';
import { db } from '@/lib/db/mock';

export async function GET() {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    
    if (!session.isLoggedIn || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const history = await db.getUserHistory(session.user.id);
    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

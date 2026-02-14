import { NextResponse } from 'next/server';
import { aiProvider } from '@/lib/ai/provider';

export async function POST(req: Request) {
  try {
    const { prompt, model } = await req.json();
    const result = await aiProvider.generateWebsite(prompt, model);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Generate API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // In a real production app, you would upload to S3 or similar
    // For this studio clone, we'll just return success and file info
    return NextResponse.json({ 
      success: true, 
      filename: file.name,
      size: file.size,
      type: file.type
    });
  } catch (error) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

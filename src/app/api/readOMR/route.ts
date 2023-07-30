import { sendFile } from '@/app/services/sendFile';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  const form = await req.formData();
  const file = form.get('file') as Blob;

  if (!file) {
    return new Response('No file provided', { status: 400 });
  }

  console.log('>>> file: ');

  return sendFile(file).then((data) => NextResponse.json(data));
}

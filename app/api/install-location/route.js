import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Only allowed in development' }, { status: 403 });
  }

  const folderPath = path.join(process.cwd(), 'backups');

  return NextResponse.json({ path: folderPath });
}
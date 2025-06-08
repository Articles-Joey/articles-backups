import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(req) {
  try {
    const { localPath, s3Uri } = await req.json();
    if (!localPath || !s3Uri) {
      return NextResponse.json({ error: 'Missing localPath or s3Uri' }, { status: 400 });
    }
    // Use AWS CLI to upload file or folder
    // If localPath is a directory, use --recursive
    const isDir = localPath.endsWith('/') || localPath.endsWith('\\');
    const recursiveFlag = isDir ? '--recursive' : '';
    const command = `aws s3 cp "${localPath}" "${s3Uri}" ${recursiveFlag}`;
    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      return NextResponse.json({ error: stderr }, { status: 500 });
    }
    return NextResponse.json({ success: true, output: stdout });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

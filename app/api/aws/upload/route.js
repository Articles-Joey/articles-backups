import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(req) {
  try {
    let { localPath, s3Uri, templatePath } = await req.json();

    if (!localPath || !s3Uri) {
      return NextResponse.json({ error: 'Missing localPath or s3Uri' }, { status: 400 });
    }

    // Normalize slashes
    localPath = localPath.replace(/\\/g, '/');
    s3Uri = s3Uri.replace(/\\/g, '/');

    // Ensure s3Uri starts with s3://
    if (!s3Uri.startsWith('s3://')) {
      return NextResponse.json({ error: 'Must start with s3://' }, { status: 400 });
      // s3Uri = `s3://${s3Uri}`;
    }

    // Add --recursive if it's a folder
    // const isDir = localPath.endsWith('/');
    // const recursiveFlag = isDir ? '--recursive' : '';

    const command = `aws s3 cp "${localPath}" "${s3Uri}${templatePath.replace(/\\/g, '/')}" --recursive`;
    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      return NextResponse.json({ error: stderr }, { status: 500 });
    }

    return NextResponse.json({ success: true, output: stdout });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

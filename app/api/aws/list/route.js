import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(req) {
  try {
    let { s3Uri } = await req.json();
    if (!s3Uri) {
      return NextResponse.json({ error: 'Missing s3Uri' }, { status: 400 });
    }
    // Normalize slashes
    s3Uri = s3Uri.replace(/\\/g, '/');
    // Ensure s3Uri starts with s3://
    if (!s3Uri.startsWith('s3://')) {
      return NextResponse.json({ error: 'Must start with s3://' }, { status: 400 });
    }
    // Extract bucket name from s3Uri
    const match = s3Uri.match(/^s3:\/\/([^\/]+)\/?(.*)$/);
    if (!match) {
      return NextResponse.json({ error: 'Invalid s3Uri format' }, { status: 400 });
    }
    const bucket = match[1];
    const prefix = match[2] || '';
    // Use aws s3api list-objects-v2 for JSON output
    let command = `aws s3api list-objects-v2 --bucket "${bucket}" --output json`;
    if (prefix) {
      command += ` --prefix "${prefix}"`;
    }
    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      return NextResponse.json({ error: stderr }, { status: 500 });
    }
    let data;
    try {
      data = JSON.parse(stdout);
    } catch (e) {
      return NextResponse.json({ error: 'Failed to parse AWS output as JSON' }, { status: 500 });
    }
    const files = (data.Contents || []).filter(obj => !obj.Key.endsWith('/')).map(obj => ({
      key: obj.Key,
      lastModified: obj.LastModified,
      size: obj.Size,
      sizeUnit: 'bytes'
    }));
    return NextResponse.json({ success: true, files });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

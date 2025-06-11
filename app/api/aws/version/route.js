import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(req) {
  try {

    // let { s3Uri } = await req.json();

    let command = `aws --version`;

    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      return NextResponse.json({ error: stderr }, { status: 500 });
    }
    let data;

    console.log(stdout)

    try {
      data = stdout
    } catch (e) {
      return NextResponse.json({ error: 'Failed to parse AWS output as JSON' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

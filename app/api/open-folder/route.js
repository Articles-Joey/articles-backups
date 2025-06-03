import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function GET(req) {
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Only allowed in development' }, { status: 403 });
    }

    const {
        folderPath
    } = Object.fromEntries(req.nextUrl.searchParams)

    if (!folderPath) {
        return NextResponse.json({ error: 'Need folderPath' }, { status: 400 });
    }

    // const folderPath = path.join('backups');

    // Platform-specific command
    const openCommand = process.platform === 'win32'
        ? `start "" "${folderPath}"`
        : process.platform === 'darwin'
            ? `open "${folderPath}"`
            : `xdg-open "${folderPath}"`; // Linux

    exec(openCommand, (err) => {
        if (err) {
            console.error('Failed to open folder:', err);
        }
    });

    return NextResponse.json({ success: true, opened: folderPath });
}
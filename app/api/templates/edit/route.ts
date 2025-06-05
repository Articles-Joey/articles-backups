import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function POST(req: Request) {
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
    }

    try {
        const { fileName, locations } = await req.json();

        if (
            !fileName || typeof fileName !== 'string' ||
            !Array.isArray(locations)
        ) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const templatesDir = path.join(process.cwd(), 'backup-templates');
        const filePath = path.join(templatesDir, fileName);

        // Security check: ensure filePath stays within the directory
        if (!filePath.startsWith(templatesDir)) {
            return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
        }

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'File does not exist' }, { status: 404 });
        }

        let currentData: Record<string, any> = {};
        try {
            currentData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        } catch (err) {
            return NextResponse.json({ error: 'Invalid JSON content' }, { status: 500 });
        }

        currentData.locations = locations;

        fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), 'utf-8');

        return NextResponse.json({ success: true, file: fileName });
    } catch (err: any) {
        console.error('Update error:', err);
        return NextResponse.json({ error: 'Failed to update locations' }, { status: 500 });
    }
}

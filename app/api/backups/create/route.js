import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req) {

    const body = await req.json();
    const {
        name,
        backupTemplate,
        downloadLocation
    } = body;

    // return NextResponse.json(
    //     {
    //         error: backupTemplate,
    //         downloadLocation: downloadLocation
    //     },
    //     { status: 500 }
    // );

    try {
        // Get current date and time
        const now = new Date();
        let folderName = ''
        // folderName = `${backupTemplate.name} - `
        folderName += now
            .toISOString()
            .replace(/T/, '_')
            .replace(/:/g, '-')
            .replace(/\..+/, '');

        // const backupsDir = path.join(process.cwd(), `${backupTemplate.name}`);
        const backupsDir = path.join(downloadLocation, `${backupTemplate.name}`);

        const newFolderPath = path.join(backupsDir, folderName);

        // Ensure the backups directory exists
        if (!fs.existsSync(backupsDir)) {
            fs.mkdirSync(backupsDir);
        }

        // Create the new folder
        fs.mkdirSync(newFolderPath);

        // Create a details.json file inside it
        const details = {
            encrypted: "true",
            encryption_method: "SHA-512",
            version: "1.0.0",
            createdAt: now.toISOString(),
            size: 100000,
            name: backupTemplate.name,
            date: new Date()
        };

        const detailsPath = path.join(newFolderPath, 'details.json');
        fs.writeFileSync(detailsPath, JSON.stringify(details, null, 2));

        return NextResponse.json({ message: 'Backup folder created', folder: newFolderPath });
    } catch (error) {
        console.error('Error creating backup folder:', error);
        return NextResponse.json({ error: 'Failed to create backup folder' }, { status: 500 });
    }
}
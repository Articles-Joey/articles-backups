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

    try {
        const now = new Date();
        let folderName = now
            .toISOString()
            .replace(/T/, '_')
            .replace(/:/g, '-')
            .replace(/\..+/, '');

        const backupsDir = path.join(downloadLocation, backupTemplate.name);
        const newFolderPath = path.join(backupsDir, folderName);

        // Ensure the backups directory exists
        if (!fs.existsSync(backupsDir)) {
            fs.mkdirSync(backupsDir, { recursive: true });
        }

        // Create the new folder
        fs.mkdirSync(newFolderPath, { recursive: true });

        // Copy contents of backupTemplate.locations[0] to newFolderPath/data
        const sourceFolder = backupTemplate.locations[0];
        const targetDataFolder = path.join(newFolderPath, 'data');

        copyFolderRecursiveSync(sourceFolder, targetDataFolder);

        const preCompressionSize = getFolderSizeSync(sourceFolder);


        // Create details.json
        const details = {
            // encrypted: "true",
            // encryption_method: "SHA-512",
            version: "1.0.0",
            createdAt: now.toISOString(),
            size: preCompressionSize,
            preCompressionSize: preCompressionSize,
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

// Add this utility to get folder size
function getFolderSizeSync(folderPath) {
    let totalSize = 0;

    const entries = fs.readdirSync(folderPath, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(folderPath, entry.name);

        if (entry.isDirectory()) {
            totalSize += getFolderSizeSync(fullPath);
        } else {
            const stats = fs.statSync(fullPath);
            totalSize += stats.size;
        }
    }

    return totalSize;
}

// Utility function to copy a folder recursively
function copyFolderRecursiveSync(source, target) {
    if (!fs.existsSync(source)) return;

    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }

    const entries = fs.readdirSync(source, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(source, entry.name);
        const destPath = path.join(target, entry.name);

        if (entry.isDirectory()) {
            copyFolderRecursiveSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}
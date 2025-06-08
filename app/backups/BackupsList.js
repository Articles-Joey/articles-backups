import { useBackups } from "@/components/hooks/useBackups";
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Chip,
} from "@mui/material";
import { format } from "date-fns";
import { filesize } from "filesize";
import { useState } from "react";

import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { useInstallLocation } from "@/components/hooks/useInstallLocation";

export default function BackupsList() {
    const {
        data: backups,
        isLoading: backupsIsLoading,
        mutate: mutateBackups,
    } = useBackups();

    return (
        <div>
            {backups.map((backup) => (
                <BackupItem
                    key={`${backup.name}-${backup.date}`}
                    backup={backup}
                    onDeleteConfirmed={mutateBackups}
                />
            ))}
        </div>
    );
}

function BackupItem({ backup, onDeleteConfirmed }) {

    const [showDetails, setShowDetails] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const {
        data: backups,
        isLoading: backupsIsLoading,
        mutate: mutateBackups,
    } = useBackups();

    const {
        data: installLocation,
        // isLoading: backupsIsLoading,
        // mutate: mutateBackups,
    } = useInstallLocation();

    const handleDelete = async () => {

        let folder_name = new Date(backup.date)
            .toISOString()
            .replace(/T/, '_')
            .replace(/:/g, '-')
            .replace(/\..+/, '');

        console.log(folder_name)

        // return

        // Example: adjust endpoint and method if needed
        await fetch(`/api/backups/delete`, {
            method: "POST",
            body: JSON.stringify({
                folderPath: `${backup.name}/${folder_name}`
            }),
            headers: { "Content-Type": "application/json" },
        });
        setConfirmDelete(false);
        onDeleteConfirmed();
    };

    const handleFavorite = async (directDetailsPath) => {

        let folder_name = new Date(backup.date)
            .toISOString()
            .replace(/T/, '_')
            .replace(/:/g, '-')
            .replace(/\..+/, '');

        console.log(folder_name)

        // return

        // Example: adjust endpoint and method if needed
        await fetch(`/api/backups/star`, {
            method: "POST",
            body: JSON.stringify({
                // folderPath: `${backup.name}/${folder_name}`
                filePath: directDetailsPath
            }),
            headers: { "Content-Type": "application/json" },
        });
        setConfirmDelete(false);
        onDeleteConfirmed();
    };

    // Extract the first two parts of the directPath (e.g., "C:\Test\123\something" -> "C:\Test\123")
    const getRootFolder = (directPath) => {
        if (!directPath) return '';
        // Normalize slashes and split
        const parts = directPath.replace(/\//g, '\\').split('\\');
        if (parts.length >= 3) {
            return `${parts[0]}\\${parts[1]}\\${parts[2]}`;
        }
        return directPath;
    };

    return (
        <Box
            sx={{ mb: 0, p: 2, borderBottom: '1px solid gray' }}
            className=""
        >
            <Box sx={{ mb: 1 }}>
                <Box sx={{ mb: 0.5 }}>
                    {backup.encrypted &&
                        <Chip size="small" label="Encrypted" color="primary" variant="outlined" />
                    }
                    {backup.compressed && (
                        <>
                            <Chip size="small" label={`${filesize(
                                backup?.compressionSize || 0,
                                { standard: "jedec" }
                            )}`} color="primary" variant="outlined" />
                            {typeof backup.size === 'number' && typeof backup.compressionSize === 'number' && backup.size > 0 && (
                                <Chip
                                    size="small"
                                    label={`-${Math.round(100 - (backup.compressionSize / backup.size) * 100)}%`}
                                    color="success"
                                    variant="outlined"
                                    sx={{ ml: 0.5 }}
                                />
                            )}
                        </>
                    )}
                    {backup.encryption_method &&
                        <Chip size="small" label={`${backup.encryption_method}`} color="primary" variant="outlined" />
                    }
                </Box>
                <div>Template Name: {backup.name}</div>
                <div>Date: {format(new Date(backup.date), "yyyy-MM-dd pp")}</div>
                <div>Size: {filesize(backup.size)}</div>
                <Box sx={{ mt: 1 }}>
                    {backup.directPath && installLocation && backup.directPath.includes(installLocation)
                        ? <Chip size="small" label="App Location" color="secondary" variant="outlined" />
                        : <>Root Folder: {backup.directPath}</>
                    }
                </Box>
            </Box>
            <Box>
                <Button
                    size="small"
                    color="warning"
                    variant="outlined"
                    onClick={() => setConfirmDelete(true)}
                    sx={{ mr: 1 }}
                >
                    Delete
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={async () => {
                        try {
                            const res = await fetch(`/api/open-folder`, {
                                method: 'POST',
                                body: JSON.stringify({
                                    folderPath: backup.directPath
                                })
                            });

                            const data = await res.json();

                            if (res.ok) {
                                console.log('Success:', data);
                            } else {
                                console.error('Error:', data.error);
                                alert(`Error: ${data.error}`);
                            }
                        } catch (err) {
                            console.error('Unexpected error:', err);
                            alert('An unexpected error occurred.');
                        }
                    }}
                >
                    <FolderOpenIcon />
                </Button>
                <Button
                    size="small"
                    color="primary"
                    variant="outlined"
                    onClick={() => setShowDetails(true)}
                >
                    Details
                </Button>
                <Button
                    size="small"
                    color="primary"
                    variant={backup.compressed ?
                        'contained'
                        :
                        'outlined'
                    }
                    onClick={async () => {
                        try {
                            const res = await fetch('/api/backups/compress', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    folderPath: backup.directPath
                                }),
                            });

                            const data = await res.json();

                            if (res.ok) {
                                console.log('Success:', data);
                                mutateBackups()
                                // alert(`Backup folder created: ${data.folder}`);
                            } else {
                                console.error('Error:', data.error);
                                alert(`Error: ${data.error}`);
                            }
                        } catch (err) {
                            console.error('Unexpected error:', err);
                            alert('An unexpected error occurred.');
                        }
                    }}
                >
                    {backup.compressed ?
                        'Compressed'
                        :
                        'Compress'
                    }
                </Button>

                {/* <Button
                    size="small"
                    color="primary"
                    variant={backup.encrypted ?
                        'contained'
                        :
                        'outlined'
                    }
                    onClick={async () => {
                        try {
                            const res = await fetch('/api/backups/encrypt', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    folderPath: backup.directPath
                                }),
                            });

                            const data = await res.json();

                            if (res.ok) {
                                console.log('Success:', data);
                                mutateBackups()
                                // alert(`Backup folder created: ${data.folder}`);
                            } else {
                                console.error('Error:', data.error);
                                alert(`Error: ${data.error}`);
                            }
                        } catch (err) {
                            console.error('Unexpected error:', err);
                            alert('An unexpected error occurred.');
                        }
                    }}
                >
                    {backup.encrypted ?
                        'Encrypted'
                        :
                        'Encrypt'
                    }
                </Button> */}

                {/* File Encrypt/Decrypt Buttons */}
                {backup.directPath && !backup.encrypted && (
                    <Button
                        size="small"
                        color="secondary"
                        variant="outlined"
                        sx={{ ml: 1 }}
                        onClick={async () => {
                            try {
                                const res = await fetch('/api/file-encrypt', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ filePath: backup.directPath }),
                                });
                                const data = await res.json();
                                if (res.ok) {
                                    alert('File encrypted!');
                                    mutateBackups();
                                } else {
                                    alert('Error: ' + data.error);
                                }
                            } catch (err) {
                                alert('Unexpected error: ' + err.message);
                            }
                        }}
                    >
                        Encrypt File
                    </Button>
                )}
                {
                // backup.directPath 
                // && 
                // backup.directPath.endsWith('.enc') 
                backup.encrypted
                && (
                    <Button
                        size="small"
                        color="secondary"
                        variant="outlined"
                        sx={{ ml: 1 }}
                        onClick={async () => {
                            try {
                                const res = await fetch('/api/file-decrypt', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ filePath: backup.directPath }),
                                });
                                const data = await res.json();
                                if (res.ok) {
                                    alert('File decrypted!');
                                    mutateBackups();
                                } else {
                                    alert('Error: ' + data.error);
                                }
                            } catch (err) {
                                alert('Unexpected error: ' + err.message);
                            }
                        }}
                    >
                        Decrypt File
                    </Button>
                )}

                <Button
                    size="small"
                    color="primary"
                    variant="outlined"
                    onClick={() => handleFavorite(backup.directDetailsPath)}
                >
                    {backup.favorite ? <StarIcon /> : <StarOutlineIcon />}
                </Button>
            </Box>

            {/* Details Modal */}
            <Dialog
                open={showDetails}
                onClose={() => setShowDetails(false)}
            >
                <DialogTitle>Backup Details</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">Name: {backup.name}</Typography>
                    <Typography variant="body2">
                        Date: {format(new Date(backup.date), "PPpp")}
                    </Typography>
                    <Typography variant="body2">Size: {filesize(backup.size)}</Typography>
                    {/* Add more detailed info if available */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDetails(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Confirm Delete Modal */}
            <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        {`Are you sure you want to delete the backup "${backup.name}"?`}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Yes, Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

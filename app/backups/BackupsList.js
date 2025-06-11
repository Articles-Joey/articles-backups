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
    Snackbar,
    Alert,
} from "@mui/material";
import { format } from "date-fns";
import { filesize } from "filesize";
import { useState } from "react";

import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { useInstallLocation } from "@/components/hooks/useInstallLocation";
import { useSiteStore } from "@/components/stores/useSiteStore";
import { useBackupsAwsS3 } from "@/components/hooks/useBackupsAwsS3";

import BackupItem from "./BackupItem";

export default function BackupsList({ backups: propBackups }) {
    const {
        data: backups,
        isLoading: backupsIsLoading,
        mutate: mutateBackups,
    } = useBackups();

    // Use propBackups if provided (for filtering), otherwise use hook
    const displayBackups = propBackups || backups;

    const awsUploadLocation = useSiteStore((state) => state.awsUploadLocation);
    const { data: awsS3List, isLoading: awsS3Loading, isError: awsS3Error } = useBackupsAwsS3(awsUploadLocation);

    return (
        <div>
            {/* AWS S3 List Output (for demonstration) */}
            {awsUploadLocation && (
                <Box sx={{ mb: 2, p: 2, borderBottom: '1px solid gray' }}>
                    <Typography variant="subtitle2">AWS S3 Files at {awsUploadLocation}:</Typography>
                    {awsS3Loading && <Typography>Loading S3 files...</Typography>}
                    {awsS3Error && <Typography color="error">Error loading S3 files</Typography>}
                    {awsS3List && Array.isArray(awsS3List) && (
                        <Box sx={{ maxHeight: 200, overflow: 'auto', background: '#222', color: '#fff', p: 1, borderRadius: 1 }}>
                            {awsS3List.length === 0 && <Typography sx={{ color: '#fff' }}>No files found.</Typography>}
                            {awsS3List.map((file, idx) => (
                                <Box key={file.key + idx} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                    <Typography sx={{ flex: 1, color: '#fff', fontSize: 13 }}>
                                        {file.key}
                                    </Typography>
                                    <Typography sx={{ color: '#aaa', fontSize: 12, ml: 2 }}>
                                        {filesize(file.size, { standard: "jedec" })}
                                    </Typography>
                                    <Typography sx={{ color: '#aaa', fontSize: 12, ml: 2 }}>
                                        {file.lastModified ? new Date(file.lastModified).toLocaleString() : ''}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            )}
            {displayBackups.map((backup, i) => (
                <BackupItem
                    key={`${backup.name}-${i}-${backup.date}`}
                    backup={backup}
                    onDeleteConfirmed={mutateBackups}
                />
            ))}
        </div>
    );
}
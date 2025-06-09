import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import StorageIcon from '@mui/icons-material/Storage';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Typography, Box, Paper, Checkbox, Tooltip, Fade } from "@mui/material";
import { useSiteStore } from "@/components/stores/useSiteStore";
import { useBackups } from "@/components/hooks/useBackups";
import { useBackupsAwsS3 } from "@/components/hooks/useBackupsAwsS3";
import { useState } from "react";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';

export default function SetupChecklist() {
    // Simulate setup state from store/hooks
    const storageLocations = useSiteStore((s) => s.storageLocations);
    const awsUploadLocation = useSiteStore((s) => s.awsUploadLocation);
    const { data: backups } = useBackups();
    const { data: awsS3List } = useBackupsAwsS3(awsUploadLocation);
    const showChecklist = useSiteStore((s) => s.showChecklist ?? true);
    const setShowChecklist = useSiteStore((s) => s.setShowChecklist ?? (() => {}));

    if (!showChecklist) {
        return (
            <div>
                <Button variant="outlined" onClick={() => setShowChecklist(true)} sx={{ mb: 3 }}>
                    Show Setup Checklist
                </Button>
            </div>
        );
    }

    // Step completion logic
    const hasLocalBackup = backups && backups.length > 0;
    const hasOffsite = storageLocations && storageLocations.length > 0;
    const hasCloud = awsS3List && Array.isArray(awsS3List) && awsS3List.length > 0;

    const steps = [
        // {
        //     label: "Local Backup",
        //     icon: <StorageIcon color={hasLocalBackup ? 'success' : 'disabled'} sx={{ fontSize: 32 }} />,
        //     checked: hasLocalBackup,
        //     description: "Create your first backup to protect your files from accidental loss.",
        //     benefit: "Ensures you always have a copy of your important data on your device.",
        // },
        // {
        //     label: "Offsite Backup",
        //     icon: <CheckCircleIcon color={hasOffsite ? 'success' : 'disabled'} sx={{ fontSize: 32 }} />,
        //     checked: hasOffsite,
        //     description: "Add a second storage location (e.g., external drive or network share).",
        //     benefit: "Protects against device failure, theft, or disasters by keeping a copy elsewhere.",
        // },
        // {
        //     label: "Cloud Backup",
        //     icon: <CloudUploadIcon color={hasCloud ? 'success' : 'disabled'} sx={{ fontSize: 32 }} />,
        //     checked: hasCloud,
        //     description: "Upload a backup to AWS S3 for maximum redundancy.",
        //     benefit: "Provides offsite, geo-redundant protection against all local risks.",
        // },
        {
            label: "3 Copies of Your Data",
            icon: <StorageIcon color={hasLocalBackup ? 'success' : 'disabled'} sx={{ fontSize: 32 }} />,
            checked: hasLocalBackup,
            description: "Keep at least three copies of your data: the original and two backups.",
            benefit: "Reduces the risk of losing data due to accidental deletion or corruption.",
        },
        {
            label: "2 Different Storage Types",
            icon: <CheckCircleIcon color={hasOffsite ? 'success' : 'disabled'} sx={{ fontSize: 32 }} />,
            checked: hasOffsite,
            description: "Store your backups on at least two different types of media or devices.",
            benefit: "Protects against device failure or media-specific issues.",
        },
        {
            label: "1 Offsite Backup",
            icon: <CloudUploadIcon color={hasCloud ? 'success' : 'disabled'} sx={{ fontSize: 32 }} />,
            checked: hasCloud,
            description: "Keep at least one backup copy offsite (e.g., in the cloud).",
            benefit: "Ensures your data survives local disasters like fire or theft.",
        },
    ];

    return (
        <Paper elevation={4} sx={{ p: 3, mb: 4, borderRadius: 3, background: 'background.paper', maxWidth: 500, position: 'relative' }}>
            <IconButton size="small" onClick={() => setShowChecklist(false)} sx={{ position: 'absolute', top: 8, right: 8 }}>
                <CloseIcon />
            </IconButton>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                <InfoOutlinedIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
                3-2-1 Setup Checklist
            </Typography>
            {steps.map((step, idx) => (
                <Box key={step.label} sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                    <Checkbox checked={step.checked} disabled sx={{ p: 0, mr: 2 }} icon={step.icon} checkedIcon={step.icon} />
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: step.checked ? 'success.main' : 'text.primary' }}>
                            {step.label}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                            {step.description}
                        </Typography>
                        <Tooltip title={step.benefit} arrow placement="right" TransitionComponent={Fade} TransitionProps={{ timeout: 400 }}>
                            <Typography variant="caption" sx={{ color: 'primary.main', cursor: 'help', textDecoration: 'underline dotted' }}>
                                Why? {step.benefit}
                            </Typography>
                        </Tooltip>
                    </Box>
                </Box>
            ))}
        </Paper>
    );
}
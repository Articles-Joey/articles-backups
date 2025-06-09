"use client";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
// import { useTheme } from "@mui/material/styles";
import { useSiteStore } from "@/components/stores/useSiteStore";
import { Box, Typography } from "@mui/material";
import { useBackups } from "./hooks/useBackups";
import { useBackupTemplates } from "./hooks/useBackupTemplates";
import { filesize } from "filesize";
import { add, format } from "date-fns";

export default function FeatureGrid() {
    // const theme = useTheme();
    // const isDark = theme.palette.mode === "dark";

    const darkMode = useSiteStore((state) => state.darkMode);

    const itemStyle = {
        borderRadius: 16,
        padding: "16px",
        background: darkMode ? "#000" : "#fff",
        color: darkMode ? "#fff" : "#111",
        boxShadow: darkMode ? '0 2px 4px rgba(255, 255, 255, 0.1)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
        textAlign: "center",
        fontWeight: 500,
        fontSize: "1.1rem",
    };

    const {
        data: backups,
        isLoading: backupsIsLoading,
        mutate: mutateBackups,
    } = useBackups();

    const {
        templates,
        isLoading: templatesIsLoading,
        // isError,
        mutate: mutateTemplates
    } = useBackupTemplates();

    const totalBackupSize = backups?.reduce((sum, backup) => sum + (backup.size || 0), 0) || 0;
    const totalCompressedSize = backups?.reduce((sum, backup) => sum + (backup.compressionSize || backup.size || 0), 0) || 0;

    const percentSaved = totalBackupSize && totalCompressedSize
        ? (((totalBackupSize - totalCompressedSize) / totalBackupSize) * 100).toFixed(1)
        : "0";

    const averageBackupSize = backups && backups.length > 0 ? totalBackupSize / backups.length : 0;

    // Calculate actual values for the last 3 features
    const cloudRedundancyCount = backups?.filter(b => b.redundantCopies && b.redundantCopies > 1).length || 0;
    const compressionOptimizedCount = backups?.filter(b => b.compressionSize && b.compressionSize < b.size).length || 0;
    const encryptionProtectedCount = backups?.filter(b => b.encrypted === true).length || 0;
    const nextBackup = format(add(new Date(), { days: 1 }), 'yyyy-MM-dd');

    // Calculate the number of unique backup locations (folders)
    const schedules = backups ? backups.map(b => b.schedule_frequency)?.length : 0;

    const stats = [
        { title: "Total Backups", value: backups?.length || 0 },
        { title: "Templates", value: templates?.length || 0 },
        { title: "Total Storage", value: `${filesize(totalBackupSize)}` },
        { title: "Saved Space", value: `${filesize(totalBackupSize - totalCompressedSize)} (${percentSaved}%)` },
        { title: "Average Backup Size", value: `${filesize(averageBackupSize)}` },
        { title: "Schedules", value: schedules },
        { title: "Cloud Redundancy", value: cloudRedundancyCount },
        { title: "Compression Optimized", value: compressionOptimizedCount },
        { title: "Encryption Protection", value: encryptionProtectedCount },
        { title: "Next Backup", value: nextBackup },
    ];

    return (
        <Box sx={{ mb: 10, mt: 5, display: 'flex', width: '100%', flexWrap: 'wrap' }}>
            {stats.map((feature, idx) => (
                <Box sx={{ width: '20%', padding: 1, position: 'relative', marginBottom: 6 }} key={idx}>
                    <Paper elevation={3} sx={itemStyle}>

                        <Typography sx={{ fontSize: 24, fontWeight: 'bold' }}>
                            {feature.value}
                        </Typography>

                        <Typography sx={{ position: "absolute", top: '80px' }}>
                            {feature.title}
                        </Typography>

                    </Paper>
                </Box>
            ))}
        </Box>
    );
}
"use client";
import { useSiteStore } from "@/components/stores/useSiteStore";
import { Switch, Box, Typography } from "@mui/material";
import { useBackupTemplates } from "@/components/hooks/useBackupTemplates";
import { format, addDays, setHours, setMinutes, isAfter, differenceInMinutes } from "date-fns";

export default function ScheduleSwitch() {
    const backupsScheduling = useSiteStore((state) => state.backupsScheduling);
    const toggleBackupsScheduling = useSiteStore((state) => state.toggleBackupsScheduling);
    const { templates } = useBackupTemplates();

    // Find the next backup time
    let nextBackupDate = null;
    if (backupsScheduling && templates && templates.length > 0) {
        const now = new Date();
        let soonest = null;
        for (const template of templates) {
            if (!template.schedule_frequency) continue;
            // For the next 30 days, check when this template will run next
            for (let i = 0; i < 30; i++) {
                let day = addDays(now, i);
                let shouldRun = false;
                if (template.schedule_frequency === 'Daily') shouldRun = true;
                else if (template.schedule_frequency === 'Weekly') shouldRun = day.getDay() === now.getDay();
                else if (template.schedule_frequency === 'Monthly') shouldRun = day.getDate() === now.getDate();
                // Add more logic for 'Custom' if needed
                if (shouldRun) {
                    let [h, m] = (template.schedule_time || '00:00').split(":");
                    let backupDate = setHours(setMinutes(new Date(day), Number(m)), Number(h));
                    if (isAfter(backupDate, now)) {
                        if (!soonest || isAfter(soonest, backupDate)) {
                            soonest = backupDate;
                        }
                        break;
                    }
                }
            }
        }
        nextBackupDate = soonest;
    }

    let nextBackupText = 'No upcoming backups';
    if (nextBackupDate) {
        const now = new Date();
        const diffMin = differenceInMinutes(nextBackupDate, now);
        const hours = Math.floor(diffMin / 60);
        const mins = diffMin % 60;
        nextBackupText = `Next backup in ${hours > 0 ? hours + ' hours and ' : ''}${mins} minutes (${format(nextBackupDate, 'PPpp')})`;
    }

    return (
        <Box
            sx={{
                width: '100%',
                height: 300,
                background: backupsScheduling ? 'rgba(0,128,0,0.5)' : 'rgba(255,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                borderRadius: 2,
                mb: 3,
                mt: 7.5,
            }}
        >
            <Box
                sx={{
                    textAlign: 'center',
                }}
                onClick={() => toggleBackupsScheduling()}
            >
                <Typography
                    variant="h6"
                    sx={{ color: '#fff', mb: 0 }}
                >
                    Backups Scheduling is {backupsScheduling ? 'Enabled' : 'Disabled'}
                </Typography>
                <Typography
                    variant="subtitle2"
                    sx={{ color: '#fff', mb: 2 }}
                >
                    {nextBackupText}
                </Typography>
            </Box>
            <Switch
                checked={backupsScheduling}
                onChange={toggleBackupsScheduling}
                color="default"
                sx={{
                    transform: 'scale(2)',
                    '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#fff',
                    },
                    '& .MuiSwitch-track': {
                        backgroundColor: backupsScheduling ? '#fff' : '#888',
                    },
                }}
            />
        </Box>
    );
}

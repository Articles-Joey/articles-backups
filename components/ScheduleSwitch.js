"use client";
import { useSiteStore } from "@/components/stores/useSiteStore";
import { Switch, Box, Typography } from "@mui/material";

export default function ScheduleSwitch() {
  const backupsScheduling = useSiteStore((state) => state.backupsScheduling);
  const toggleBackupsScheduling = useSiteStore((state) => state.toggleBackupsScheduling);

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
      <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
        Backups Scheduling is {backupsScheduling ? 'Enabled' : 'Disabled'}
      </Typography>
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

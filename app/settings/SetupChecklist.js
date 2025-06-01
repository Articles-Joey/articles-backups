import { Box } from "@mui/material";

export default function SetupChecklist() {

    return (
        <div>
            <Box
                sx={{
                    display: 'inline-block',
                    p: 1,
                    mb: 2,
                    border: '1px solid white'
                }}
            >
                <div>Checklist component</div>
                <div>1 - Backup</div>
                <div>2 - Offsite Backup</div>
                <div>3 - Cloud Backup</div>
            </Box>
        </div>
    )
}
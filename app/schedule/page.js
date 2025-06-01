import { Box, Typography } from "@mui/material";
import Next30DaysList from "./Next30DaysList";

export default function Page() {
  return (
    <div className="page">

      <Box>

        <Typography sx={{ mb: 3 }}>
          Upcoming Backups
        </Typography>

        <Next30DaysList />

      </Box>

    </div>
  );
}

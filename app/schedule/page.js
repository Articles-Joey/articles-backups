import { Box, Container, Typography } from "@mui/material";
import Next30DaysList from "./Next30DaysList";

export default function Page() {
  return (
    <div className="page">

      <Container>

        <Typography sx={{ mb: 3 }} style={{ fontWeight: 600, fontSize: "1.5rem" }}>
          Upcoming Backups
        </Typography>

        <Next30DaysList />

      </Container>

    </div>
  );
}

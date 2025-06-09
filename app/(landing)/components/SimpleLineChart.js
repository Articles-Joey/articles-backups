"use client";

import { subDays, format } from "date-fns";
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { useBackups } from "../../../components/hooks/useBackups";

const margin = { right: 24 };

export default function SimpleLineChart() {

  const {
    data: backups,
    isLoading: backupsIsLoading,
    mutate: mutateBackups,
  } = useBackups();

  // Generate last 30 days labels
  const today = new Date();
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = subDays(today, 29 - i);
    return format(d, 'yyyy-MM-dd');
  });

  // Count backups per day
  const backupCounts = days.map(day => {
    if (!backups) return 0;
    return backups.filter(b => format(new Date(b.date), 'yyyy-MM-dd') === day).length;
  });

  return (
    <LineChart
      height={300}
      series={[
        { data: backupCounts, label: 'Backups per Day' },
      ]}
      xAxis={[{ scaleType: 'point', data: days }]}
      yAxis={[{ width: 50 }]}
      margin={margin}
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
      }}
    />
  );
}
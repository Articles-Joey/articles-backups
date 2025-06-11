"use client";

import { subDays, format } from "date-fns";
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { useBackups } from "../../../components/hooks/useBackups";
import { filesize } from "filesize";

const margin = { right: 24 };

export default function LocalStorageSizeChart() {

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

  // Calculate cumulative storage size per day
  let cumulative = 0;
  const dailySizes = days.map(day => {
    if (!backups) return 0;
    // Add sizes of backups created on this day
    const daySize = backups
      .filter(b => format(new Date(b.date), 'yyyy-MM-dd') === day)
      .reduce((sum, b) => sum + (b.size || 0), 0);
    cumulative += daySize;
    return cumulative;
  });

  return (
    <LineChart
      height={300}
      series={[
              {
                data: dailySizes,
                label: 'AWS Storage Size',
                color: '#FF9900',
                valueFormatter: (v) => filesize(v),
              },
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
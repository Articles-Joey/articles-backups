import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const margin = { right: 24 };
const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  'Date A',
  'Date B',
  'Date C',
  'Date D',
  'Date E',
  'Date F',
  'Date G',
];

export default function SimpleLineChart() {
  return (
    <LineChart
      height={300}
      series={[
        { data: pData, label: 'Backup Size' },
        { data: uData, label: 'Compressed' },
      ]}
      xAxis={[{ scaleType: 'point', data: xLabels }]}
      yAxis={[{ width: 50 }]}
      margin={margin}
    />
  );
}
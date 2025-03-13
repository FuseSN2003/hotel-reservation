'use client';

import dynamic from 'next/dynamic';
import 'chart.js/auto';

const BarChart = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Bar),
  {
    ssr: false,
  }
);

interface ChartProps {
  data: {
    month: string;
    sum: number;
  }[];
}

export default function RevenueChart({ data }: ChartProps) {
  return (
    <div className="h-96 w-full">
      <BarChart
        data={{
          labels: data.map((item) => item.month),
          datasets: [
            {
              label: 'Revenue',
              data: data.map((item) => item.sum),
              backgroundColor: ['rgba(37,99,235, 0.9)', 'rgba(37,99,235, 0.5)'],
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        }}
        options={{
          responsive: true,
          aspectRatio: 3.5,
        }}
      />
    </div>
  );
}

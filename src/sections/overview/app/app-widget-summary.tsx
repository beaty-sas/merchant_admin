import { ApexOptions } from 'apexcharts';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Card, { CardProps } from '@mui/material/Card';

import { fNumber } from 'src/utils/format-number';

import Chart from 'src/components/chart';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  total: number;
  chart: {
    colors?: string[];
    series: number[];
    options?: ApexOptions;
  };
}

export default function AppWidgetSummary({ title, total, chart, sx, ...other }: Props) {
  const theme = useTheme();

  const {
    colors = [theme.palette.primary.light, theme.palette.primary.main],
    series,
    options,
  } = chart;

  const chartOptions = {
    colors: colors.map((colr) => colr[1]),
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: colors[0], opacity: 1 },
          { offset: 100, color: colors[1], opacity: 1 },
        ],
      },
    },
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '68%',
        borderRadius: 2,
      },
    },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (value: number) => fNumber(value),
        title: {
          formatter: () => '',
        },
      },
      marker: { show: false },
    },
    ...options,
  };

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="h3">{total > 0 ? fNumber(total) : '--'}</Typography>
      </Box>

      <Chart
        dir="ltr"
        type="bar"
        series={[{ data: series }]}
        options={chartOptions}
        width={60}
        height={36}
      />
    </Card>
  );
}

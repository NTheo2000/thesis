import React, { useState, useRef } from 'react';
import { Slider, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';
import CachedIcon from '@mui/icons-material/Cached';

ChartJS.register(CategoryScale, LinearScale, PointElement, Tooltip, Legend, zoomPlugin);

const getColorForValue = (value: number): string => {
  const colors = [
    '#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a',
    '#ef3b2c', '#cb181d', '#a50f15', '#67000d'
  ];
  const index = Math.min(Math.floor(value * colors.length), colors.length - 1);
  return colors[index];
};

const conformanceDistribution = [
  { range: [0, 0.1], count: 70, finalizedPercentage: 20 },
  { range: [0.1, 0.2], count: 50, finalizedPercentage: 30 },
  { range: [0.2, 0.3], count: 120, finalizedPercentage: 40 },
  { range: [0.3, 0.4], count: 150, finalizedPercentage: 50 },
  { range: [0.4, 0.5], count: 30, finalizedPercentage: 55 },
  { range: [0.5, 0.6], count: 200, finalizedPercentage: 60 },
  { range: [0.6, 0.7], count: 130, finalizedPercentage: 65 },
  { range: [0.7, 0.8], count: 120, finalizedPercentage: 70 },
  { range: [0.8, 0.9], count: 100, finalizedPercentage: 80 },
  { range: [0.9, 1], count: 80, finalizedPercentage: 90 }
];

const traces = conformanceDistribution.flatMap((group) =>
  Array.from({ length: group.count }, () => ({
    conformance: (Math.random() * (group.range[1] - group.range[0])) + group.range[0],
    lastActivity: Math.random() < (group.finalizedPercentage / 100) ? 'A_finalized' : 'B_incomplete'
  }))
);

const filterDataByThreshold = (threshold: number) => {
  return traces.filter(item => item.conformance >= threshold);
};

const prepareChartData = (filteredData: any[]) => {
  const conformanceRanges = conformanceDistribution.map((range) => {
    const tracesInRange = filteredData.filter(item => item.conformance >= range.range[0] && item.conformance < range.range[1]);

    return {
      x: (range.range[0] + range.range[1]) / 2,
      y: range.finalizedPercentage,
      r: Math.sqrt(tracesInRange.length) * 2,
      count: tracesInRange.length
    };
  });

  return {
    datasets: [
      {
        label: '',
        data: conformanceRanges,
        backgroundColor: conformanceRanges.map(range => getColorForValue(range.x)),
        borderColor: '#000000',
        borderWidth: 1,
      },
    ],
  };
};

const options = {
  scales: {
    x: {
      title: {
        display: true,
        text: 'Conformance',
      },
      min: 0,
      max: 1,
    },
    y: {
      beginAtZero: true,
      max: 100,
      title: {
        display: true,
        text: 'Percentage of Traces Ending with A_finalized',
      },
    },
  },
  plugins: {
    zoom: {
      pan: {
        enabled: true,
        mode: 'xy' as const,
      },
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true,
        },
        mode: 'xy' as const,
      },
    },
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem: any) {
          const dataItem = tooltipItem.raw;
          return `Conformance: ${dataItem.x.toFixed(2)}, ${dataItem.y.toFixed(2)}% ended with "A_finalized", ${Math.round(dataItem.count)} traces`;
        },
      },
    },
  },
  maintainAspectRatio: false,
};

const ConformanceOutcomeChart: React.FC = () => {
  const [conformance, setConformance] = useState<number>(0);
  const chartRef = useRef<any>(null);
  const navigate = useNavigate();

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setConformance(newValue as number);
  };

  const handleReset = () => {
    setConformance(0);
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  const filteredData = filterDataByThreshold(conformance);
  const chartData = prepareChartData(filteredData);

  return (
    <Box sx={{ width: 800, height: 600, margin: '0 auto', position: 'relative' }}>
      <Typography variant="h5" gutterBottom align="center">
        Bubble Chart: Conformance vs Percentage Ending with "A_finalized"
      </Typography>

      <Typography variant="h6" gutterBottom>
        Conformance Threshold
      </Typography>
      <Slider
        value={conformance}
        min={0}
        max={1}
        step={0.01}
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
        sx={{
          color: getColorForValue(conformance),
          '& .MuiSlider-thumb': {
            backgroundColor: '#000',
          },
        }}
      />
      <Typography variant="body1" gutterBottom>
        Current Conformance: {conformance.toFixed(2)}
      </Typography>

      <Button variant="contained" color="primary" onClick={handleReset} sx={{ marginBottom: 2 }}>
        Reset
      </Button>

      <Box sx={{ height: 400 }}>
        <Bubble ref={chartRef} data={chartData} options={options} />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{
            fontSize: '1.5rem',
            minWidth: '50px',
            height: '50px',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={() => navigate('/violation-guidelines')}
        >
          ←
        </Button>

        <Button
  variant="contained"
  color="primary"
  sx={{
    fontSize: '1.5rem',
    minWidth: '50px',
    height: '50px',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '8px', // Rectangular with rounded edges (similar to the other button)
  }}
  onClick={() => navigate('/')} // Navigate to the starting page
>
  <CachedIcon sx={{ fontSize: '1.5rem' }} /> {/* Use the CachedIcon */}
</Button>
 
      </Box>
    </Box>
  );
};

export default ConformanceOutcomeChart;



























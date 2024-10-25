import React, { useState, useRef } from 'react';
import { Slider, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, Tooltip, Legend, zoomPlugin);

// Function to get color based on the conformance range
const getColorForValue = (value: number): string => {
  const colors = [
    '#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a',
    '#ef3b2c', '#cb181d', '#a50f15', '#67000d'
  ];

  const index = Math.min(Math.floor(value * colors.length), colors.length - 1);
  return colors[index];
};

// New conformance distribution based on your specifications
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

// Generate traces based on the updated distribution
const traces = conformanceDistribution.flatMap((group) =>
  Array.from({ length: group.count }, () => ({
    conformance: (Math.random() * (group.range[1] - group.range[0])) + group.range[0],
    lastActivity: Math.random() < (group.finalizedPercentage / 100) ? 'A_finalized' : 'B_incomplete'
  }))
);

// Filter data based on the conformance threshold
const filterDataByThreshold = (threshold: number) => {
  return traces.filter(item => item.conformance >= threshold);
};

// Prepare bubble chart data
const prepareChartData = (filteredData: any[]) => {
  const conformanceRanges = conformanceDistribution.map((range) => {
    const tracesInRange = filteredData.filter(item => item.conformance >= range.range[0] && item.conformance < range.range[1]);

    return {
      x: (range.range[0] + range.range[1]) / 2,  // Middle of the conformance range
      y: range.finalizedPercentage,  // Use the finalized percentage directly from the dataset
      r: Math.sqrt(tracesInRange.length) * 2,  // Bubble size based on number of traces
      count: tracesInRange.length  // Number of traces in this range
    };
  });

  return {
    datasets: [
      {
        label: '',  // Empty label to remove the color box in the legend
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
        text: 'Conformance',  // X-axis label
      },
      min: 0,
      max: 1,
    },
    y: {
      beginAtZero: true,
      max: 100,  // Percent scale
      title: {
        display: true,
        text: 'Percentage of Traces Ending with A_finalized',  // Y-axis label
      },
    },
  },
  plugins: {
    zoom: {
      pan: {
        enabled: true,
        mode: 'xy' as 'xy',  // Enable panning on both axes
      },
      zoom: {
        wheel: {
          enabled: true,  // Enable zooming with the mouse wheel
        },
        pinch: {
          enabled: true,  // Enable zooming with pinch gestures
        },
        mode: 'xy' as 'xy',  // Enable zooming on both axes
      },
    },
    legend: {
      display: false,  // Hide the legend to remove the color box
    },
    tooltip: {
      callbacks: {
        label: function(tooltipItem: any) {
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
  const navigate = useNavigate(); // For navigation

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setConformance(newValue as number);
  };

  // Reset function to clear the slider and reset the zoom
  const handleReset = () => {
    setConformance(0);  // Reset conformance
    if (chartRef.current) {
      chartRef.current.resetZoom();  // Reset zoom
    }
  };

  // Filter data and prepare chart data based on conformance threshold
  const filteredData = filterDataByThreshold(conformance);
  const chartData = prepareChartData(filteredData);

  return (
    <Box sx={{ width: 800, height: 600, margin: '0 auto' }}>
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

      {/* Bubble chart for conformance vs percentage ending with "A_finalized" */}
      <Box sx={{ height: 400 }}>
        <Bubble ref={chartRef} data={chartData} options={options} />
      </Box>

      {/* Navigation Button */}
      <Box sx={{ marginTop: 4 }}>
        <Button variant="contained" color="primary" onClick={() => navigate('/heatmap-aggr')}>
          Go to HeatMap Aggregated
        </Button>
       
<Button variant="contained" color="secondary" onClick={() => navigate('/violation-guidelines')}>
  Go to Violation Guidelines
</Button>

      </Box>
    </Box>
  );
};

export default ConformanceOutcomeChart;






















import React, { useState, useRef } from 'react';
import { Slider, Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, zoomPlugin);

// Define the structure of each bin
interface Bin {
  traces: { trace: string, conformance: number }[];
  averageConformance: number;
  traceCount: number;
}

// Function to get color based on conformance level
const getColorForConformance = (conformance: number): string => {
  const colors = ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'];
  const index = Math.min(Math.floor(conformance * colors.length), colors.length - 1);
  return colors[index];
};

// Function to aggregate traces into 10 bins
const aggregateTraces = (traces: { trace: string, conformance: number }[], numBins: number = 10): Bin[] => {
  const binSize = 1 / numBins;
  const bins: Bin[] = Array(numBins).fill(null).map(() => ({
    traces: [] as { trace: string, conformance: number }[],
    averageConformance: 0,
    traceCount: 0,
  }));

  traces.forEach(({ trace, conformance }) => {
    const binIndex = Math.min(Math.floor(conformance / binSize), numBins - 1);
    bins[binIndex].traces.push({ trace, conformance });
    bins[binIndex].averageConformance += conformance;
    bins[binIndex].traceCount += 1;
  });

  // Calculate average conformance for each bin
  bins.forEach(bin => {
    if (bin.traceCount > 0) {
      bin.averageConformance /= bin.traceCount;
    }
  });

  return bins;
};

// Sample data for 1000 traces and their conformance values
const traces = Array.from({ length: 1000 }, (_, i) => `Trace ${i + 1}`);
const conformanceValues = Array.from({ length: 1000 }, () => Math.random());

const HeatMapAggr: React.FC = () => {
  const [conformance, setConformance] = useState<number>(0);
  const [selectedTraces, setSelectedTraces] = useState<number[]>([]);
  const [traceInput, setTraceInput] = useState<string>(''); // Store input text
  const chartRef = useRef<any>(null);
  const navigate = useNavigate();

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setConformance(newValue as number);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTraceInput(value);
    const traceNumbers = value
      .split(',')
      .map((num) => parseInt(num.trim()))
      .filter((num) => !isNaN(num));
    setSelectedTraces(traceNumbers);

    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  const handleResetSelection = () => {
    setSelectedTraces([]);
    setConformance(0);
    setTraceInput('');

    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  // Filter data based on conformance threshold
  const filteredData = traces
    .map((trace, index) => ({ trace, conformance: conformanceValues[index] }))
    .filter(item => item.conformance >= conformance);

  // If specific traces are selected, only show them
  let data;
  let chartOptions;

  if (selectedTraces.length > 0) {
    // Filter only the selected traces from the conformance data
    const selectedData = selectedTraces
      .map((traceNum) => ({
        trace: `Trace ${traceNum}`,
        conformance: conformanceValues[traceNum - 1], // Original trace data
      }))
      .filter((item) => item.conformance >= conformance); // Only show traces above conformance threshold

    data = {
      labels: selectedData.map((item) => item.trace),
      datasets: [
        {
          label: 'Conformance',
          data: selectedData.map((item) => item.conformance),
          backgroundColor: selectedData.map((item) => getColorForConformance(item.conformance)),
          borderColor: '#000',
          borderWidth: 1,
        },
      ],
    };

    chartOptions = {
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Traces',
          },
        },
        y: {
          beginAtZero: true,
          max: 1,
          title: {
            display: true,
            text: 'Conformance',
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (tooltipItem: any) {
              const traceLabel = tooltipItem.label;
              const conformanceValue = tooltipItem.raw;
              return `Trace: ${traceLabel}, Conformance: ${conformanceValue.toFixed(4)}`;
            },
          },
        },
        zoom: {
          pan: {
            enabled: true,
            mode: 'x' as const,
          },
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: 'x' as const,
          },
        },
        legend: {
          display: false,
        },
      },
      maintainAspectRatio: false,
    };
  } else {
    const aggregatedBins = aggregateTraces(filteredData, 10);

    data = {
      labels: aggregatedBins.map((bin) => bin.averageConformance.toFixed(2)),
      datasets: [
        {
          label: 'Traces',
          data: aggregatedBins.map((bin) => bin.traceCount),
          backgroundColor: aggregatedBins.map((bin) => getColorForConformance(bin.averageConformance)),
          borderColor: '#000',
          borderWidth: 1,
        },
      ],
    };

    chartOptions = {
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Conformance',
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Traces',
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (tooltipItem: any) {
              const binLabel = tooltipItem.label;
              const traceCount = tooltipItem.raw;
              return `Bin Avg Conformance: ${binLabel}, Traces: ${traceCount}`;
            },
          },
        },
        zoom: {
          pan: {
            enabled: true,
            mode: 'x' as const,
          },
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: 'x' as const,
          },
        },
        legend: {
          display: false,
        },
      },
      maintainAspectRatio: false,
    };
  }

  return (
    <Box sx={{ width: 800, height: 900, margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom align="center">
                Conformance Distribution
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
          color: getColorForConformance(conformance),
          '& .MuiSlider-thumb': {
            backgroundColor: '#000',
          },
        }}
      />
      <Typography variant="body1" gutterBottom>
        Current Conformance: {conformance.toFixed(2)}
      </Typography>

      <Typography variant="h6" gutterBottom>
        Enter Trace Numbers to Compare (comma-separated)
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        value={traceInput}
        onChange={handleInputChange}
        placeholder="e.g. 15, 19, 45"
        sx={{ marginBottom: 2 }}
      />

      <Button variant="contained" color="primary" onClick={handleResetSelection} sx={{ marginBottom: 2 }}>
        Reset Selections
      </Button>

      {/* Heatmap-like Bar Chart */}
      <Box sx={{ height: 500 }}>
        <Bar ref={chartRef} data={data} options={chartOptions} />
      </Box>

      {/* Navigation Button to ConformanceOutcomeChart */}
      <Box sx={{ marginTop: 4 }}>
        <Button variant="contained" color="primary" onClick={() => navigate('/conformance-outcome')}>
          Go to Conformance Outcome Chart
        </Button>
        
<Button variant="contained" color="secondary" onClick={() => navigate('/violation-guidelines')}>
  Go to Violation Guidelines
</Button>

      </Box>
    </Box>
  );
};

export default HeatMapAggr;

























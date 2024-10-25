import React, { useState, useRef } from 'react';
import { Slider, Box, Typography, TextField, Button, MenuItem, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(CategoryScale, LinearScale, LineElement, BarElement, Title, Tooltip, Legend, zoomPlugin);

const resources = Array.from({ length: 70 }, (_, i) => `Resource ${i + 1}`);
const conformanceValues = Array.from({ length: 70 }, () => Math.random());

const initialLineChartData = [
    { x: 0, y: 50000 },
    { x: 0.1, y: 45000 },
    { x: 0.2, y: 40000 },
    { x: 0.3, y: 35000 },
    { x: 0.4, y: 30000 },
    { x: 0.5, y: 25000 },
    { x: 0.6, y: 20000 },
    { x: 0.7, y: 15000 },
    { x: 0.8, y: 10000 },
    { x: 0.9, y: 5000 },
    { x: 1, y: 0 },
];

const ViolationGuidelines: React.FC = () => {
    const [conformance, setConformance] = useState<number>(0);
    const [selectedChart, setSelectedChart] = useState<string>('Resource');
    const [resourceInput, setResourceInput] = useState<string>('');
    const [selectedResources, setSelectedResources] = useState<number[]>([]);
    const [filteredLineData, setFilteredLineData] = useState(initialLineChartData);
    const chartRef = useRef<any>(null);
    const navigate = useNavigate();

    const getColorForConformance = (conformance: number): string => {
        const colors = ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'];
        const index = Math.min(Math.floor(conformance * colors.length), colors.length - 1);
        return colors[index];
    };

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        const threshold = newValue as number;
        setConformance(threshold);

        // Filter line chart data based on conformance threshold
        const filteredData = initialLineChartData.filter((point) => point.x >= threshold);
        setFilteredLineData(filteredData);
    };

    const handleChartChange = (event: any) => {
        setSelectedChart(event.target.value);
        setSelectedResources([]);
        setResourceInput('');
        setConformance(0);
        setFilteredLineData(initialLineChartData);  // Reset line chart data
    };

    const handleResourceInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setResourceInput(value);

        const resourceNumbers = value
            .split(',')
            .map((num) => parseInt(num.trim()))
            .filter((num) => !isNaN(num) && num <= 70);
        setSelectedResources(resourceNumbers);
    };

    const handleReset = () => {
        setConformance(0);
        setResourceInput('');
        setSelectedResources([]);
        setFilteredLineData(initialLineChartData); // Reset line chart data
        if (chartRef.current) {
            chartRef.current.resetZoom();
        }
    };

    // Filtered resource data
    const filteredResources = selectedResources.length > 0
        ? selectedResources.filter((resource) => conformanceValues[resource - 1] >= conformance)
        : resources.filter((_, index) => conformanceValues[index] >= conformance && conformanceValues[index] <= 1);

    const filteredConformanceValues = selectedResources.length > 0
        ? selectedResources.map((resource) => conformanceValues[resource - 1]).filter((value) => value >= conformance && value <= 1)
        : conformanceValues.filter((value) => value >= conformance && value <= 1);

    // Case Amount Line Chart Data
    const dataAmount = {
        datasets: [
            {
                label: 'Conformance',
                data: filteredLineData,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 2,
                pointRadius: 5,
            },
        ],
    };

    // Resource Bar Chart Data
    const dataResource = {
        labels: filteredResources.length > 0
            ? filteredResources.map((resource) => resource)
            : resources,
        datasets: [
            {
                label: 'Conformance',
                data: filteredConformanceValues.length > 0 ? filteredConformanceValues : conformanceValues,
                backgroundColor: filteredConformanceValues.map((value) => getColorForConformance(value)),
                borderColor: filteredConformanceValues.map(() => 'rgba(54, 162, 235, 0)'),
                borderWidth: 0,
            },
        ],
    };

    const lineChartOptions = {
        scales: {
            x: {
                type: 'linear' as const,
                title: {
                    display: true,
                    text: 'Conformance',
                },
                min: 0,
                max: 1,
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Case Amount',
                },
                ticks: {
                    callback: function (value: any) {
                        return value.toLocaleString();
                    },
                },
                suggestedMax: 50000,
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
        maintainAspectRatio: false,
    };

    const barChartOptions = {
        indexAxis: 'x' as const,
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Resources',
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
                        const resourceLabel = tooltipItem.label.replace('Resource ', '');
                        const conformanceValue = tooltipItem.raw;
                        return `Resource ${resourceLabel}, Conformance: ${conformanceValue.toFixed(3)}`;
                    },
                },
            },
            legend: {
                display: false,
            },
        },
        maintainAspectRatio: false,
    };

    return (
        <Box sx={{ width: 800, height: 900, margin: '0 auto' }}>
            <Typography variant="h5" gutterBottom align="center">
                Violation Guidelines: Conformance vs Attributes
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

            <Button variant="contained" color="primary" onClick={handleReset} sx={{ marginBottom: 2, display: 'block' }}>
                Reset
            </Button>

            <Select value={selectedChart} onChange={handleChartChange} sx={{ marginBottom: 2 }}>
                <MenuItem value="Resource">Resource</MenuItem>
                <MenuItem value="Case Amount">Case Amount</MenuItem>
            </Select>

            {selectedChart === 'Resource' && (
                <TextField
                    fullWidth
                    variant="outlined"
                    value={resourceInput}
                    onChange={handleResourceInput}
                    placeholder="Enter Resource Numbers (comma-separated, max 70)"
                    sx={{ marginBottom: 2 }}
                />
            )}

            <Box sx={{ height: 500 }}>
                {selectedChart === 'Resource' ? (
                    <Bar ref={chartRef} data={dataResource} options={barChartOptions} />
                ) : (
                    <Line ref={chartRef} data={dataAmount} options={lineChartOptions} />
                )}
            </Box>

            <Box sx={{ marginTop: 4 }}>
                <Button variant="contained" color="primary" onClick={() => navigate('/heatmap-aggr')} sx={{ marginRight: 2 }}>
                    Go to Heat Map
                </Button>
                <Button variant="contained" color="secondary" onClick={() => navigate('/conformance-outcome')}>
                    Go to Conformance Outcome Chart
                </Button>
            </Box>
        </Box>
    );
};

export default ViolationGuidelines;



    
























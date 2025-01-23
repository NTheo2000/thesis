import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useFileContext } from './FileContext';

const ActivityStats: React.FC = () => {
  const navigate = useNavigate();
  const { extractedElements } = useFileContext();

  const colors = ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'];

  const getColorForValue = (value: number) => {
    const index = Math.min(Math.floor((value / 100) * colors.length), colors.length - 1);
    return colors[index];
  };

  const activityStats = extractedElements.map((element: any) => {
    const skipped = Math.random() * 100;
    const inserted = Math.random() * 100;
    return {
      name: element.name,
      skipped,
      inserted,
      skippedFill: getColorForValue(skipped),
      insertedFill: getColorForValue(inserted),
    };
  });

  const sharedHeight = activityStats.length * 40;
  const barAreaWidth = 500;
  const yAxisWidth = 200;

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, margin: '0 auto', textAlign: 'center', padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Process Activity Analysis
      </Typography>

      <Box
        sx={{
          width: '100%',
          height: 'auto',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          backgroundColor: '#fafafa',
          padding: 4,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Detailed Activity Insights
        </Typography>
        <ul style={{ textAlign: 'left', fontSize: '1rem', maxWidth: 800, margin: '0 auto' }}>
          <li><strong>Skipped Activities:</strong> Activities that were omitted during the process execution.</li>
          <li><strong>Inserted Activities:</strong> Additional steps added beyond the original process design.</li>
        </ul>

        <Box sx={{ display: 'flex', gap: 2, marginTop: 4 }}>
          <Box>
            <Typography variant="h6" gutterBottom align="center">
              Skipped Activities
            </Typography>
            <BarChart
              width={barAreaWidth + yAxisWidth}
              height={sharedHeight}
              data={activityStats.map((stat) => ({
                ...stat,
                fill: stat.skippedFill,
              }))}
              layout="vertical"
              margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" width={yAxisWidth} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #ddd' }}
                labelStyle={{ fontWeight: 'bold' }}
                formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name]}
              />
              <Bar dataKey="skipped" name="Percentage of times Skipped" />
            </BarChart>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom align="center">
              Inserted Activities
            </Typography>
            <BarChart
              width={barAreaWidth}
              height={sharedHeight}
              data={activityStats.map((stat) => ({
                ...stat,
                fill: stat.insertedFill,
              }))}
              layout="vertical"
              margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" width={0} tick={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #ddd' }}
                labelStyle={{ fontWeight: 'bold' }}
                formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name]}
              />
              <Bar dataKey="inserted" name="Percentage of times Inserted" />
            </BarChart>
          </Box>
        </Box>
      </Box>

      <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ marginTop: 4, width: '100%' }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginLeft: 2, fontSize: '1.5rem', fontWeight: 'bold' }}
          onClick={() => navigate('/view-bpmn')}
        >
          ←
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginRight: 2, fontSize: '1.5rem', fontWeight: 'bold' }}
          onClick={() => navigate('/heatmap-aggr')}
        >
          →
        </Button>
      </Stack>
    </Box>
  );
};

export default ActivityStats;













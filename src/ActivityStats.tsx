import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { useFileContext } from './FileContext';

const colors = [
  '#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a',
  '#ef3b2c', '#cb181d', '#a50f15', '#67000d',
];

const getColorForValue = (value: number) => {
  const index = Math.min(Math.floor((value / 100) * colors.length), colors.length - 1);
  return colors[index];
};

const ActivityStats: React.FC = () => {
  const navigate = useNavigate();
  const { extractedElements } = useFileContext();

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

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 900,
        margin: '0 auto',
        backgroundColor: '#ffffff', // White background to remove grey areas
        borderRadius: '8px',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: 'center',
          margin: '0',
          padding: '16px 0', // Adjusted padding for better alignment
        }}
      >
        Activity Deviations
      </Typography>

      <Box
        sx={{
          width: '100%',
          height: 'auto',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ textAlign: 'center', margin: '16px 0' }}
        >
          Percentage of times skipped and inserted
        </Typography>

        <BarChart
          width={800}
          height={sharedHeight}
          data={activityStats}
          layout="vertical"
          margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="name" width={200} tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #ddd' }}
            labelStyle={{ fontWeight: 'bold' }}
            formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name]}
          />
          <Bar dataKey="skipped" name="Skipped">
            {activityStats.map((entry, index) => (
              <Cell key={`cell-skipped-${index}`} fill={entry.skippedFill} />
            ))}
          </Bar>
          <Bar dataKey="inserted" name="Inserted">
            {activityStats.map((entry, index) => (
              <Cell key={`cell-inserted-${index}`} fill={entry.insertedFill} />
            ))}
          </Bar>
        </BarChart>
      </Box>

      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        sx={{
          marginTop: 4, // Added extra space below the container
          padding: 0,
          position: 'relative',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{
            marginLeft: 2,
            fontSize: '1.5rem',
            fontWeight: 'bold',
            backgroundColor: '#1565c0',
            marginTop: '24px', // Move buttons further down
          }}
          onClick={() => navigate('/view-bpmn')}
        >
          ←
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{
            marginRight: 2,
            fontSize: '1.5rem',
            fontWeight: 'bold',
            backgroundColor: '#1565c0',
            marginTop: '24px', // Move buttons further down
          }}
          onClick={() => navigate('/heatmap-aggr')}
        >
          →
        </Button>
      </Stack>
    </Box>
  );
};

export default ActivityStats;























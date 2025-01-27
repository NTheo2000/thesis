import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Legend } from 'recharts';
import { useFileContext } from './FileContext';

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
    };
  });

  const sharedHeight = activityStats.length * 40;

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 900,
        margin: '0 auto',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: 'center',
          margin: '0',
          padding: '16px 0',
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
          <Legend
            verticalAlign="top"
            align="center"
            wrapperStyle={{ paddingBottom: 20 }}
          />
          <Bar dataKey="skipped" name="Skipped" fill="purple">
            {activityStats.map((entry, index) => (
              <Cell key={`cell-skipped-${index}`} fill="purple" />
            ))}
          </Bar>
          <Bar dataKey="inserted" name="Inserted" fill="#f9a825">
            {activityStats.map((entry, index) => (
              <Cell key={`cell-inserted-${index}`} fill="#f9a825" />
            ))}
          </Bar>
        </BarChart>
      </Box>

      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        sx={{
          marginTop: 4,
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
            marginTop: '24px',
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
            marginTop: '24px',
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
























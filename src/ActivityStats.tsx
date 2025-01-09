import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useFileContext } from './FileContext';

const ActivityStats: React.FC = () => {
  const navigate = useNavigate();
  const { extractedElements } = useFileContext();

  // Placeholder data for activity stats (use extractedElements when available)
  const activityStats = extractedElements.map((element: any) => ({
    name: element.name,
    skipped: Math.random() * 100, // Replace with actual skipped percentage
    inserted: Math.random() * 100, // Replace with actual inserted percentage
  }));

  // Updated colors for better visibility
  const skippedColor = "#ff6f61"; // Red-orange for skipped
  const insertedColor = "#6baed6"; // Light blue for inserted

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, margin: '0 auto', textAlign: 'center', padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Activity Statistics
      </Typography>

      <Box
        sx={{
          width: '100%',
          height: 'auto',
          border: '1px solid #ccc',
          borderRadius: '4px',
          marginTop: 2,
          overflow: 'hidden',
          padding: 4,
        }}
      >
        <BarChart
          width={1000}
          height={activityStats.length * 80}
          data={activityStats}
          layout="vertical"
          margin={{ top: 20, right: 50, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={200} />
          <Tooltip />
          <Legend />
          <Bar dataKey="skipped" fill={skippedColor} name="Skipped Activities" />
          <Bar dataKey="inserted" fill={insertedColor} name="Inserted Activities" />
        </BarChart>
      </Box>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ marginTop: 4 }}>
        <Button variant="contained" onClick={() => navigate('/view-bpmn')}>
          Back to BPMN Viewer
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate('/heatmap-aggr')}>
          View Visualizations
        </Button>
      </Stack>
    </Box>
  );
};

export default ActivityStats;





import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { useFileContext } from './FileContext';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = {
  red: { stroke: 'red', fill: 'lightpink' },
  orange: { stroke: 'orange', fill: '#FFD580' },
  green: { stroke: 'green', fill: 'lightgreen' },
};

const ViewBPMN: React.FC = () => {
  const navigate = useNavigate();
  const bpmnContainerRef = useRef<HTMLDivElement | null>(null);
  const modelerRef = useRef<BpmnModeler | null>(null);
  const { bpmnFileContent, setExtractedElements } = useFileContext();

  const [activityCounts, setActivityCounts] = useState({
    red: 0,
    orange: 0,
    green: 0,
  });

  const activityStats = {
    Activity_16j9p78: { skipped: 5, inserted: 15 },
    Activity_0h8ae1b: { skipped: 8, inserted: 18 },
    Activity_1ua672n: { skipped: 3, inserted: 12 },
    Activity_00kmeo1: { skipped: 6, inserted: 20 },
    Activity_0ect789: { skipped: 10, inserted: 25 },
    Activity_1b8fzfh: { skipped: 7, inserted: 14 },
    Activity_0v8bmmj: { skipped: 4, inserted: 18 },
    Activity_1vy44rn: { skipped: 2, inserted: 10 },
    Activity_1s7bzv0: { skipped: 9, inserted: 22 },
    Activity_12k66qk: { skipped: 6, inserted: 16 },
    Activity_1drj3wk: { skipped: 8, inserted: 19 },
  };

  const disableHoverEffects = () => {
    if (modelerRef.current) {
      const eventBus = modelerRef.current.get('eventBus') as any;
      eventBus.off('element.hover');
      eventBus.off('element.out');
    }
  };

  const highlightActivity = (activityId: string, color: { stroke: string; fill: string }) => {
    if (modelerRef.current) {
      const elementRegistry = modelerRef.current.get('elementRegistry') as any;
      const modeling = modelerRef.current.get('modeling') as any;

      const element = elementRegistry.get(activityId);
      if (element) {
        modeling.setColor([element], color);
      } else {
        console.warn(`Element with ID ${activityId} not found`);
      }
    }
  };

  const applyColors = () => {
    const redActivities = [
      'Activity_16j9p78', 'Activity_0h8ae1b', 'Activity_1ua672n', 'Activity_00kmeo1',
      'Activity_0ect789', 'Activity_1b8fzfh', 'Activity_0v8bmmj', 'Activity_1vy44rn',
      'Activity_1s7bzv0', 'Activity_12k66qk', 'Activity_1drj3wk',
    ];
    redActivities.forEach((id) => highlightActivity(id, COLORS.red));

    const orangeActivities = [
      'Activity_0y75frc', 'Activity_17dszm4', 'Activity_0y9in93', 'Activity_14fjgjx',
      'Activity_0bi3xvb', 'Activity_1ttad5g',
    ];
    orangeActivities.forEach((id) => highlightActivity(id, COLORS.orange));

    const greenActivities = [
      'Activity_0h5rfru', 'Activity_0vwot0o', 'Activity_16cyojo', 'Activity_0dkgijr',
      'Activity_1i0g780', 'Activity_1pkrvgt', 'Activity_077hrrh', 'Activity_1e3872g',
      'Activity_1q0ivgg', 'Activity_03fzalw',
    ];
    greenActivities.forEach((id) => highlightActivity(id, COLORS.green));

    setActivityCounts({
      red: redActivities.length,
      orange: orangeActivities.length,
      green: greenActivities.length,
    });
  };

  useEffect(() => {
    if (bpmnFileContent && bpmnContainerRef.current) {
      if (!modelerRef.current) {
        modelerRef.current = new BpmnModeler({
          container: bpmnContainerRef.current,
        });
      }

      modelerRef.current
        .importXML(bpmnFileContent)
        .then(() => {
          const canvas = modelerRef.current!.get('canvas') as any;
          const elementRegistry = modelerRef.current!.get('elementRegistry') as any;

          const elements = elementRegistry
            .getAll()
            .filter((element: any) => element.type === 'bpmn:Task')
            .map((element: any) => ({
              id: element.id,
              name: element.businessObject.name || 'Unnamed Task',
            }));

          setExtractedElements(elements);
          canvas.zoom('fit-viewport');
          disableHoverEffects();
          applyColors();

          // Add hover listeners for activity boxes
          const eventBus = modelerRef.current!.get('eventBus') as any;
          eventBus.on('element.hover', (event: any) => {
            const element = event.element;
            if (element.type === 'bpmn:Task') {
              const statsBox = document.createElement('div');
              statsBox.className = 'hover-stats-box';
              statsBox.style.position = 'absolute';
              statsBox.style.backgroundColor = 'rgba(0,0,0,0.8)';
              statsBox.style.color = 'white';
              statsBox.style.padding = '8px';
              statsBox.style.borderRadius = '4px';
              statsBox.style.pointerEvents = 'none';
              statsBox.style.zIndex = '1000';

              const stats = activityStats[element.id as keyof typeof activityStats] || { skipped: 0, inserted: 0 };
              statsBox.innerHTML = `
                <div>Percentage of times skipped: ${stats.skipped}%</div>
                <div>Percentage of times inserted: ${stats.inserted}%</div>
              `;

              document.body.appendChild(statsBox);

              const onMove = (mouseEvent: MouseEvent) => {
                statsBox.style.left = `${mouseEvent.pageX + 10}px`;
                statsBox.style.top = `${mouseEvent.pageY + 10}px`;
              };

              document.addEventListener('mousemove', onMove);

              eventBus.once('element.out', () => {
                document.body.removeChild(statsBox);
                document.removeEventListener('mousemove', onMove);
              });
            }
          });
        })
        .catch((error: unknown) => {
          console.error('Error rendering BPMN diagram:', error);
        });
    }

    return () => {
      if (modelerRef.current) {
        modelerRef.current.destroy();
        modelerRef.current = null;
      }
    };
  }, [bpmnFileContent, setExtractedElements]);

  const handleZoomIn = () => {
    const canvas = modelerRef.current?.get('canvas') as any;
    canvas?.zoom(canvas.zoom() + 0.2);
  };

  const handleZoomOut = () => {
    const canvas = modelerRef.current?.get('canvas') as any;
    canvas?.zoom(canvas.zoom() - 0.2);
  };

  const handleResetZoom = () => {
    const canvas = modelerRef.current?.get('canvas') as any;
    canvas?.zoom('fit-viewport');
  };

  const data = [
    { name: 'Low Conformance', value: activityCounts.red, color: COLORS.red.fill },
    { name: 'Medium Conformance', value: activityCounts.orange, color: COLORS.orange.fill },
    { name: 'High Conformance', value: activityCounts.green, color: COLORS.green.fill },
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, margin: '0 auto', textAlign: 'center', padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        BPMN File Viewer
      </Typography>

      <Box
        ref={bpmnContainerRef}
        sx={{
          position: 'relative',
          width: '100%',
          height: '600px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          marginTop: 2,
          overflow: 'hidden',
        }}
      >
        {/* Pie Chart Positioned in Bottom-Right Corner */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            width: 150,
            height: 150,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
          }}
        >
          <PieChart width={150} height={150}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label={({ value }) => value}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </Box>
      </Box>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ marginTop: 2 }}>
        <Button variant="contained" onClick={handleZoomIn}>
          Zoom In
        </Button>
        <Button variant="contained" onClick={handleZoomOut}>
          Zoom Out
        </Button>
        <Button variant="contained" onClick={handleResetZoom}>
          Reset View
        </Button>
      </Stack>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ marginTop: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/activity-stats')}
        >
          View Stats
        </Button>
      </Stack>
    </Box>
  );
};

export default ViewBPMN;




































































































































import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Stack, Tooltip, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { useFileContext } from './FileContext';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import InfoIcon from '@mui/icons-material/Info';

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
    // Red activities
    Activity_16j9p78: { skipped: 33, inserted: 15 },
    Activity_0h8ae1b: { skipped: 34, inserted: 68 },
    Activity_1ua672n: { skipped: 37, inserted: 55 },
    Activity_00kmeo1: { skipped: 6, inserted: 20 },
    Activity_0ect789: { skipped: 89, inserted: 30 },
    Activity_1b8fzfh: { skipped: 77, inserted: 60 },
    Activity_0v8bmmj: { skipped: 40, inserted: 18 },
    Activity_1vy44rn: { skipped: 2, inserted: 10 },
    Activity_1s7bzv0: { skipped: 90, inserted: 62 },
    Activity_12k66qk: { skipped: 60, inserted: 80 },
    Activity_1drj3wk: { skipped: 58, inserted: 69 },

    // Orange activities
    Activity_0y75frc: { skipped: 47, inserted: 12 },
    Activity_17dszm4: { skipped: 70, inserted: 78 },
    Activity_0y9in93: { skipped: 55, inserted: 15 },
    Activity_14fjgjx: { skipped: 60, inserted: 18 },
    Activity_0bi3xvb: { skipped: 30, inserted: 50 },
    Activity_1ttad5g: { skipped: 85, inserted: 42 },

    // Green activities
    Activity_0h5rfru: { skipped: 1, inserted: 5 },
    Activity_0vwot0o: { skipped: 55, inserted: 80 },
    Activity_16cyojo: { skipped: 11, inserted: 70 },
    Activity_0dkgijr: { skipped: 23, inserted: 63 },
    Activity_1i0g780: { skipped: 34, inserted: 95 },
    Activity_1pkrvgt: { skipped: 23, inserted: 54 },
    Activity_077hrrh: { skipped: 13, inserted: 64 },
    Activity_1e3872g: { skipped: 24, inserted: 74 },
    Activity_1q0ivgg: { skipped: 15, inserted: 53 },
    Activity_03fzalw: { skipped: 33, inserted: 84 },
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

          const eventBus = modelerRef.current!.get('eventBus') as any;
          eventBus.on('element.hover', (event: any) => {
            const element = event.element;
            if (element.type === 'bpmn:Task') {
              const statsBox = document.createElement('div');
              statsBox.className = 'hover-stats-box';
              statsBox.style.position = 'absolute';
              statsBox.style.backgroundColor = 'rgba(255,255,255,0.95)';
              statsBox.style.color = '#1565c0';
              statsBox.style.padding = '8px';
              statsBox.style.borderRadius = '4px';
              statsBox.style.pointerEvents = 'none';
              statsBox.style.zIndex = '1000';
              statsBox.style.width = '200px';

              const stats = activityStats[element.id as keyof typeof activityStats] || { skipped: 0, inserted: 0 };
              statsBox.innerHTML = `
                <div style="margin-bottom: 8px; text-align: center; font-weight: bold; color: white; background-color: black; padding: 4px; border-radius: 4px;">Activity Stats</div>
                <div style="display: flex; align-items: center;">
                  <div style="width: 70px; color: black;">Skipped:</div>
                  <div style="flex: 1; background-color: lightgray; height: 8px; margin-right: 8px;">
                    <div style="width: ${stats.skipped}%; background-color: purple; height: 100%;"></div>
                  </div>
                  <div style="color: black;">${stats.skipped}%</div>
                </div>
                <div style="display: flex; align-items: center; margin-top: 4px;">
                  <div style="width: 70px; color: black;">Inserted:</div>
                  <div style="flex: 1; background-color: lightgray; height: 8px; margin-right: 8px;">
                    <div style="width: ${stats.inserted}%; background-color: yellow; height: 100%;"></div>
                  </div>
                  <div style="color: black;">${stats.inserted}%</div>
                </div>
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
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
        <Typography variant="h4" gutterBottom>
          BPMN File Viewer
        </Typography>
        <Tooltip title="Where exactly does the process execution differ from the guideline? How does alternative behavior look like? This can relate to different control-flow relations, but also resource and data constraints. It can be explored on an event, trace, and log level. The task is similar 'Describe-Identify-Guideline Violation', but here the violation is not presented but needs to be explored by the analyst." arrow>
          <IconButton>
            <InfoIcon color="primary" />
          </IconButton>
        </Tooltip>
      </Stack>
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

      <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ marginTop: 4, width: '100%' }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginLeft: 2, fontSize: '1.5rem', fontWeight: 'bold' }}
          onClick={() => navigate('/')}
        >
          ←
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginRight: 2, fontSize: '1.5rem', fontWeight: 'bold' }}
          onClick={() => navigate('/activity-stats')}
        >
          →
        </Button>
      </Stack>
    </Box>
  );
};

export default ViewBPMN;


          

























































































































































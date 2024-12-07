import React, { useEffect, useRef } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { useFileContext } from './FileContext';

const ViewBPMN: React.FC = () => {
  const navigate = useNavigate();
  const bpmnContainerRef = useRef<HTMLDivElement | null>(null);
  const modelerRef = useRef<BpmnModeler | null>(null);
  const { bpmnFileContent, setExtractedElements } = useFileContext();

  const disableHoverEffects = () => {
    if (modelerRef.current) {
      const eventBus = modelerRef.current.get('eventBus') as any;

      // Disable hover events
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
    // Red (Critical/Rejected)
    const redActivities = [
      'Activity_16j9p78', 'Activity_0h8ae1b', 'Activity_1ua672n', 'Activity_00kmeo1',
      'Activity_0ect789', 'Activity_1b8fzfh', 'Activity_0v8bmmj', 'Activity_1vy44rn',
      'Activity_1s7bzv0', 'Activity_12k66qk', 'Activity_1drj3wk'
    ];
    redActivities.forEach(id => highlightActivity(id, { stroke: 'red', fill: 'lightpink' }));

    // Orange (In-Progress/Neutral)
    const orangeActivities = [
      'Activity_0y75frc', 'Activity_17dszm4', 'Activity_0y9in93', 'Activity_14fjgjx',
      'Activity_0bi3xvb', 'Activity_1ttad5g'
    ];
    orangeActivities.forEach(id => highlightActivity(id, { stroke: 'orange', fill: 'lightyellow' }));

    // Green (Approved/Completed)
    const greenActivities = [
      'Activity_0h5rfru', 'Activity_0vwot0o', 'Activity_16cyojo', 'Activity_0dkgijr',
      'Activity_1i0g780', 'Activity_1pkrvgt', 'Activity_077hrrh', 'Activity_1e3872g',
      'Activity_1q0ivgg', 'Activity_03fzalw'
    ];
    greenActivities.forEach(id => highlightActivity(id, { stroke: 'green', fill: 'lightgreen' }));
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

          // Extract IDs and names of all BPMN tasks
          const elements = elementRegistry
            .getAll()
            .filter((element: any) => element.type === 'bpmn:Task')
            .map((element: any) => ({
              id: element.id,
              name: element.businessObject.name || 'Unnamed Task',
            }));

          console.log('Extracted BPMN Elements:', elements);
          setExtractedElements(elements); // Store extracted elements in context

          canvas.zoom('fit-viewport');

          // Disable hover effects
          disableHoverEffects();

          // Apply colors to activities
          applyColors();
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

  return (
    <Box sx={{ width: '100%', maxWidth: 800, margin: '0 auto', textAlign: 'center', padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        BPMN File Viewer
      </Typography>

      <Box
        ref={bpmnContainerRef}
        sx={{
          width: '100%',
          height: '600px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          marginTop: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      />

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
          onClick={() => navigate('/heatmap-aggr')}
        >
          View Visualizations
        </Button>
      </Stack>
    </Box>
  );
};

export default ViewBPMN;























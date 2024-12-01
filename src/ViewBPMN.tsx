import React, { useEffect, useRef } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BpmnNavigatedViewer from 'bpmn-js/lib/NavigatedViewer';
import { useFileContext } from './FileContext';

const ViewBPMN: React.FC = () => {
  const navigate = useNavigate();
  const bpmnContainerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<BpmnNavigatedViewer | null>(null);
  const { bpmnFileContent, setExtractedElements } = useFileContext();

  useEffect(() => {
    if (bpmnFileContent && bpmnContainerRef.current) {
      if (!viewerRef.current) {
        viewerRef.current = new BpmnNavigatedViewer({
          container: bpmnContainerRef.current,
          keyboard: { bindTo: window },
        });
      }

      viewerRef.current
        .importXML(bpmnFileContent)
        .then(() => {
          const canvas = viewerRef.current!.get('canvas') as any;
          const elementRegistry = viewerRef.current!.get('elementRegistry') as import('diagram-js/lib/core/ElementRegistry').default;

          // Extract IDs and names of all BPMN tasks
          const elements = elementRegistry
            .getAll()
            .filter((element) => element.type === 'bpmn:Task')
            .map((element) => ({
              id: element.id,
              name: element.businessObject.name || 'Unnamed Task',
            }));

          console.log('Extracted BPMN Elements:', elements);
          setExtractedElements(elements); // Store extracted elements in context

          canvas.zoom('fit-viewport');
        })
        .catch((error: unknown) => {
          console.error('Error rendering BPMN diagram:', error);
        });
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [bpmnFileContent, setExtractedElements]);

  const handleZoomIn = () => {
    const canvas = viewerRef.current?.get('canvas') as any;
    canvas.zoom(canvas.zoom() + 0.2);
  };

  const handleZoomOut = () => {
    const canvas = viewerRef.current?.get('canvas') as any;
    canvas.zoom(canvas.zoom() - 0.2);
  };

  const handleResetZoom = () => {
    const canvas = viewerRef.current?.get('canvas') as any;
    canvas.zoom('fit-viewport');
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
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate('/inductive-visual-miner')}
        >
          Inductive Visual Miner
        </Button>
      </Stack>
    </Box>
  );
};

export default ViewBPMN;













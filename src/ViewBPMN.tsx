// ViewBPMN.tsx

import React, { useEffect, useRef } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BpmnNavigatedViewer from 'bpmn-js/lib/NavigatedViewer';
import { useFileContext } from './FileContext';

const ViewBPMN: React.FC = () => {
  const navigate = useNavigate();
  const bpmnContainerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<BpmnNavigatedViewer | null>(null);
  const { bpmnFileContent } = useFileContext();

  useEffect(() => {
    if (bpmnFileContent && bpmnContainerRef.current) {
      if (!viewerRef.current) {
        viewerRef.current = new BpmnNavigatedViewer({
          container: bpmnContainerRef.current,
          keyboard: { bindTo: window },
        });
      }

      viewerRef.current.importXML(bpmnFileContent)
        .then(() => {
          const canvas = viewerRef.current!.get('canvas') as any;  // Cast to any to avoid TypeScript error
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
  }, [bpmnFileContent]);

  // Helper functions for zoom controls
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

  const handleNavigateToHeatMap = () => {
    navigate('/heatmap-aggr');
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

      {/* Zoom Controls */}
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ marginTop: 2 }}>
        <Button variant="contained" onClick={handleZoomIn}>Zoom In</Button>
        <Button variant="contained" onClick={handleZoomOut}>Zoom Out</Button>
        <Button variant="contained" onClick={handleResetZoom}>Reset View</Button>
      </Stack>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleNavigateToHeatMap} 
        sx={{ marginTop: 4 }}
      >
        View Visualizations
      </Button>
    </Box>
  );
};

export default ViewBPMN;











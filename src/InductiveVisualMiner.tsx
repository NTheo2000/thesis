import React, { useEffect, useRef } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BpmnModeler from "bpmn-js/lib/Modeler";

interface InductiveVisualMinerProps {
  bpmnFileContent: string;
}

const InductiveVisualMiner: React.FC<InductiveVisualMinerProps> = ({
  bpmnFileContent,
}) => {
  const navigate = useNavigate();
  const modelerRef = useRef<BpmnModeler | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      modelerRef.current = new BpmnModeler({
        container: containerRef.current,
      });

      if (bpmnFileContent) {
        modelerRef.current
          .importXML(bpmnFileContent)
          .then(() => {
            const canvas = modelerRef.current?.get("canvas") as any;
            const elementRegistry = modelerRef.current?.get(
              "elementRegistry"
            ) as any;
            const modeling = modelerRef.current?.get("modeling") as any;

            canvas.zoom("fit-viewport");

            // Highlight an example activity
            const exampleActivityId = "Activity_1drj3wk"; // Replace with the correct activity ID
            const element = elementRegistry.get(exampleActivityId);

            if (element) {
              modeling.setColor([element], {
                stroke: "red",
                fill: "lightpink",
              });
            }
          })
          .catch((error: unknown) =>
            console.error("Error importing BPMN diagram:", error)
          );
      }
    }

    return () => {
      if (modelerRef.current) {
        modelerRef.current.destroy();
        modelerRef.current = null;
      }
    };
  }, [bpmnFileContent]);

  const handleZoomIn = () => {
    const canvas = modelerRef.current?.get("canvas") as any;
    canvas?.zoom(canvas.zoom() + 0.2);
  };

  const handleZoomOut = () => {
    const canvas = modelerRef.current?.get("canvas") as any;
    canvas?.zoom(canvas.zoom() - 0.2);
  };

  const handleResetZoom = () => {
    const canvas = modelerRef.current?.get("canvas") as any;
    canvas?.zoom("fit-viewport");
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, margin: "0 auto", padding: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Inductive Visual Miner
      </Typography>

      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          height: "600px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          marginTop: 2,
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
          Reset Zoom
        </Button>
      </Stack>

      <Stack direction="row" justifyContent="space-between" sx={{ marginTop: 4 }}>
        <Button variant="contained" onClick={() => navigate("/view-bpmn")}>
          Back to BPMN Viewer
        </Button>
      </Stack>
    </Box>
  );
};

export default InductiveVisualMiner;





























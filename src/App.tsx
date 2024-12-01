import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FileProvider, useFileContext } from "./FileContext";
import WelcomePage from "./WelcomePage";
import ViewBPMN from "./ViewBPMN";
import InductiveVisualMiner from "./InductiveVisualMiner";
import HeatMapAggr from "./HeatMapAggr";
import ConformanceOutcomeChart from "./ConformanceOutcomeChart";
import ViolationGuidelines from "./ViolationGuidelines";

// Wrapper for InductiveVisualMiner to pass context data
const InductiveVisualMinerWithContext: React.FC = () => {
  const { bpmnFileContent } = useFileContext();
  return <InductiveVisualMiner bpmnFileContent={bpmnFileContent || ""} />;
};

const App: React.FC = () => {
  return (
    <FileProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/view-bpmn" element={<ViewBPMN />} />
          <Route path="/inductive-visual-miner" element={<InductiveVisualMinerWithContext />} />
          <Route path="/heatmap-aggr" element={<HeatMapAggr />} />
          <Route path="/conformance-outcome" element={<ConformanceOutcomeChart />} />
          <Route path="/violation-guidelines" element={<ViolationGuidelines />} />
        </Routes>
      </Router>
    </FileProvider>
  );
};

export default App;










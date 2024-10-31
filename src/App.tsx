// App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FileProvider } from './FileContext';
import WelcomePage from './WelcomePage';
import HeatMapAggr from './HeatMapAggr';
import ConformanceOutcomeChart from './ConformanceOutcomeChart';
import ViolationGuidelines from './ViolationGuidelines';
import ViewBPMN from './ViewBPMN';

const App: React.FC = () => {
  return (
    <FileProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/heatmap-aggr" element={<HeatMapAggr />} />
          <Route path="/conformance-outcome" element={<ConformanceOutcomeChart />} />
          <Route path="/violation-guidelines" element={<ViolationGuidelines />} />
          <Route path="/view-bpmn" element={<ViewBPMN />} />
        </Routes>
      </Router>
    </FileProvider>
  );
};

export default App;





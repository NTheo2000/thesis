import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeatMapAggr from './HeatMapAggr';
import ConformanceOutcomeChart from './ConformanceOutcomeChart';
import ViolationGuidelines from './ViolationGuidelines';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeatMapAggr />} />
        <Route path="/heatmap-aggr" element={<HeatMapAggr />} />
        <Route path="/conformance-outcome" element={<ConformanceOutcomeChart />} />
        <Route path="/violation-guidelines" element={<ViolationGuidelines />} />
      </Routes>
    </Router>
  );
};

export default App;


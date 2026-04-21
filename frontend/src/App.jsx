import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Landing from './pages/Landing';
import CreateSession from './pages/CreateSession';
import JoinSession from './pages/JoinSession';
import Respond from './pages/Respond';
import ThankYou from './pages/ThankYou';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-textMain selection:bg-primary/30">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/create" element={<CreateSession />} />
            <Route path="/join" element={<JoinSession />} />
            <Route path="/respond/:code" element={<Respond />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/dashboard/:code" element={<Dashboard />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;

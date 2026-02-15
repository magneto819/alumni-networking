import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<div className="p-8 text-center"><h1 className="text-2xl">页面未找到</h1></div>} />
      </Routes>
    </div>
  );
}

export default App;

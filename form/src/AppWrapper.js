import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Correct import for React Router v6
import App from './App'; // Main App component
import Preview from './Preview'; // Preview component

const AppWrapper = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} /> {/* Main Page */}
      <Route path="/preview" element={<Preview />} /> {/* Preview Page */}
    </Routes>
  );
};

export default AppWrapper;

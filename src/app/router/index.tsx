import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RectoriaPage from '../../pages/RectoriaPage';

export const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/rectoria" replace />} />
      <Route path="/rectoria" element={<RectoriaPage />} />
    </Routes>
  </BrowserRouter>
);

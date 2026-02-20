
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import App from './App';
import { LandingPage } from './components/LandingPage';

// Dev bypass: skips landing page when VITE_GEMINI_API_KEY is present in .env.local
const DevBypass: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const devKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
    if (import.meta.env.DEV && devKey) {
      navigate('/app', { replace: true, state: { apiKey: devKey, accountTier: 'PRO' } });
    }
  }, [navigate]);
  return <LandingPage />;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DevBypass />} />
        <Route path="/app" element={<App />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

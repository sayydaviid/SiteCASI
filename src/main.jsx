import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 1. Importe o BrowserRouter
import App from './App.jsx';

// Seus imports de CSS
import './index.css';
import 'leaflet/dist/leaflet.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <BrowserRouter> {/* 2. Envolva o seu componente App */}
      <App />
    </BrowserRouter>
  </StrictMode>,
);

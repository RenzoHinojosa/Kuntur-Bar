import { Profiler, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import MetricsPanel from './components/MetricsPanel.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import './index.css';
import { recordCommit } from './utils/profilerStore.js';

// PASO 1: StrictMode (doble render/efectos en dev) + Profiler para medir commits.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Profiler id="App" onRender={recordCommit}>
      {/* PASO 3: un contexto por dominio, sin "contexto gigante" */}
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Profiler>
    <MetricsPanel />
  </StrictMode>,
);

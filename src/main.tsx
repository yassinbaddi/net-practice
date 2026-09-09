// Safeguard against iframe/webview getter-only fetch property reassignment
try {
  const origFetch = window.fetch ? window.fetch.bind(window) : null;
  let _f = origFetch;
  try {
    Object.defineProperty(window, 'fetch', {
      get: () => _f,
      set: (v) => { _f = v; },
      configurable: true,
      enumerable: true,
    });
  } catch {
    try {
      Object.defineProperty(Object.getPrototypeOf(window), 'fetch', {
        get: () => _f,
        set: (v) => { _f = v; },
        configurable: true,
        enumerable: true,
      });
    } catch {}
  }
} catch {}

window.addEventListener('error', (event) => {
  if (event?.message && event.message.includes('fetch') && event.message.includes('getter')) {
    event.preventDefault?.();
    event.stopImmediatePropagation?.();
    return true;
  }
}, true);

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);

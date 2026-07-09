import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ToastProvider, ToastViewport, SmoothScroll } from '@rentalone/ui';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <SmoothScroll>
          <App />
        </SmoothScroll>
        <ToastViewport />
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

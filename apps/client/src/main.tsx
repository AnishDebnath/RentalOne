import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ToastProvider, ToastViewport, SmoothScroll } from '@camera-rental-house/ui';
import { AuthProvider } from './store/AuthContext';
import { CartProvider } from './store/CartContext';
import { FavouritesProvider } from './store/FavouritesContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <ToastViewport />
        <AuthProvider>
          <FavouritesProvider>
            <CartProvider>
              <SmoothScroll>
                <App />
              </SmoothScroll>
            </CartProvider>
          </FavouritesProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

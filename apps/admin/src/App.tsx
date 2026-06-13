import { useEffect, useState, useRef } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import Dashboard from './pages/Dashboard';
import Products from './pages/products';
import ProductForm from './pages/products/ProductForm';
import Users from './pages/users';
import UserDetail from './pages/users/detail';
import Rentals from './pages/rentals';
import RentalHistory from './pages/rentals/History';
import ReleaseReturn from './pages/release';
import ProductionHouses from './pages/houses';
import HouseDetail from './pages/houses/detail';
import HouseBooking from './pages/houses/booking';
import Staff from './pages/staff/index';
import Accounts from './pages/Accounts';
import Sidebar from './components/common/Sidebar';
import AdminNavbar from './components/common/AdminNavbar';
import {
  ADMIN_ROLE_STORAGE_KEY,
  ADMIN_TOKEN_STORAGE_KEY,
  isValidRole,
  saveAuthSession,
  saveAuthUser,
  resolveAuthAppUrl,
  clearAdminSession,
} from '@camera-rental-house/shared';
import { useToast, ScrollToTop, PageTransition } from '@camera-rental-house/ui';
import { AnimatePresence } from 'framer-motion';

const authAppUrl = resolveAuthAppUrl(import.meta.env.VITE_CLIENT_APP_URL || import.meta.env.VITE_AUTH_APP_URL);

const ProtectedRoute = ({ children, allowedRoles = ['admin'] }: { children: any; allowedRoles?: string[] }) => {
  const location = useLocation();
  const token = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
  const role = localStorage.getItem(ADMIN_ROLE_STORAGE_KEY);

  if (!token) {
    const next = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />;
  }

  if (!allowedRoles.includes(role as string)) {
    // Staff can only access rentals and release
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AUTH_PATHS = ['/login', '/auth-redirect'];

const AuthRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const toastShownRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const role = params.get('role');
    const next = params.get('next');
    const welcome = params.get('welcome');
    const userParam = params.get('user');
    const clearSession = params.get('clear_session');

    const checkRedirectLoop = (targetUrl: string) => {
      try {
        const url = new URL(targetUrl, window.location.origin);
        if (url.origin === window.location.origin) {
          return true;
        }
        return false;
      } catch (e) {
        return true;
      }
    };

    // Handle logout/clear session redirect
    if (clearSession === 'true') {
      clearAdminSession();
      
      if (checkRedirectLoop(authAppUrl)) {
        setError(`Configuration Error: Auth URL (${authAppUrl}) points back to Admin app. Please set VITE_CLIENT_APP_URL in Railway variables.`);
        return;
      }

      window.location.replace(`${authAppUrl}/login?clear_session=true`);
      return;
    }

    if (welcome === 'true' && !toastShownRef.current) {
      toastShownRef.current = true;
      addToast({
        title: 'Welcome back',
        message: 'Logged in successfully to admin portal.',
        tone: 'success'
      });
    }

    if (token && isValidRole(role)) {
      saveAuthSession(token, role);
      if (userParam) {
        try {
          const userData = JSON.parse(atob(userParam));
          saveAuthUser(userData);
        } catch (e) {
          console.error('Failed to parse user data:', e);
        }
      }
      navigate('/', { replace: true });
      return;
    }

    const requestedPath = next?.startsWith('/') ? next : '/';
    
    if (checkRedirectLoop(authAppUrl)) {
      setError(`Configuration Error: Auth URL (${authAppUrl}) is missing or invalid. Set VITE_CLIENT_APP_URL.`);
      return;
    }

    const authUrl = `${authAppUrl}/login?next=${encodeURIComponent(requestedPath)}`;
    window.location.replace(authUrl);
  }, [location.search, navigate, addToast]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-lg font-black text-ink">System Configuration Error</h2>
        <p className="mt-2 text-sm text-muted max-w-md break-all">{error}</p>
        <div className="mt-6 flex flex-col gap-3">
          <button 
            onClick={() => window.location.href = '/'}
            className="text-xs font-bold text-primary hover:underline"
          >
            Try going back to Dashboard
          </button>
          <p className="text-[10px] text-slate-400">Current App Origin: {window.location.origin}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <p className="text-sm font-bold text-muted">Redirecting to Auth Server...</p>
      </div>
    </div>
  );
};

function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthPage = AUTH_PATHS.includes(location.pathname);

  return (
    <div className="min-h-screen text-ink">
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        {!isAuthPage && (
          <>
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <AdminNavbar onOpenSidebar={() => setSidebarOpen(true)} />
          </>
        )}
        <main className={clsx(
          'relative min-h-[calc(100vh-80px)]',
          isAuthPage ? '' : 'xl:pl-72'
        )}>
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Routes location={location} key={location.pathname}>
                  <Route path="/login" element={<AuthRedirect />} />
                  <Route path="/auth-redirect" element={<AuthRedirect />} />

                  <Route
                    path="/"
                    element={
                      <ProtectedRoute allowedRoles={['admin', 'staff']}>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/products"
                    element={
                      <ProtectedRoute>
                        <Products />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/products/add"
                    element={
                      <ProtectedRoute>
                        <ProductForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/products/:id/edit"
                    element={
                      <ProtectedRoute>
                        <ProductForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/users"
                    element={
                      <ProtectedRoute>
                        <Users />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/users/:id"
                    element={
                      <ProtectedRoute>
                        <UserDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/rentals"
                    element={
                      <ProtectedRoute allowedRoles={['admin', 'staff']}>
                        <Rentals />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/rentals/history"
                    element={
                      <ProtectedRoute allowedRoles={['admin', 'staff']}>
                        <RentalHistory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/release"
                    element={
                      <ProtectedRoute allowedRoles={['admin', 'staff']}>
                        <ReleaseReturn />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/houses"
                    element={
                      <ProtectedRoute allowedRoles={['admin', 'staff']}>
                        <ProductionHouses />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/houses/:slug"
                    element={
                      <ProtectedRoute allowedRoles={['admin', 'staff']}>
                        <HouseDetail />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/houses/:slug/booking"
                    element={
                      <ProtectedRoute allowedRoles={['admin', 'staff']}>
                        <HouseBooking />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/staff"
                    element={
                      <ProtectedRoute allowedRoles={['admin', 'manager']}>
                        <Staff />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/accounts"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <Accounts />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;

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
} from '@camera-rental-house/shared';
import { useToast, ScrollToTop, PageTransition } from '@camera-rental-house/ui';
import { AnimatePresence } from 'framer-motion';

const authAppUrl = resolveAuthAppUrl(import.meta.env.VITE_AUTH_APP_URL);

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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const role = params.get('role');
    const next = params.get('next');
    const welcome = params.get('welcome');
    const userParam = params.get('user');

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
    
    // Prevent redirect loops if authAppUrl is misconfigured to point to the admin app
    try {
      const targetUrl = new URL(authAppUrl);
      if (targetUrl.origin === window.location.origin) {
        console.error('CRITICAL: VITE_AUTH_APP_URL is not configured or points to the admin app. Redirect aborted to prevent loop.');
        return;
      }
    } catch (e) {
      console.error('Invalid authAppUrl:', authAppUrl);
      return;
    }

    const authUrl = `${authAppUrl}/login?next=${encodeURIComponent(requestedPath)}`;
    window.location.replace(authUrl);
  }, [location.search, navigate, addToast]);

  return <div className="admin-shell py-10 text-sm text-muted">Redirecting to login...</div>;
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

import { useEffect, type ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Navbar from './components/common/navbar/Navbar';
import BottomNav from './components/common/navbar/BottomNav';
import Home from './pages/home';
import Category from './pages/category';
import ProductDetail from './pages/product-detail';
import Cart from './pages/cart';
import Checkout from './pages/checkout';
import Favourites from './pages/favourites';
import Account from './pages/account';
import { useAuth } from './store/AuthContext';
import { PageTransition, ScrollToTop, ErrorBoundary } from '@camera-rental-house/ui';
import { resolveAdminAppUrl } from '@camera-rental-house/shared';

const adminAppUrl = resolveAdminAppUrl(import.meta.env.VITE_ADMIN_APP_URL);

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    const next = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />;
  }

  return children;
};

function App() {
  const location = useLocation();
  const { user } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const isClearingSession = searchParams.get('clear_session') === 'true';
  const hasJustLoggedOut = searchParams.get('logged_out') === 'true';
  const authPage = isClearingSession || ['/login', '/signup'].includes(location.pathname);
  const isProductPage = location.pathname.startsWith('/product/');
  const showBottomNav = !authPage && !isProductPage;

  useEffect(() => {
    if (user && 'role' in user) {
      // Guard: never redirect during active logout flow
      if (isClearingSession || hasJustLoggedOut) {
        return;
      }

      const role = (user as any).role;
      if (role === 'admin' || role === 'staff') {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          // Broken state: user exists but token is missing. Clear it to prevent loops.
          localStorage.removeItem('camera_rental_house_user');
          window.location.reload();
          return;
        }

        // Prevent redirect loops if adminAppUrl is misconfigured to point to the client app
        try {
          const targetUrl = new URL(adminAppUrl);
          if (targetUrl.origin === window.location.origin) {
            console.error('CRITICAL: VITE_ADMIN_APP_URL is not configured or points to the client app. Redirect aborted to prevent loop.');
            return;
          }
        } catch (e) {
          console.error('Invalid adminAppUrl:', adminAppUrl);
          return;
        }

        const defaultPath = role === 'admin' ? '/' : '/rentals';
        const params = new URLSearchParams({
          token,
          role,
          next: defaultPath
        });
        window.location.replace(`${adminAppUrl}/auth-redirect?${params.toString()}`);
      }
    }
  }, [user, isClearingSession, hasJustLoggedOut]);

  return (
    <div className="relative min-h-screen text-ink">
      <ErrorBoundary>
        {/* Premium Background Layer */}
        <div className="fixed inset-0 -z-10 bg-page">
          <div className="absolute inset-0 bg-gradient-to-b from-[#E0F2FE] via-[#F8FAFC] to-white opacity-100" />
          {/* Top intensity blue glow */}
          <div className="absolute top-0 h-[800px] w-full bg-gradient-to-b from-primary/20 via-primary/5 to-transparent" />
          {/* Accent glow for texture */}
          <div className="absolute -top-[10%] left-[10%] h-[40%] w-[80%] rounded-[100%] bg-primary/10 blur-[130px]" />
        </div>
        {!authPage ? <Navbar /> : null}
        <main className={authPage ? '' : 'pb-10 pt-20 md:pt-24'}>
          <ScrollToTop />
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/category" element={<PageTransition><Category /></PageTransition>} />
              <Route path="/product/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
              <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
              <Route path="/checkout" element={<ProtectedRoute><PageTransition><Checkout /></PageTransition></ProtectedRoute>} />
              <Route path="/favourites" element={<ProtectedRoute><PageTransition><Favourites /></PageTransition></ProtectedRoute>} />
              <Route path="/account" element={<ProtectedRoute><PageTransition><Account /></PageTransition></ProtectedRoute>} />
              <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
              <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </main>
        {showBottomNav ? <BottomNav /> : null}
      </ErrorBoundary>
    </div>
  );
}

export default App;

import { Camera, Eye, EyeOff, Lock, User, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { type FormEvent, useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LoadingButton from '../components/ui/LoadingButton';
import clsx from 'clsx';
import { useAuth } from '../store/AuthContext';
import {
  resolveAdminAppUrl,
  resolveClientAppUrl,
} from '@camera-rental-house/shared';
import { useToast } from '@camera-rental-house/ui';

const adminAppUrl = resolveAdminAppUrl(import.meta.env.VITE_ADMIN_APP_URL);
const clientAppUrl = resolveClientAppUrl(import.meta.env.VITE_CLIENT_APP_URL);
const resolveClientNextPath = (requestedNext: string | null) => '/';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout } = useAuth();
  const { addToast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const isClearingSession = searchParams.get('clear_session') === 'true';
  const hasJustLoggedOut = searchParams.get('logged_out') === 'true';
  const toastShownRef = useRef(false);

  // 1. Handle cross-app session clearing (e.g. after admin logout)
  useEffect(() => {
    if (isClearingSession) {
      logout({ silent: true });
      window.location.replace(`${window.location.origin}/login?logged_out=true`);
    }
  }, [isClearingSession, logout]);

  // 2. Show post-logout confirmation toast once
  useEffect(() => {
    if (hasJustLoggedOut && !toastShownRef.current) {
      toastShownRef.current = true;
      addToast({
        title: 'Signed out',
        message: 'Your session has been securely closed.',
        tone: 'success'
      });
      navigate('/login', { replace: true });
    }
  }, [hasJustLoggedOut, addToast, navigate]);

  const validate = () => {
    const identifier = form.identifier.trim();
    if (!identifier) return "Email, phone number, or user ID is required";

    const isNumeric = /^\d+$/.test(identifier);
    const isMemberId = /^(CRH|HSE)-\d{4}-[A-Z0-9]{4,}$/i.test(identifier);
    if (isNumeric) {
      if (identifier.length !== 10) return "Phone number must be exactly 10 digits";
    } else if (!isMemberId) {
      const isEmail = /^[^\s@]+@gmail\.com$/.test(identifier);
      if (!isEmail) return "Please enter valid email, 10-digit phone number, or user ID";
    }

    if (!form.password) return "Password is required";
    return "";
  };

  const handleIdentifierChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let val = event.target.value;
    if (/^\d+$/.test(val)) val = val.slice(0, 10);
    setForm((prev) => ({ ...prev, identifier: val }));
    if (errors.identifier || errors.general) setErrors({});
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, password: event.target.value }));
    if (errors.password || errors.general) setErrors({});
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setErrors({
        general: validationError,
        identifier: (validationError.includes('Email') || validationError.includes('Phone')) ? 'error' : '',
        password: validationError.includes('Password') ? 'error' : ''
      });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const requestedNext = searchParams.get('next');
      const data = await login(form, { silent: true });

      // Handle Admin/Staff redirect to Admin portal
      if (data.user.role === 'admin' || data.user.role === 'staff') {
        const nextPath = requestedNext || '/';

        // Prevent redirect loops if adminAppUrl is misconfigured to point to the client app (root)
        try {
          const targetUrl = new URL(adminAppUrl, window.location.origin);
          const currentUrl = new URL(window.location.href);
          
          // If it's the same origin, it's ONLY a loop if it's NOT pointing to /admin
          if (targetUrl.origin === currentUrl.origin && !targetUrl.pathname.startsWith('/admin')) {
            console.error('CRITICAL: VITE_ADMIN_APP_URL points to the client app root. Redirect aborted.');
            setErrors({ general: 'System misconfiguration: Admin portal path invalid.' });
            return;
          }
        } catch (e) {
          console.error('Invalid adminAppUrl:', adminAppUrl);
          setErrors({ general: 'Invalid configuration for Admin portal.' });
          return;
        }

        const params = new URLSearchParams({
          token: data.accessToken,
          role: data.user.role,
          next: nextPath,
          welcome: 'true',
          user: btoa(JSON.stringify({
            fullName: data.user.fullName,
            avatarUrl: data.user.avatarUrl,
            username: data.user.username
          }))
        });

        window.location.replace(`${adminAppUrl}/auth-redirect?${params.toString()}`);
        return;
      }

      // Regular User redirect to Account or requested path
      navigate(resolveClientNextPath(requestedNext));
    } catch (error: any) {
      const message = error.message || "Invalid credentials. Please check your email, phone, or user ID and password.";
      setErrors({ general: message });
      addToast({ title: 'Login Failed', message, tone: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (isClearingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-sm font-bold text-ink">Signing out safely...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-[440px] relative group">
        {/* Modern Background Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/15 via-primary/5 to-primary/15 rounded-[40px] blur-xl opacity-50 transition duration-1000" />

        <div className="relative rounded-[32px] border border-white/60 bg-white/70 backdrop-blur-2xl p-6 md:p-8 shadow-2xl overflow-hidden">
          {/* Refined Back Button */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 flex h-10 w-10 items-center justify-center rounded-[14px] bg-white border border-slate-100 text-slate-500 hover:text-primary shadow-[0_8px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-all active:scale-90 z-10"
            title="Go Back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          </button>
          {/* Decorative Corner Gradient */}
          <div className="absolute -top-24 -right-24 h-48 w-48 bg-primary/10 blur-[60px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 bg-primary/5 blur-[50px] rounded-full" />

          <div className="relative mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[20px] bg-white shadow-lg ring-1 ring-black/[0.05]">
              <Camera className="h-7 w-7 text-primary" strokeWidth={1.5} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-ink leading-tight">Welcome Back</h1>
            <p className="mt-2 text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
              Ready to create your next masterpiece? Sign in to access your gear.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2">
                <User className="h-3.5 w-3.5" />
                Email, Phone, or User ID
              </label>
              <div className="relative">
                <input
                  value={form.identifier}
                  onChange={handleIdentifierChange}
                  className={clsx(
                    "w-full h-11 px-4 rounded-xl bg-white/50 border outline-none transition-all focus:ring-4 focus:ring-primary/5 placeholder:text-slate-400 text-sm",
                    errors.identifier || (errors.general && (errors.general.includes('Email') || errors.general.includes('Phone') || errors.general.includes('found')))
                      ? "border-red-400 focus:border-red-500"
                      : "border-slate-200 focus:border-primary/50"
                  )}
                  placeholder="Enter email, phone, or house ID"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5" />
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handlePasswordChange}
                  className={clsx(
                    "w-full h-11 pl-4 pr-11 rounded-xl bg-white/50 border outline-none transition-all focus:ring-4 focus:ring-primary/5 placeholder:text-slate-400 text-sm",
                    errors.password || (errors.general && errors.general.includes('Password'))
                      ? "border-red-400 focus:border-red-500"
                      : "border-slate-200 focus:border-primary/50"
                  )}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              {errors.general && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                  <div className="text-xs font-bold text-red-600 leading-tight">
                    {errors.general}
                  </div>
                </div>
              )}
              <LoadingButton
                loading={loading}
                type="submit"
                className="w-full h-11 bg-primary text-white rounded-xl font-bold shadow-md shadow-primary/10 hover:shadow-lg transition-all"
              >
                Sign In
              </LoadingButton>
            </div>
          </form>


          <div className="mt-6 pt-5 text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-px bg-slate-200" />
            <p className="text-sm text-slate-500">
              New here?{' '}
              <Link to="/signup" className={clsx(
                "font-bold transition-colors inline-flex items-center gap-1 hover:underline group/sign",
                errors.general?.includes('not found') ? "text-amber-600" : "text-primary"
              )}>
                Create Account
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/sign:translate-x-1" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

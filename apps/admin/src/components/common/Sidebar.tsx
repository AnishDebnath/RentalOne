import { useEffect, useState, memo } from 'react';
import clsx from 'clsx';
import {
  CalendarClock,
  LayoutDashboard,
  Package,
  ScanLine,
  Settings,
  Users,
  X,
  LogOut,
  Building2,
  Wallet,
  UserCog,
  History,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getAuthRole, getAuthUser, clearAdminSession, resolveAuthAppUrl } from '@camera-rental-house/shared';
import axiosInstance from '../../api/axiosInstance';
import logo from '@camera-rental-house/ui/assets/rentalone-logo.png';
import { useLenis } from '@camera-rental-house/ui';

const authAppUrl = resolveAuthAppUrl(import.meta.env.VITE_CLIENT_APP_URL || import.meta.env.VITE_AUTH_APP_URL);

const Sidebar = ({ open, onClose }) => {
  const { pathname } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (open) {
      lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.documentElement.style.overflow = '';
    }
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = '';
    };
  }, [open, lenis]);

  const role = getAuthRole();
  const user = getAuthUser();
  const isStaff = role === 'staff';
  const [staffProfile, setStaffProfile] = useState<{ full_name?: string; avatar_url?: string; role?: string } | null>(null);
  const [counts, setCounts] = useState<{ products: number; rentals: number; users: number; pendingUsers: number }>({
    products: 0,
    rentals: 0,
    users: 0,
    pendingUsers: 0,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get('/manage/me');
        setStaffProfile(data);
      } catch (err) {
        console.error('Failed to fetch staff profile:', err);
      }
    };

    const fetchCounts = async () => {
      try {
        const endpoint = isStaff ? '/manage/counts' : '/admin/dashboard';
        const { data } = await axiosInstance.get(endpoint);

        // Fetch pending users count directly from users list (same logic as stats page)
        let pendingUsers = 0;
        if (!isStaff) {
          try {
            const { data: users } = await axiosInstance.get('/admin/users');
            pendingUsers = users.filter((u: any) => !u.is_verified && !u.is_blocked).length;
          } catch (_) { }
        }

        setCounts({
          products: Number(data.totalActiveItems || 0),
          rentals: Number(data.totalActiveRentals || 0),
          users: Number(data.totalUsers || 0),
          pendingUsers,
        });
      } catch (err) {
        console.error('Sidebar counts fetch fail:', err);
      }
    };

    fetchCounts();
    fetchProfile();
  }, [isStaff]);

  const menuGroups = [
    {
      title: 'Core',
      items: [
        { label: 'Dashboard', href: '/', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Inventory & Operations',
      items: [
        {
          label: 'Products',
          href: '/products',
          icon: Package,
          adminOnly: true,
          count: counts.products > 0 ? String(counts.products) : undefined
        },
        {
          label: 'Rentals',
          href: '/rentals',
          icon: CalendarClock,
          count: counts.rentals > 0 ? String(counts.rentals) : undefined
        },
        {
          label: 'Rental History',
          href: '/rentals/history',
          icon: History,
          adminOnly: true
        },
        { label: 'Release / Return', href: '/release', icon: ScanLine },
      ],
    },
    {
      title: 'Partners & People',
      items: [
        { label: 'Production Houses', href: '/houses', icon: Building2 },
        {
          label: 'Platform Users',
          href: '/users',
          icon: Users,
          adminOnly: true,
          count: counts.pendingUsers > 0 ? String(counts.pendingUsers) : undefined
        },
        { label: 'Team Members', href: '/staff', icon: UserCog, adminOnly: true },
      ],
    },
    {
      title: 'Financials',
      items: [
        { label: 'Accounts', href: '/accounts', icon: Wallet, adminOnly: true },
      ],
    },
  ];

  return (
    <>
      <div
        className={clsx(
          'z-[1000] bg-slate-950/30 backdrop-blur-sm transition xl:hidden',
          open ? 'fixed inset-0 pointer-events-auto opacity-100' : 'hidden pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />
      <aside
        data-lenis-prevent
        className={clsx(
          'fixed inset-y-0 left-0 z-[1001] w-72 h-[100dvh] max-h-screen flex-col overscroll-contain border-r border-white/70 bg-white/[0.72] px-4 py-5 shadow-[18px_0_50px_rgba(31,41,55,0.07)] backdrop-blur-2xl transition-transform xl:flex xl:translate-x-0',
          open ? 'flex translate-x-0' : 'hidden -translate-x-full',
        )}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <Link to="/" onClick={onClose} className="flex items-center">
            <img src={logo} alt="Camera Rental House" className="h-12 w-auto object-contain" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white xl:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/40 p-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
          <div className="relative h-11 w-11 shrink-0">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-rose-100 to-sky-100 text-sm font-bold text-ink border border-white/40">
              {staffProfile?.avatar_url || user?.avatarUrl ? (
                <img src={staffProfile?.avatar_url || user?.avatarUrl} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                (staffProfile?.full_name || user?.fullName || user?.full_name)?.charAt(0) || 'A'
              )}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 shadow-sm" />
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-bold text-ink">
              {staffProfile?.full_name || user?.fullName || user?.full_name || (isStaff ? 'Staff' : 'Admin')}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted/80">
              {staffProfile?.role || user?.role || role}
            </p>
          </div>
        </div>

        <div className="flex flex-col flex-1 min-h-0">
          <nav data-lenis-prevent className="flex-1 min-h-0 space-y-7 overflow-y-auto overscroll-contain scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
            {menuGroups.map((group) => {
              const visibleItems = group.items.filter((item) => !item.adminOnly || role === 'admin');
              if (visibleItems.length === 0) return null;

              return (
                <div key={group.title} className="space-y-2">
                  <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted/50">
                    {group.title}
                  </p>
                  <div className="space-y-1">
                    {visibleItems.map((item) => {
                      const Icon = item.icon;
                      let active = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));

                      // Special case: /rentals should not be active if we are in /rentals/history
                      if (item.href === '/rentals' && pathname.startsWith('/rentals/history')) {
                        active = false;
                      }

                      // Special case: /houses should be active if we are in /house-booking
                      if (item.href === '/houses' && pathname.startsWith('/house-booking')) {
                        active = true;
                      }
                      return (
                        <Link
                          key={item.label}
                          to={item.href}
                          onClick={onClose}
                          className={clsx(
                            'flex min-h-11 items-center gap-3 rounded-xl px-4 py-2.5 text-[13px] font-bold transition-all',
                            active
                              ? 'bg-primary text-white'
                              : 'text-slate-500 hover:bg-white hover:text-ink',
                          )}
                        >
                          <Icon className={clsx('h-4.5 w-4.5 shrink-0', active ? 'text-white' : 'text-slate-400')} />
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.count && (
                            <span
                              className={clsx(
                                'inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-black tabular-nums leading-none text-center shrink-0',
                                active
                                  ? 'bg-white/20 text-white'
                                  : item.label === 'Platform Users'
                                    ? 'bg-rose-500 text-white'
                                    : 'bg-slate-100 text-slate-500',
                              )}
                            >
                              {item.count}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="pt-6 shrink-0">
            <button
              onClick={async () => {
                try {
                  await axiosInstance.post('/auth/logout');
                } catch (e) {
                  console.error('Logout request failed:', e);
                } finally {
                  clearAdminSession();
                  window.location.replace(`${authAppUrl}/login?clear_session=true`);
                }
              }}
              className="group flex w-full items-center gap-3 rounded-xl bg-rose-50 px-4 py-3 text-[13px] font-black text-rose-600 transition-all hover:bg-rose-100 hover:shadow-sm"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm transition-transform group-hover:scale-110">
                <LogOut className="h-4 w-4" />
              </div>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default memo(Sidebar);

import { useState, useEffect } from 'react';
import { Bell, Calendar, Handshake } from 'lucide-react';
import { Link } from 'react-router-dom';

import { getAuthRole, getAuthUser } from '@camera-rental-house/shared';
import axiosInstance from '../../api/axiosInstance';

const AdminNavbar = ({ onOpenSidebar }) => {
  const [formattedDate, setFormattedDate] = useState('');
  const role = getAuthRole();
  const user = getAuthUser();
  const isStaff = role === 'staff';
  const [staffProfile, setStaffProfile] = useState<{ full_name?: string; role?: string } | null>(null);

  useEffect(() => {
    setFormattedDate(
      new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    );

    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get('/manage/me');
        setStaffProfile(data);
      } catch (err) {
        console.error('Failed to fetch staff profile in navbar:', err);
      }
    };
    fetchProfile();
  }, []);

  const fullName = staffProfile?.full_name || user?.fullName || user?.full_name || (isStaff ? 'Staff' : 'Admin');
  const firstName = fullName.trim().split(/\s+/)[0];

  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/[0.58] backdrop-blur-2xl xl:pl-72">
      <div className="admin-shell flex h-20 items-center justify-between gap-4">
        {/* Left Side: Mobile toggle & logo | Desktop: Hello [First Name] */}
        <div className="flex items-center gap-6">
          {/* Mobile/Tablet Sidebar Trigger Button */}
          <div className="xl:hidden">
            <button
              type="button"
              onClick={onOpenSidebar}
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white shadow-sm transition-all duration-300 hover:bg-slate-50 hover:border-primary/20"
              aria-label="Open navigation"
            >
              <div className="flex flex-col justify-between w-5 h-3.5 transition-transform duration-300 group-hover:scale-105">
                <span className="w-5 h-0.5 bg-ink rounded-full transition-all duration-300" />
                <span className="w-3.5 h-0.5 bg-ink rounded-full transition-all duration-300 group-hover:w-5" />
                <span className="w-5 h-0.5 bg-ink rounded-full transition-all duration-300" />
              </div>
            </button>
          </div>

          {/* Desktop/Tablet Premium Typography Greeting */}
          <div className="hidden md:flex md:items-center md:gap-3.5 select-none pl-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-line text-slate-500 shadow-sm transition-all duration-300 hover:bg-slate-50">
              <Handshake className="h-5 w-5 text-amber-500 transition-all duration-300 hover:scale-110" />
            </div>
            <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1 leading-tight max-w-[240px] xl:max-w-none">
              <span className="text-[20px] font-medium text-slate-400 tracking-tight">Welcome Back,</span>
              <div className="flex items-baseline shrink-0">
                <span className="text-[20px] font-black text-ink tracking-tight">{firstName}</span>
                <span className="text-[24px] font-black text-primary leading-none ml-0.5">.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Date & Notifications */}
        <div className="flex items-center gap-4">
          {/* Desktop/Tablet Today's Date Badge Container */}
          {formattedDate && (
            <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/40 p-2 pr-3.5 shadow-sm backdrop-blur-md select-none">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-ink border border-line shadow-sm">
                <Calendar className="h-4.5 w-4.5 text-slate-500" />
              </div>
              <div className="flex flex-col gap-0.5 leading-tight text-left">
                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-muted/85">Today's Date</span>
                <span className="text-[12px] font-extrabold text-ink">{formattedDate}</span>
              </div>
            </div>
          )}

          {/* Premium vertical separator */}
          <div className="h-7 w-px bg-slate-300 mx-1" />

          {/* Notification Button */}
          <button
            type="button"
            className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition duration-300 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5 text-ink transition-transform duration-300 group-hover:rotate-12" />

            {/* Glowing active notification indicator */}
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-40"></span>
              <span className="relative flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black leading-none text-white border border-white shadow-sm">
                3
              </span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;

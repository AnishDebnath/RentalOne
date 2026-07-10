/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  LayoutDashboard,
  LayoutGrid,
  MapPin,
  ClipboardList,
  TrendingUp,
  Link2,
  QrCode,
  Shield,
  Camera,
  CheckCircle2,
  Users,
  Box,
  Bookmark,
  Calendar,
  Wrench,
  Play,
  Clock,
  User,
  Check,
  ChevronRight
} from 'lucide-react';

// --- CARD 01 SUPPORT COMPONENTS ---
function ControlPanelMockup() {
  return (
    <div className="relative w-full px-6 pb-8 md:px-8 select-none flex items-stretch gap-4 md:gap-5 mt-4">
      {/* Left Sidebar Mockup Container */}
      <div className="w-14 sm:w-16 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] py-4 flex flex-col items-center gap-3 shrink-0">
        {/* Logo Icon */}
        <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-primary to-primary-hover flex items-center justify-center shadow-md shadow-primary/20 mb-1">
          <Sparkles className="w-4 h-4 text-white" />
        </div>

        {/* Menu Items */}
        <div className="w-8 h-8 rounded-xl bg-primary-light text-primary flex items-center justify-center cursor-pointer shadow-xs">
          <LayoutGrid className="w-4 h-4" />
        </div>
        <div className="w-8 h-8 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer">
          <Box className="w-4 h-4" />
        </div>
        <div className="w-8 h-8 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer">
          <Calendar className="w-4 h-4" />
        </div>
        <div className="w-8 h-8 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer">
          <ClipboardList className="w-4 h-4" />
        </div>
        <div className="w-8 h-8 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer mt-auto">
          <Users className="w-4 h-4" />
        </div>
      </div>

      {/* Right Metrics & Spline Graph Card */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] p-4 sm:p-5 flex flex-col justify-between overflow-hidden">
        {/* Card Top Title Row */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Monthly Revenue</span>
            <span className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-none mt-1">$48,250.00</span>
          </div>

          {/* "+18.4%" custom badge */}
          <div className="px-2 py-0.5 rounded-md bg-emerald-50 text-[10px] font-bold text-emerald-600 font-mono tracking-tight flex items-center gap-1 shadow-2xs border border-emerald-100/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> +18.4%
          </div>
        </div>

        {/* Spline Wave Graph with axis labels */}
        <div className="relative h-28 w-full mt-5 flex items-end">
          {/* Axis indicators */}
          <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[8px] font-mono font-bold text-slate-400 py-1 z-10 select-none">
            <span>50k</span>
            <span>30k</span>
            <span>10k</span>
            <span>0</span>
          </div>

          {/* Spline canvas */}
          <svg className="absolute inset-y-0 right-0 left-6 h-full w-[calc(100%-24px)] overflow-visible" viewBox="0 0 280 110" preserveAspectRatio="none">
            <defs>
              <linearGradient id="spline-fill-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Gridlines */}
            <line x1="0" y1="15" x2="280" y2="15" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="50" x2="280" y2="50" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="85" x2="280" y2="85" stroke="#f1f5f9" strokeWidth="1" />

            {/* Glowing Spline Graph Curve */}
            <motion.path
              d="M 0 85 C 40 90, 70 50, 110 35 C 150 15, 190 75, 230 45 C 260 30, 270 15, 280 10"
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />

            {/* Area fill */}
            <motion.path
              d="M 0 85 C 40 90, 70 50, 110 35 C 150 15, 190 75, 230 45 C 260 30, 270 15, 280 10 L 280 110 L 0 110 Z"
              fill="url(#spline-fill-grad)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            />

            {/* Pulsing Dot */}
            <motion.circle
              cx="110"
              cy="35"
              r="4.5"
              fill="#8b5cf6"
              stroke="#ffffff"
              strokeWidth="2"
              className="shadow-md"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>

        {/* 4 Colored Capsule statuses at bottom */}
        <div className="grid grid-cols-4 gap-1.5 mt-4">
          <div className="bg-primary-light/50 border border-primary-light/50 rounded-lg py-1.5 px-1 flex items-center justify-center gap-1.5 hover:bg-primary-light transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 shadow-[0_0_4px_rgba(0,49,136,0.3)]" />
            <span className="text-[9px] font-bold text-primary font-mono tracking-tight uppercase">Active</span>
          </div>
          <div className="bg-blue-50/50 border border-blue-100/50 rounded-lg py-1.5 px-1 flex items-center justify-center gap-1.5 hover:bg-blue-50 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 shadow-[0_0_4px_#3b82f6]" />
            <span className="text-[9px] font-bold text-blue-700 font-mono tracking-tight uppercase">Booked</span>
          </div>
          <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-lg py-1.5 px-1 flex items-center justify-center gap-1.5 hover:bg-emerald-50 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_4px_#10b981]" />
            <span className="text-[9px] font-bold text-emerald-700 font-mono tracking-tight uppercase">Stock</span>
          </div>
          <div className="bg-amber-50/50 border border-amber-100/50 rounded-lg py-1.5 px-1 flex items-center justify-center gap-1.5 hover:bg-amber-50 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 shadow-[0_0_4px_#f59e0b]" />
            <span className="text-[9px] font-bold text-amber-700 font-mono tracking-tight uppercase">Dues</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CARD 02 SUPPORT COMPONENTS ---
function SmartInventoryMockup() {
  return (
    <div className="relative w-full flex-1 min-h-65 flex items-center justify-center select-none overflow-hidden pb-6">
      {/* Background concentric orbital paths */}
      <div className="absolute w-55 h-55 rounded-full border border-dashed border-slate-300/60 flex items-center justify-center">
        <div className="absolute w-37.5 h-37.5 rounded-full border border-dashed border-slate-200 flex items-center justify-center" />
      </div>

      {/* Orbiting tiny active nodes on the rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        className="absolute w-55 h-55 pointer-events-none"
      >
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400/40" />
      </motion.div>

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute w-37.5 h-37.5 pointer-events-none"
      >
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-300/60" />
      </motion.div>

      {/* Central 3D Cube Pedestal and Isometric Cube */}
      <div className="relative flex items-center justify-center z-10">
        {/* Soft white circular pedestal with elegant shadows */}
        <div className="absolute w-24 h-24 rounded-full bg-white border border-slate-100 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.06)] flex items-center justify-center backdrop-blur-xs">
          <div className="w-18 h-18 rounded-full bg-linear-to-b from-slate-50 to-white border border-slate-50 shadow-inner" />
        </div>

        {/* Isometric 3D Cube SVG */}
        <motion.div
          animate={{ y: [-4, 4, -4], rotateY: [0, 10, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-16 h-16 flex items-center justify-center"
        >
          <svg viewBox="0 0 60 68" className="w-12 h-14 overflow-visible drop-shadow-[0_10px_15px_rgba(16,185,129,0.22)]">
            <defs>
              <linearGradient id="cube-top" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="cube-left" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="cube-right" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
            {/* Top Isometric Face */}
            <polygon points="30,4 56,19 30,34 4,19" fill="url(#cube-top)" />
            {/* Left Isometric Face */}
            <polygon points="4,19 30,34 30,64 4,49" fill="url(#cube-left)" />
            {/* Right Isometric Face */}
            <polygon points="30,34 56,19 56,49 30,64" fill="url(#cube-right)" />
          </svg>
        </motion.div>
      </div>

      {/* Floating Orbital Cards */}
      {/* 1. In Stock (Top Left) */}
      <motion.div
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[4%] sm:left-[8%] bg-white border border-slate-100 rounded-xl p-2 flex items-center gap-2 sm:gap-2.5 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-200 transition-all cursor-pointer z-20"
      >
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Box className="w-4 h-4" />
        </div>
        <div className="flex flex-col pr-1 sm:pr-1.5">
          <span className="text-[11px] font-extrabold text-slate-900 tracking-tight leading-none">142</span>
          <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider font-mono mt-0.5">Available</span>
        </div>
      </motion.div>

      {/* 2. Booked (Top Right) */}
      <motion.div
        animate={{ y: [3, -3, 3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] right-[4%] sm:right-[8%] bg-white border border-slate-100 rounded-xl p-2 flex items-center gap-2 sm:gap-2.5 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-200 transition-all cursor-pointer z-20"
      >
        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Bookmark className="w-4 h-4" />
        </div>
        <div className="flex flex-col pr-1 sm:pr-1.5">
          <span className="text-[11px] font-extrabold text-slate-900 tracking-tight leading-none">38</span>
          <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider font-mono mt-0.5">Booked</span>
        </div>
      </motion.div>

      {/* 3. On Rent (Bottom Left) */}
      <motion.div
        animate={{ y: [2, -4, 2] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[10%] left-[4%] sm:left-[8%] bg-white border border-slate-100 rounded-xl p-2 flex items-center gap-2 sm:gap-2.5 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-200 transition-all cursor-pointer z-20"
      >
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Calendar className="w-4 h-4" />
        </div>
        <div className="flex flex-col pr-1 sm:pr-1.5">
          <span className="text-[11px] font-extrabold text-slate-900 tracking-tight leading-none">76</span>
          <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider font-mono mt-0.5">On Rent</span>
        </div>
      </motion.div>

      {/* 4. Maintenance (Bottom Right) */}
      <motion.div
        animate={{ y: [-2, 4, -2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[10%] right-[4%] sm:right-[8%] bg-white border border-slate-100 rounded-xl p-2 flex items-center gap-2 sm:gap-2.5 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-200 transition-all cursor-pointer z-20"
      >
        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <Wrench className="w-4 h-4" />
        </div>
        <div className="flex flex-col pr-1 sm:pr-1.5">
          <span className="text-[11px] font-extrabold text-slate-900 tracking-tight leading-none">5</span>
          <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider font-mono mt-0.5">Repair</span>
        </div>
      </motion.div>
    </div>
  );
}

// --- CARD 03 SUPPORT COMPONENTS ---
function RentalBookingMockup() {
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    { label: 'Upcoming', count: '12', icon: Calendar, activeColorClass: 'bg-amber-50 text-amber-600 border-amber-200 ring-2 ring-amber-400/10', baseColorClass: 'bg-amber-50/50 text-amber-500/80 border-slate-100' },
    { label: 'Active', count: '18', icon: Play, activeColorClass: 'bg-blue-50 text-blue-600 border-blue-200 ring-2 ring-blue-400/10', baseColorClass: 'bg-blue-50/50 text-blue-500/80 border-slate-100', iconFill: 'fill-blue-600/10' },
    { label: 'Return', count: '8', icon: Check, activeColorClass: 'bg-emerald-50 text-emerald-600 border-emerald-200 ring-2 ring-emerald-400/10', baseColorClass: 'bg-emerald-50/50 text-emerald-500/80 border-slate-100' },
    { label: 'Overdue', count: '3', icon: Clock, activeColorClass: 'bg-rose-50 text-rose-600 border-rose-200 ring-2 ring-rose-400/10', baseColorClass: 'bg-rose-50/50 text-rose-500/80 border-slate-100' }
  ];

  return (
    <div className="relative w-full flex flex-col select-none mt-1 pb-2">
      {/* Sleek multi-segmented status timeline */}
      <div className="w-[96%] mx-auto flex flex-col gap-1.5 mb-5 mt-2">
        <div className="flex justify-between items-center text-[8px] sm:text-[8.5px] font-bold text-slate-400 font-mono tracking-wider">
          <span>OPERATIONAL FLOW</span>
          <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full text-[7.5px] sm:text-[8px] font-extrabold flex items-center gap-1 shrink-0">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            92% UTILITY RATE
          </span>
        </div>

        <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-2 sm:p-2.5 flex flex-col gap-1.5">
          {/* Segmented Progress Track with pulse effects */}
          <div className="h-1.5 rounded-full bg-slate-100 flex overflow-hidden">
            <div className={`h-full bg-amber-400 transition-all duration-500 ${activeCard === 0 ? 'opacity-100 saturate-125' : 'opacity-60 saturate-75'}`} style={{ width: '30%' }} />
            <div className="w-[1.5px] h-full bg-white shrink-0" />
            <div className={`h-full bg-blue-500 transition-all duration-500 ${activeCard === 1 ? 'opacity-100 saturate-125' : 'opacity-60 saturate-75'}`} style={{ width: '45%' }} />
            <div className="w-[1.5px] h-full bg-white shrink-0" />
            <div className={`h-full bg-emerald-500 transition-all duration-500 ${activeCard === 2 ? 'opacity-100 saturate-125' : 'opacity-60 saturate-75'}`} style={{ width: '18%' }} />
            <div className="w-[1.5px] h-full bg-white shrink-0" />
            <div className={`h-full bg-rose-500 transition-all duration-500 ${activeCard === 3 ? 'opacity-100 saturate-125' : 'opacity-60 saturate-75'}`} style={{ width: '7%' }} />
          </div>
          <div className="flex justify-between text-[7px] sm:text-[8px] font-extrabold text-slate-500 font-mono">
            <span className={`transition-colors duration-300 ${activeCard === 0 ? 'text-amber-600 font-black' : 'text-slate-400 font-bold'}`}>30% Upcoming</span>
            <span className={`transition-colors duration-300 ${activeCard === 1 ? 'text-blue-600 font-black' : 'text-slate-400 font-bold'}`}>45% Active</span>
            <span className={`transition-colors duration-300 ${activeCard === 2 ? 'text-emerald-600 font-black' : 'text-slate-400 font-bold'}`}>18% Return</span>
            <span className={`transition-colors duration-300 ${activeCard === 3 ? 'text-rose-600 font-black' : 'text-slate-400 font-bold'}`}>7% Overdue</span>
          </div>
        </div>
      </div>

      {/* 4 Cards Aligned Horizontally with Staggered Transitions */}
      <div className="flex items-center justify-between w-full gap-1 sm:gap-1.5">
        {cards.map((card, idx) => {
          const CardIcon = card.icon;
          const isActive = idx === activeCard;

          return (
            <div key={idx} className="contents">
              <div
                className={`flex-1 bg-white border rounded-xl p-1.5 sm:p-2 flex flex-col items-center text-center transition-all duration-300 ${isActive
                  ? 'border-slate-200 shadow-md scale-[1.04]'
                  : 'border-slate-100 hover:border-slate-200 hover:shadow-2xs opacity-80'
                  } cursor-pointer`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mb-1 transition-all duration-300 ${isActive ? card.activeColorClass : card.baseColorClass
                  }`}>
                  <CardIcon className={`w-4 h-4 ${card.iconFill || ''}`} />
                </div>
                <span className={`text-xs font-black leading-none transition-colors duration-300 ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                  {card.count}
                </span>
                <span className={`text-[8px] font-extrabold uppercase tracking-wider font-mono mt-1 transition-colors duration-300 ${isActive ? 'text-slate-800' : 'text-slate-400'
                  }`}>
                  {card.label}
                </span>
              </div>

              {/* Chevron Connector if not the last card */}
              {idx < cards.length - 1 && (
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-colors duration-300 ${activeCard === idx || activeCard === idx + 1 ? 'text-primary/70' : 'text-slate-200'
                  }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- CARD 04 SUPPORT COMPONENTS ---
function CustomerBusinessMockup() {
  return (
    <div className="relative w-full h-50 flex flex-col items-center justify-center select-none overflow-hidden mt-1 pb-1">
      {/* Network background vector connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 180" preserveAspectRatio="none">
        <defs>
          <linearGradient id="flow-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* Dashed connection curves */}
        <path d="M 150 90 Q 100 45, 55 40" fill="none" stroke="#f1f5f9" strokeWidth="1.75" />
        <path d="M 150 90 Q 200 45, 245 40" fill="none" stroke="#f1f5f9" strokeWidth="1.75" />
        <path d="M 150 90 Q 105 135, 60 140" fill="none" stroke="#f1f5f9" strokeWidth="1.75" />
        <path d="M 150 90 Q 195 135, 240 140" fill="none" stroke="#f1f5f9" strokeWidth="1.75" />

        {/* Animated connection line flows */}
        <motion.path
          d="M 150 90 Q 100 45, 55 40"
          fill="none"
          stroke="url(#flow-gradient)"
          strokeWidth="1.5"
          strokeDasharray="4 8"
          animate={{ strokeDashoffset: [0, -24] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M 150 90 Q 200 45, 245 40"
          fill="none"
          stroke="url(#flow-gradient)"
          strokeWidth="1.5"
          strokeDasharray="4 8"
          animate={{ strokeDashoffset: [0, 24] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M 150 90 Q 105 135, 60 140"
          fill="none"
          stroke="url(#flow-gradient)"
          strokeWidth="1.5"
          strokeDasharray="4 8"
          animate={{ strokeDashoffset: [0, -20] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M 150 90 Q 195 135, 240 140"
          fill="none"
          stroke="url(#flow-gradient)"
          strokeWidth="1.5"
          strokeDasharray="4 8"
          animate={{ strokeDashoffset: [0, 20] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      {/* Central Node with background glowing wave-pulse */}
      <div className="relative z-20">
        <motion.div
          animate={{ scale: [0.95, 1.15, 0.95], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-x-3 -inset-y-3 rounded-full bg-primary/35 blur-md -z-10"
        />
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-12 h-12 rounded-full bg-linear-to-tr from-primary to-primary-hover text-white flex items-center justify-center shadow-md shadow-primary/20 border-3 border-white shrink-0 cursor-pointer"
        >
          <Users className="w-5 h-5" />
        </motion.div>
      </div>

      {/* Outer Orbiting Micro-Cards */}
      {/* 1. Apex Build - Top Left */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[8%] left-[1.5%] sm:left-[3.5%] bg-white border border-slate-100 rounded-xl p-1.5 sm:p-2 flex items-center gap-2 shadow-[0_6px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-200 transition-all cursor-pointer z-10"
      >
        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-extrabold text-xs flex items-center justify-center shrink-0">
          A
        </div>
        <div className="flex flex-col pr-1">
          <span className="text-[10px] font-extrabold text-slate-900 tracking-tight leading-none">Apex Build</span>
          <span className="text-[8px] font-bold text-blue-500 font-mono uppercase tracking-wider mt-0.5">Active</span>
        </div>
      </motion.div>

      {/* 2. Summit Group - Top Right */}
      <motion.div
        animate={{ y: [2, -2, 2] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        className="absolute top-[8%] right-[1.5%] sm:right-[3.5%] bg-white border border-slate-100 rounded-xl p-1.5 sm:p-2 flex items-center gap-2 shadow-[0_6px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-200 transition-all cursor-pointer z-10"
      >
        <div className="w-7 h-7 rounded-lg bg-primary-light text-primary font-extrabold text-xs flex items-center justify-center shrink-0">
          S
        </div>
        <div className="flex flex-col pr-1">
          <span className="text-[10px] font-extrabold text-slate-900 tracking-tight leading-none">Summit Group</span>
          <span className="text-[8px] font-bold text-primary font-mono uppercase tracking-wider mt-0.5">$48.5k</span>
        </div>
      </motion.div>

      {/* 3. Nova Logistics - Bottom Left */}
      <motion.div
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="absolute bottom-[8%] left-[2%] sm:left-[4.5%] bg-white border border-slate-100 rounded-xl p-1.5 sm:p-2 flex items-center gap-2 shadow-[0_6px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-200 transition-all cursor-pointer z-10"
      >
        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 font-extrabold text-xs flex items-center justify-center shrink-0">
          N
        </div>
        <div className="flex flex-col pr-1">
          <span className="text-[10px] font-extrabold text-slate-900 tracking-tight leading-none">Nova Logistics</span>
          <span className="text-[8px] font-bold text-emerald-500 font-mono uppercase tracking-wider mt-0.5">Partner</span>
        </div>
      </motion.div>

      {/* 4. Stellar Co. - Bottom Right */}
      <motion.div
        animate={{ y: [1, -3, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
        className="absolute bottom-[8%] right-[2%] sm:right-[4.5%] bg-white border border-slate-100 rounded-xl p-1.5 sm:p-2 flex items-center gap-2 shadow-[0_6px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-200 transition-all cursor-pointer z-10"
      >
        <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 font-extrabold text-xs flex items-center justify-center shrink-0">
          S
        </div>
        <div className="flex flex-col pr-1">
          <span className="text-[10px] font-extrabold text-slate-900 tracking-tight leading-none">Stellar Co.</span>
          <span className="text-[8px] font-bold text-amber-500 font-mono uppercase tracking-wider mt-0.5">Preferred</span>
        </div>
      </motion.div>
    </div>
  );
}

// --- CARD 05 SUPPORT COMPONENTS ---
function SecureTrackingMockup() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { label: 'Scan QR', sub: 'Step 01', icon: QrCode, colorClass: 'bg-secondary-light text-secondary border-secondary-light/50 hover:border-secondary-light' },
    { label: 'Verify ID', sub: 'Step 02', icon: Shield, colorClass: 'bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-200' },
    { label: 'Condition', sub: 'Step 03', icon: Camera, colorClass: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-200' },
    { label: 'Handover', sub: 'Step 04', icon: Check, colorClass: 'bg-primary-light text-primary border-primary-light/50 hover:border-primary-light font-bold' },
  ];

  return (
    <div className="relative w-full flex flex-col items-center select-none mt-1 pb-2">
      {/* 4 Connected Icons Horizontal Chain */}
      <div className="relative w-full grid grid-cols-4 gap-2 z-10 mb-6">
        {/* Background connection track line */}
        <div className="absolute inset-x-6 top-5 h-[1.5px] bg-slate-100 z-0" />

        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isActive = idx === activeStep;

          return (
            <div key={idx} className="flex flex-col items-center text-center z-10">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-2xs transition-all duration-300 ${isActive
                  ? `${step.colorClass} border-2 scale-105 shadow-xs`
                  : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-200 hover:text-slate-500'
                  } cursor-pointer`}
              >
                <StepIcon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold tracking-tight mt-2 leading-none transition-colors duration-300 ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                {step.label}
              </span>
              <span className="text-[7.5px] font-bold text-slate-400 font-mono tracking-wider uppercase mt-1">
                {step.sub}
              </span>
            </div>
          );
        })}
      </div>

      {/* Live Verification Session Status */}
      <div className="w-[96%] bg-slate-50/80 border border-slate-100/70 rounded-xl p-3 flex flex-col gap-2 mt-2">
        <div className="flex items-center justify-between text-[8px] font-bold text-slate-400 font-mono tracking-wider">
          <span>VERIFICATION SESSION</span>
          <span className="text-emerald-600 flex items-center gap-1 font-extrabold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            SECURE
          </span>
        </div>

        <div className="flex items-center justify-between bg-white border border-slate-100 rounded-lg p-2.5 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-light border border-primary-light/50 text-primary flex items-center justify-center font-extrabold text-[10px] font-mono shrink-0">
              #F3
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-extrabold text-slate-900 leading-none">Premium Rental Asset #1048</span>
              <span className="text-[8.5px] font-bold text-slate-400 mt-0.5">Enterprise Client (VIP)</span>
            </div>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100/30 px-1.5 py-0.5 rounded-md">Verified</span>
            <span className="text-[7.5px] font-mono font-bold text-slate-400 mt-1">16:04:12 UTC</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <section id="product" className="py-16 bg-transparent relative">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-150 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[20%] left-[20%] w-125 h-125 rounded-full bg-primary-light/45 blur-[130px]" />
        <div className="absolute bottom-[20%] right-[10%] w-112.5 h-112.5 rounded-full bg-secondary-light/35 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light border border-primary-light text-xs font-semibold text-primary font-mono tracking-tight uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Rental Business Software
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-black tracking-tight text-slate-950 mb-4"
          >
            The complete platform to <span className="block sm:inline bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">manage your rentals</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto font-medium"
          >
            RentalOne provides powerful Rental Management Software designed for modern rental business owners. Track your inventory, handle bookings, manage customers, and view real-time business analytics.
          </motion.p>
        </div>        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12">

          {/* 1. CENTRALIZED CONTROL PANEL (Row 1, Left) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative overflow-hidden bg-white border border-slate-200/50 rounded-3xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-slate-300/60 transition-all duration-300 flex flex-col justify-between min-h-105"
          >
            <div className="p-6 md:p-8 pb-3 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-primary shrink-0" />
                <h3 className="text-[16px] sm:text-[18px] font-bold text-slate-900 tracking-tight">
                  Business Dashboard
                </h3>
              </div>
              <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed font-medium mt-0.5">
                Get a real-time overview of bookings, inventory, revenue, and business performance from one place.
              </p>
            </div>

            {/* Dashboard Mockup Visual */}
            <ControlPanelMockup />
          </motion.div>

          {/* 2. MULTI-LOCATION LOGISTICS (Row 1, Right) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="group relative overflow-hidden bg-white border border-slate-200/50 rounded-3xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-slate-300/60 transition-all duration-300 flex flex-col justify-between min-h-105"
          >
            <div className="p-6 md:p-8 pb-3 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
                <h3 className="text-[16px] sm:text-[18px] font-bold text-slate-900 tracking-tight">
                  Smart Inventory
                </h3>
              </div>
              <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed font-medium mt-0.5">
                Track product availability, real-time stock status, and rental activity with complete visibility.
              </p>
            </div>

            {/* Map Visual */}
            <SmartInventoryMockup />
          </motion.div>

        </div>

        {/* Bento Grid Row 2 (3 columns - equal width) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

          {/* 3. INTERACTIVE RENTAL LOGS */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group relative overflow-hidden bg-white border border-slate-200/50 rounded-3xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-slate-300/60 transition-all duration-300 flex flex-col justify-between min-h-90"
          >
            <div className="p-6 md:p-8 pb-3 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-amber-600 shrink-0" />
                <h3 className="text-[16px] sm:text-[18px] font-bold text-slate-900 tracking-tight">
                  Rental Operations
                </h3>
              </div>
              <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed font-medium mt-0.5">
                Manage bookings, pickups, returns, and daily rental operations with an organized workflow.
              </p>
            </div>

            {/* List interface widget */}
            <div className="p-6 pt-0 flex-1 flex flex-col justify-end">
              <RentalBookingMockup />
            </div>
          </motion.div>

          {/* 4. SMART FLEET ANALYTICS */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative overflow-hidden bg-white border border-slate-200/50 rounded-3xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-slate-300/60 transition-all duration-300 flex flex-col justify-between min-h-90"
          >
            <div className="p-6 md:p-8 pb-3 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary shrink-0" />
                <h3 className="text-[16px] sm:text-[18px] font-bold text-slate-900 tracking-tight">
                  Customer Management
                </h3>
              </div>
              <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed font-medium mt-0.5">
                Keep customer information, rental history, and business relationships organized in one platform.
              </p>
            </div>

            {/* Stack cards widget */}
            <div className="p-3 sm:p-4 pt-0 flex-1 flex flex-col justify-end">
              <CustomerBusinessMockup />
            </div>
          </motion.div>

          {/* 5. SEAMLESS INTEGRATIONS */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="group relative overflow-hidden bg-white border border-slate-200/50 rounded-3xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-slate-300/60 transition-all duration-300 flex flex-col justify-between min-h-90"
          >
            <div className="p-6 md:p-8 pb-3 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600 shrink-0" />
                <h3 className="text-[16px] sm:text-[18px] font-bold text-slate-900 tracking-tight">
                  Insights & Reports
                </h3>
              </div>
              <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed font-medium mt-0.5">
                Monitor your rental business performance with real-time analytics and actionable reports.
              </p>
            </div>

            {/* Orbit paths and nested badges */}
            <div className="p-6 pt-0 flex-1 flex flex-col justify-end">
              <SecureTrackingMockup />
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}

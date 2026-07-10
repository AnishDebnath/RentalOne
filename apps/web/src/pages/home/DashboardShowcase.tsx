/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DollarSign, Box, Calendar, Clock, AlertCircle, ArrowUpRight, Check,
  QrCode, User, Plus, Bell, RefreshCw, Sparkles, Sliders, ChevronRight,
  ShieldAlert, Send, FileSignature, CheckCircle2, Star
} from 'lucide-react';

export default function DashboardShowcase() {
  // Live states for dynamic CRM simulation
  const [activeTab, setActiveTab] = useState<'overview' | 'fleet' | 'bookings' | 'customers'>('overview');
  const [activeRentalsCount, setActiveRentalsCount] = useState(148);
  const [upcomingReturnsCount, setUpcomingReturnsCount] = useState(8);
  const [totalRevenue, setTotalRevenue] = useState(148250);
  const [notifications, setNotifications] = useState<string[]>([
    'New online booking: Premium Tool & Gear Kit by Jonathan Davies (VIP)',
    'Warning: Scaffolding System due in 2 hours for Project Summit',
  ]);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Mock database
  const [fleetList, setFleetList] = useState([
    { id: 'F1', name: 'Heavy Equipment Unit #4', category: 'Machinery', stock: 5, rented: 4, dailyPrice: 450, status: 'In Demand' },
    { id: 'F2', name: 'Premium Power Generator', category: 'Power Systems', stock: 8, rented: 7, dailyPrice: 180, status: 'High Yield' },
    { id: 'F3', name: 'Heavy Duty Rigging Kit', category: 'Rigging', stock: 12, rented: 6, dailyPrice: 85, status: 'Stable' },
    { id: 'F4', name: 'Industrial Air Compressor', category: 'Tools', stock: 4, rented: 3, dailyPrice: 220, status: 'In Demand' },
    { id: 'F5', name: 'Modular Scaffolding Truss 20ft', category: 'Structures', stock: 50, rented: 38, dailyPrice: 45, status: 'Stable' },
  ]);

  const [bookingList, setBookingList] = useState([
    { id: 'B1', customer: 'Linnea Rose', item: 'Equipment Unit #4', start: 'Jul 3', end: 'Jul 8', amount: 2250, status: 'Active Out' },
    { id: 'B2', customer: 'Wade Vance', item: 'Power Generator', start: 'Jul 4', end: 'Jul 6', amount: 360, status: 'Pending Prep' },
    { id: 'B3', customer: 'Theresa Webb', item: 'Air Compressor', start: 'Jul 2', end: 'Jul 5', amount: 660, status: 'Active Out' },
    { id: 'B4', customer: 'Albert Flores', item: 'Premium Tool Kit', start: 'Jul 1', end: 'Jul 3', amount: 950, status: 'Returned' },
  ]);

  const customerList = [
    { id: 'C1', name: 'Linnea Rose', email: 'linnea@studiopro.co', company: 'StudioPro Enterprise', value: 14820, rating: 5, tier: 'VIP' },
    { id: 'C2', name: 'Wade Vance', email: 'w.vance@apexbuild.org', company: 'Apex Build Solutions', value: 8540, rating: 5, tier: 'Preferred' },
    { id: 'C3', name: 'Theresa Webb', email: 'theresa@apexworks.io', company: 'ApexWorks Group', value: 24500, rating: 5, tier: 'VIP' },
    { id: 'C4', name: 'Albert Flores', email: 'albert@bloomventures.co', company: 'Bloom Ventures', value: 3120, rating: 4.8, tier: 'Standard' },
  ];

  const recentActivity = [
    { id: 'A1', type: 'dispatch', text: 'Premium Tool Kit checked out by Linnea Rose', time: '10 mins ago', badge: 'QR SCAN' },
    { id: 'A2', type: 'signature', text: 'Liability waiver signed by Wade Vance', time: '42 mins ago', badge: 'E-SIGN' },
    { id: 'A3', type: 'payment', text: 'Deposit capture authorized for $1,200', time: '1 hour ago', badge: 'CARD GATEWAY' },
    { id: 'A4', type: 'return', text: 'Heavy Truss 20ft inspected & checked-in', time: '3 hours ago', badge: 'WH CHECK' },
  ];

  // Helper trigger actions to simulate CRM automation
  const triggerNewBooking = () => {
    // Generate random mock booking
    const customers = ['Samantha Blue', 'Marcus Vance', 'David Miller'];
    const gear = ['Enterprise Tool Rig', 'High-Output Power System', 'Specialty Gear Bundle'];
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    const randomGear = gear[Math.floor(Math.random() * gear.length)];
    const randomPrice = Math.floor(Math.random() * 800) + 150;

    const newBooking = {
      id: `B${bookingList.length + 1}`,
      customer: randomCustomer,
      item: randomGear,
      start: 'Jul 5',
      end: 'Jul 9',
      amount: randomPrice,
      status: 'Pending Prep' as const,
    };

    setBookingList([newBooking, ...bookingList]);
    setTotalRevenue(prev => prev + randomPrice);
    setNotifications(prev => [`New online booking: ${randomGear} by ${randomCustomer}`, ...prev]);
    showToast(`Success: Created pending prep booking for ${randomCustomer}!`);
  };

  const verifyReturnAsset = (id: string) => {
    // Locate the booking and change its status to 'Returned'
    setBookingList(prev =>
      prev.map(b => b.id === id ? { ...b, status: 'Returned' as const } : b)
    );
    // Decrease active rentals, decrease upcoming returns
    setActiveRentalsCount(prev => Math.max(0, prev - 1));
    setUpcomingReturnsCount(prev => Math.max(0, prev - 1));
    showToast('Success: Asset QR returned, safety deposit auto-released!');
  };

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast(null);
    }, 4000);
  };

  return (
    <section id="showcase" className="py-16 bg-transparent relative">
      <div className="absolute top-1/3 right-1/4 w-125 h-125 rounded-full bg-primary-light/40 blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light border border-primary-light text-xs font-semibold text-primary font-mono tracking-tight uppercase mb-4">
            <Sliders className="w-3.5 h-3.5" /> Interactive Sandbox
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Experience the <span className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent font-display">Live CRM Dashboard</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            This is a fully-operational interactive replica of the RentalOne ERP command station. Feel free to click around, trigger simulated orders, scan returns, and toggle system states.
          </p>
        </div>

        {/* Outer Dashboard frame with subtle floating animation */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="max-w-6xl mx-auto bg-slate-950 border border-slate-800 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden font-sans relative"
        >

          {/* Top Panel Brand Bar */}
          <div className="bg-slate-950 px-6 py-4 border-b border-slate-900 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
                R1
              </div>
              <div>
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  RentalOne Command Space
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </span>
                <p className="text-[10px] text-slate-500">Live Workspace: Seattle Hub · Seattle Main Yard</p>
              </div>
            </div>

            {/* Central Tabs */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800/80">
              <button
                onClick={() => setActiveTab('overview')}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all ${activeTab === 'overview' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'
                  }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('fleet')}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all ${activeTab === 'fleet' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'
                  }`}
              >
                Fleet (Inventory)
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all ${activeTab === 'bookings' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'
                  }`}
              >
                Active Bookings
              </button>
              <button
                onClick={() => setActiveTab('customers')}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all ${activeTab === 'customers' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'
                  }`}
              >
                Customer Directory
              </button>
            </div>

            {/* Quick action triggers */}
            <div className="flex items-center gap-3">
              <button
                onClick={triggerNewBooking}
                className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors shadow-lg shadow-primary/10 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> Book Client Gear
              </button>
              <div className="relative p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white cursor-pointer border border-slate-800">
                <Bell className="w-3.5 h-3.5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-secondary" />
              </div>
            </div>
          </div>

          {/* Interactive view container */}
          <div className="p-6 md:p-8 min-h-120">
            <AnimatePresence mode="wait">

              {/* Tab 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* KPI Row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* KPI 1 */}
                    <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 relative overflow-hidden group">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-slate-400">Total Monthly Yield</span>
                        <DollarSign className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-white font-display">
                        ${totalRevenue.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                        <Check className="w-3 h-3" /> ↑ 18.2% vs last month
                      </span>
                    </div>

                    {/* KPI 2 */}
                    <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 relative overflow-hidden group">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-slate-400">Active Fleet Units Out</span>
                        <Box className="w-4 h-4 text-secondary" />
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-white font-display">
                        {activeRentalsCount} <span className="text-xs text-slate-500 font-normal">items</span>
                      </div>
                      <span className="text-[10px] text-primary mt-1 block">
                        86.2% capacity utilization
                      </span>
                    </div>

                    {/* KPI 3 */}
                    <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 relative overflow-hidden group">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-slate-400">Pending Gateways</span>
                        <Clock className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-white font-display">
                        {upcomingReturnsCount} <span className="text-xs text-slate-500 font-normal">returns</span>
                      </div>
                      <span className="text-[10px] text-amber-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> 2 due back today
                      </span>
                    </div>

                    {/* KPI 4 */}
                    <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 relative overflow-hidden group">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-slate-400">Agreement Sign-Offs</span>
                        <FileSignature className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-white font-display">
                        100% <span className="text-xs text-slate-500 font-normal">secured</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Zero unresolved damage logs
                      </span>
                    </div>
                  </div>

                  {/* Main Grid: Charts & Activity logs */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left: Interactive SVGs (Bar & Pie) */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">

                      {/* Pie Chart: Utilization Structure */}
                      <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-bold text-white block mb-1">Fleet Inventory Status Split</span>
                          <p className="text-[10px] text-slate-500">Live categorized asset saturation yield</p>
                        </div>

                        {/* Interactive SVG Pie */}
                        <div className="my-4 flex items-center justify-center gap-6">
                          <svg className="w-28 h-28 shrink-0 overflow-visible" viewBox="0 0 100 100">
                            {/* Segment 1: Machinery (45%) */}
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#003188" strokeWidth="20" strokeDasharray="113.1 251.3" strokeDashoffset="0" className="transition-all hover:stroke-22 duration-200 cursor-pointer" />
                            {/* Segment 2: Rigging (25%) */}
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#021166" strokeWidth="20" strokeDasharray="62.8 251.3" strokeDashoffset="-113.1" className="transition-all hover:stroke-22 duration-200 cursor-pointer" />
                            {/* Segment 3: Power Systems (15%) */}
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#FD5B0F" strokeWidth="20" strokeDasharray="37.7 251.3" strokeDashoffset="-175.9" className="transition-all hover:stroke-22 duration-200 cursor-pointer" />
                            {/* Segment 4: Other (15%) */}
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#FD3D02" strokeWidth="20" strokeDasharray="37.7 251.3" strokeDashoffset="-213.6" className="transition-all hover:stroke-22 duration-200 cursor-pointer" />
                            <circle cx="50" cy="50" r="18" fill="#090d16" />
                          </svg>

                          <div className="flex flex-col gap-1.5 text-[10px]">
                            <div className="flex items-center gap-1.5 text-white">
                              <span className="w-2 h-2 rounded-full bg-[#003188]" /> Machinery (45%)
                            </div>
                            <div className="flex items-center gap-1.5 text-white">
                              <span className="w-2 h-2 rounded-full bg-[#021166]" /> Rigging (25%)
                            </div>
                            <div className="flex items-center gap-1.5 text-white">
                              <span className="w-2 h-2 rounded-full bg-[#FD5B0F]" /> Power Systems (15%)
                            </div>
                            <div className="flex items-center gap-1.5 text-white">
                              <span className="w-2 h-2 rounded-full bg-[#FD3D02]" /> Other (15%)
                            </div>
                          </div>
                        </div>

                        <span className="text-[9px] text-slate-500 font-mono">Hover chart arcs to isolate warehouse bins</span>
                      </div>

                      {/* Line/Area Graph: Real-time Revenue */}
                      <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-1">
                          <div>
                            <span className="text-xs font-bold text-white block">SaaS Managed Booking Volume</span>
                            <p className="text-[10px] text-slate-500">Trailing 6 months growth index</p>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-emerald-400">↑ 148% YOY</span>
                        </div>

                        {/* Custom area SVG */}
                        <div className="h-28 w-full mt-4 relative flex items-end">
                          <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#003188" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#003188" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path d="M 0 80 Q 40 50, 80 40 T 160 15 T 200 8 L 200 80 Z" fill="url(#areaGlow)" />
                            <path d="M 0 80 Q 40 50, 80 40 T 160 15 T 200 8" fill="none" stroke="#003188" strokeWidth="2" />
                            <circle cx="160" cy="15" r="3" fill="#FD5B0F" />
                            <circle cx="200" cy="8" r="3" fill="#003188" />
                          </svg>

                          {/* Months legends */}
                          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[8px] font-mono text-slate-500 pt-1 border-t border-slate-800/40">
                            <span>Feb</span>
                            <span>Mar</span>
                            <span>Apr</span>
                            <span>May</span>
                            <span>Jun</span>
                            <span>Jul (Live)</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Right: Recent activity feed */}
                    <div className="lg:col-span-4 p-5 bg-slate-900/60 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block mb-1">Global Yard Operations Feed</span>
                        <p className="text-[10px] text-slate-500 mb-4">Latest telemetry scans & check-outs</p>
                      </div>

                      <div className="flex flex-col gap-3.5 flex-1">
                        {recentActivity.map(act => (
                          <div key={act.id} className="flex gap-3 text-left">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] text-white font-medium leading-normal">{act.text}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] font-mono text-slate-400">{act.time}</span>
                                <span className="text-[8px] font-mono font-bold text-primary bg-primary-light/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                  {act.badge}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-slate-800/60 pt-3 text-center">
                        <span className="text-[10px] text-slate-500 hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1 font-semibold">
                          View All 146 Daily Scans <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* Tab 2: FLEET & INVENTORY */}
              {activeTab === 'fleet' && (
                <motion.div
                  key="fleet"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Asset Inventory Registry ({fleetList.length} Categories)</span>
                    <span className="text-[10px] text-slate-500 font-mono">Location: Main Storage Bin</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-400">
                      <thead>
                        <tr className="border-b border-slate-900 text-slate-500 uppercase tracking-wider font-mono text-[9px]">
                          <th className="py-2.5">Gear Name</th>
                          <th className="py-2.5">Category</th>
                          <th className="py-2.5">Stock Reserves</th>
                          <th className="py-2.5">Rented Out</th>
                          <th className="py-2.5">Price / Day</th>
                          <th className="py-2.5">Telemetry Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fleetList.map(item => (
                          <tr key={item.id} className="border-b border-slate-900/60 hover:bg-slate-900/30">
                            <td className="py-3 font-semibold text-white">{item.name}</td>
                            <td className="py-3">{item.category}</td>
                            <td className="py-3 font-mono">{item.stock} sets</td>
                            <td className="py-3 font-mono text-primary">{item.rented} active</td>
                            <td className="py-3 font-mono text-emerald-400">${item.dailyPrice}/day</td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 rounded bg-primary-light/10 text-primary border border-primary-light/20 text-[9px] font-bold">
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* Tab 3: ACTIVE BOOKINGS */}
              {activeTab === 'bookings' && (
                <motion.div
                  key="bookings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Active Client Handouts ({bookingList.length} entries)</span>
                    <span className="text-[10px] text-slate-500">Live return check-in enabled</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {bookingList.map(book => (
                      <div key={book.id} className="p-4 bg-slate-900/50 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                            {book.customer[0]}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">{book.customer}</h4>
                            <p className="text-[10px] text-slate-500">{book.item} · {book.start} to {book.end}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div>
                            <span className="text-[9px] text-slate-500 uppercase font-mono block">Secured Overage</span>
                            <span className="text-xs font-bold text-emerald-400 font-mono">${book.amount.toLocaleString()}</span>
                          </div>

                          <div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${book.status === 'Active Out' ? 'bg-primary-light/10 text-primary border border-primary-light/20' :
                              book.status === 'Pending Prep' ? 'bg-amber-950 text-amber-400 border border-amber-900/40' :
                                'bg-emerald-950 text-emerald-400 border border-emerald-900/40'
                              }`}>
                              {book.status}
                            </span>
                          </div>

                          {/* Quick checkout action triggers if out */}
                          {book.status === 'Active Out' && (
                            <button
                              onClick={() => verifyReturnAsset(book.id)}
                              className="text-[10px] font-bold bg-primary hover:bg-primary-hover text-white px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                            >
                              <QrCode className="w-3.5 h-3.5" /> Scan QR Return
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tab 4: CUSTOMERS */}
              {activeTab === 'customers' && (
                <motion.div
                  key="customers"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {customerList.map(cust => (
                    <div key={cust.id} className="p-4 bg-slate-900/50 rounded-xl border border-slate-800/80 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-light/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {cust.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-white">{cust.name}</h4>
                            <span className="text-[8px] font-mono font-bold bg-primary-light/15 text-primary px-1.5 py-0.2 rounded uppercase tracking-wider">
                              {cust.tier}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500">{cust.company} · {cust.email}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] text-slate-500 uppercase font-mono block">LTV Spend</span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">${cust.value.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Toast Notification Trigger status */}
          <AnimatePresence>
            {notificationToast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-6 right-6 bg-emerald-600 border border-emerald-500 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2.5 max-w-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-100 shrink-0" />
                <span>{notificationToast}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sandbox prompt overlay */}
          <div className="bg-slate-950 px-6 py-4 border-t border-slate-900 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-4">
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-primary" />
              Automated master legal vaults are active. Security deposit authorization released via local bank link.
            </span>
            <span className="font-mono text-[10px] bg-slate-900 px-2 py-1 rounded border border-slate-800">
              API Sandbox Mode: Online
            </span>
          </div>

        </motion.div>
      </div>
    </section>
  );
}

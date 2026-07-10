/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Wrench,
  Search,
  Calendar,
  CreditCard,
  UploadCloud,
  ShieldCheck,
  ShoppingBag,
  Check,
  FileText,
  Package,
  ArrowDown,
  ArrowUp,
  CheckCircle,
  Layers,
  Tv,
  Speaker,
  Cpu
} from 'lucide-react';

// Step 1: Browse Products Mockup - Elegant Abstract Blocks & Flow
function BrowseMockup() {
  const chips = ['All', 'Audio', 'Visual'];

  return (
    <div className="w-full h-52 bg-linear-to-tr from-slate-50 via-primary-light/20 to-slate-100 rounded-2xl relative overflow-hidden flex flex-col justify-between p-3.5 border border-slate-100 mb-6">
      {/* Background soft ambient glowing circles */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,49,136,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* Floating background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-primary/10"
            style={{
              left: `${20 + i * 25}%`,
              top: `${25 + i * 20}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              x: [-5, 5, -5],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Top Search bar & Filter Chips Stack */}
      <div className="relative w-full z-10 flex flex-col gap-1.5">
        {/* Mockup Search Bar */}
        <div className="w-full bg-white border border-slate-100/80 rounded-lg py-1 px-2.5 flex items-center gap-2 shadow-3xs">
          <Search className="w-3 h-3 text-primary" />
          <span className="text-[8px] font-semibold text-slate-300 tracking-tight">Search confidential inventory...</span>
        </div>

        {/* Filter Chips row below Search Bar */}
        <div className="flex gap-1">
          {chips.map((chip, idx) => (
            <div
              key={chip}
              className={`text-[7.5px] font-bold px-2 py-0.5 rounded-full border transition-all ${idx === 0
                ? 'bg-primary-light border-primary-light text-primary shadow-3xs font-extrabold'
                : 'bg-white/80 border-slate-100 text-slate-400'
                }`}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>

      {/* Three premium, non-animated product blocks */}
      <div className="grid grid-cols-3 gap-2 relative z-10 mb-1 w-full px-0.5">

        {/* Card 1: Abstract Visual Unit */}
        <div className="bg-white rounded-xl p-2.5 shadow-2xs flex flex-col justify-between h-24 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
              <Tv className="w-4 h-4 text-slate-400" />
            </div>
            <span className="text-[6px] font-mono font-extrabold bg-slate-100 text-slate-500 px-1 py-0.5 rounded-sm">V1-HD</span>
          </div>

          <div className="space-y-0.5 leading-none">
            <span className="text-[8px] font-black text-slate-700 tracking-tight block truncate">Secured Vision</span>
            <span className="text-[6px] font-black text-slate-400 font-mono tracking-wider block">ID: VIS-782</span>
            <span className="text-[5px] font-bold text-slate-300 font-mono tracking-widest block uppercase">CONFIDENTIAL</span>
          </div>
        </div>

        {/* Card 2: Selected / Active Audio Card */}
        <div className="bg-white rounded-xl p-2.5 shadow-xs flex flex-col justify-between h-24 relative transition-all duration-300">
          {/* Soft premium back glow */}
          <div className="absolute -inset-0.5 bg-linear-to-tr from-primary/5 to-secondary/5 rounded-xl blur-xs -z-10" />

          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-primary-light border-primary-light flex items-center justify-center text-primary shadow-3xs">
              <Speaker className="w-4 h-4" />
            </div>
            <span className="text-[6px] font-mono font-extrabold bg-primary-light text-primary px-1 py-0.5 rounded-sm">SYS-A5</span>
          </div>

          <div className="space-y-0.5 leading-none">
            <span className="text-[8px] font-black text-primary tracking-tight block truncate">Premium Audio</span>
            <span className="text-[6px] font-black text-slate-500 font-mono tracking-wider block">ID: AUD-091</span>
            <span className="text-[5.5px] font-black text-emerald-500 font-mono tracking-widest block uppercase">IN STOCK</span>
          </div>
        </div>

        {/* Card 3: Abstract System Layers Unit */}
        <div className="bg-white rounded-xl p-2.5 shadow-2xs flex flex-col justify-between h-24 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
              <Layers className="w-4 h-4 text-slate-400" />
            </div>
            <span className="text-[6px] font-mono font-extrabold bg-slate-100 text-slate-500 px-1 py-0.5 rounded-sm">X7-STR</span>
          </div>

          <div className="space-y-0.5 leading-none">
            <span className="text-[8px] font-black text-slate-700 tracking-tight block truncate">Modular Deck</span>
            <span className="text-[6px] font-black text-slate-400 font-mono tracking-wider block">ID: LYR-204</span>
            <span className="text-[5px] font-bold text-slate-300 font-mono tracking-widest block uppercase">PROTECTED</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// Step 2: Choose Dates Mockup - Floating Calendar and Range Selection
function CalendarMockup() {
  return (
    <div className="w-full h-52 bg-linear-to-tr from-slate-50 via-primary-light/20 to-slate-100 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center p-4 border border-slate-100 mb-6">
      {/* Soft brand primary ambient back glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,49,136,0.04)_0%,transparent_70%)] pointer-events-none" />

      {/* Main Container of the floating calendars */}
      <motion.div
        className="relative w-full max-w-55 h-37.5 flex items-center justify-center"
        animate={{
          y: [-4, 4, -4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Back Calendar Card (Glassmorphic design) */}
        <div className="absolute w-35 h-31.25 bg-white/40 backdrop-blur-xs border border-white/40 rounded-xl p-2 shadow-sm -translate-x-6 -translate-y-4 -rotate-6 opacity-65 z-0 flex flex-col justify-between">
          <div className="h-2 w-8 bg-slate-300/60 rounded" />
          <div className="grid grid-cols-7 gap-1 mt-1">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-slate-300/40 mx-auto" />
            ))}
          </div>
          <div className="h-1.5 w-10 bg-slate-200/50 rounded" />
        </div>

        {/* Front Calendar Card */}
        <div className="w-41.25 bg-white border border-slate-100 rounded-xl p-3 shadow-md relative z-10 flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-slate-50 pb-1.5">
            <span className="text-[10px] font-black text-slate-800 tracking-tight">July 2026</span>

            {/* Pulsing Availability status indicator */}
            <div className="flex items-center gap-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
              </span>
              <span className="text-[6.5px] font-bold text-primary font-mono">LIVE</span>
            </div>
          </div>

          {/* Weekdays row */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
              <span key={idx} className="text-[7.5px] font-extrabold text-slate-400 font-mono uppercase">
                {day}
              </span>
            ))}
          </div>

          {/* Calendar Grid representation of days */}
          <div className="grid grid-cols-7 gap-y-1 gap-x-1 justify-items-center relative">
            {/* Empty spacer blocks for Wednesday start of July 2026 */}
            <div className="w-4 h-4" />
            <div className="w-4 h-4" />
            <div className="w-4 h-4" />

            {/* Days of month (1 to 18) */}
            {Array.from({ length: 18 }).map((_, i) => {
              const dayNumber = i + 1;
              const isSelected = dayNumber >= 10 && dayNumber <= 14;
              const isStart = dayNumber === 10;
              const isEnd = dayNumber === 14;

              return (
                <div key={i} className="relative flex items-center justify-center w-5 h-4">
                  {/* Connecting highlight strip behind */}
                  {isSelected && (
                    <motion.div
                      className={`absolute inset-y-0.5 bg-primary-light/80 ${isStart ? 'left-1/2 w-1/2 rounded-l-md' : isEnd ? 'right-1/2 w-1/2 rounded-r-md' : 'left-0 right-0'
                        }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.6, delay: i * 0.02 }}
                    />
                  )}

                  {/* Day cell / button */}
                  <motion.div
                    className={`w-4.5 h-4.5 rounded-md flex items-center justify-center text-[7.5px] font-extrabold relative z-10 transition-all ${isSelected
                      ? 'bg-primary text-white shadow-xs font-black'
                      : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    animate={isSelected ? {
                      scale: [1, 1.05, 1],
                    } : {}}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.05,
                      ease: "easeInOut"
                    }}
                  >
                    {dayNumber}
                  </motion.div>

                  {/* Label indicators for endpoints */}
                  {isStart && (
                    <span className="absolute -bottom-1 text-[4px] font-mono font-black text-primary scale-[0.8] leading-none z-20">IN</span>
                  )}
                  {isEnd && (
                    <span className="absolute -bottom-1 text-[4px] font-mono font-black text-primary scale-[0.8] leading-none z-20">OUT</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Connection line helper at the bottom */}
          <div className="bg-slate-50 border border-slate-100/50 rounded-lg py-1 px-1.5 flex justify-between items-center text-[7.5px] font-bold text-slate-500 font-mono">
            <span>JULY 10</span>
            <motion.span
              className="text-primary font-black"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ➔
            </motion.span>
            <span>JULY 14</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Step 3: Confirm Booking Mockup - Sequential Validation Flow
function CheckoutMockup() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { label: 'Cart', sub: 'Step 01', icon: ShoppingBag, colorClass: 'bg-primary-light text-primary border-primary-light/50 hover:border-primary-light' },
    { label: 'Verify', sub: 'Step 02', icon: FileText, colorClass: 'bg-secondary-light text-secondary border-secondary-light/50 hover:border-secondary-light' },
    { label: 'Secure', sub: 'Step 03', icon: ShieldCheck, colorClass: 'bg-primary-light text-primary border-primary-light/50 hover:border-primary-light' },
    { label: 'Success', sub: 'Step 04', icon: Check, colorClass: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-200 font-bold' },
  ];

  return (
    <div className="w-full h-52 bg-linear-to-tr from-slate-50 via-secondary-light/25 to-slate-100 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center p-4 border border-slate-100 mb-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,49,136,0.02)_0%,transparent_70%)] pointer-events-none" />

      {/* 4 Connected Icons Horizontal Chain */}
      <div className="relative w-full grid grid-cols-4 gap-2 z-10">
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
              <span className={`text-[10px] font-bold tracking-tight mt-2.5 leading-none transition-colors duration-300 ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                {step.label}
              </span>
              <span className="text-[7.5px] font-bold text-slate-400 font-mono tracking-wider uppercase mt-1">
                {step.sub}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Step 4: Collect & Return Mockup - 4-Step Lifecyle loop
function CollectMockup() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { label: 'Package', sub: 'Step 01', icon: Package, colorClass: 'bg-secondary-light text-secondary border-secondary-light/50 hover:border-secondary-light' },
    { label: 'Pickup', sub: 'Step 02', icon: ArrowDown, colorClass: 'bg-primary-light text-primary border-primary-light/50 hover:border-primary-light' },
    { label: 'Return', sub: 'Step 03', icon: ArrowUp, colorClass: 'bg-primary-light text-primary border-primary-light/50 hover:border-primary-light' },
    { label: 'Done', sub: 'Step 04', icon: CheckCircle, colorClass: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-200 font-bold' },
  ];

  return (
    <div className="w-full h-52 bg-linear-to-tr from-slate-50 via-emerald-50/20 to-slate-100 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center p-4 border border-slate-100 mb-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.02)_0%,transparent_70%)] pointer-events-none" />

      {/* 4 Connected Icons Horizontal Chain */}
      <div className="relative w-full grid grid-cols-4 gap-2 z-10">
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
              <span className={`text-[10px] font-bold tracking-tight mt-2.5 leading-none transition-colors duration-300 ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                {step.label}
              </span>
              <span className="text-[7.5px] font-bold text-slate-400 font-mono tracking-wider uppercase mt-1">
                {step.sub}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="solution" className="py-16 bg-transparent relative overflow-hidden">
      {/* Background soft ambient glowing circles */}
      <div className="absolute top-[10%] left-[5%] w-112.5 h-112.5 rounded-full bg-primary-light/45 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] right-[5%] w-112.5 h-112.5 rounded-full bg-primary-light/35 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">

        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light border border-primary-light text-xs font-semibold text-primary font-mono tracking-tight uppercase mb-4">
            <Wrench className="w-3.5 h-3.5" /> Online Rental Process
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-black tracking-tight text-slate-950 mb-4"
          >
            A Modern Online <span className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">Booking System</span> for Customers
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto font-medium"
          >
            Provide your customers with a modern, effortless booking experience while automating reservations, tracking rental dates, and streamlining checkouts behind the scenes.
          </motion.p>
        </div>

        {/* Operations Grid styled with exactly 4 steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch max-w-7xl mx-auto">

          {/* Card 1: Browse Products */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-[2.2rem] p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 min-h-88 relative overflow-hidden"
          >
            {/* Visual Preview Container */}
            <BrowseMockup />

            {/* Text Description Row */}
            <div className="text-left space-y-2 mt-auto">
              <div className="flex items-center gap-2 text-primary">
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <Search className="w-4 h-4" />
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold tracking-tight text-slate-900">
                  Browse Products
                </h4>
              </div>
              <p className="text-slate-500 text-[12.5px] sm:text-[13px] leading-relaxed font-medium">
                Explore available rental items with real-time, instant live availability updates.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Choose Dates */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-[2.2rem] p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 min-h-88 relative overflow-hidden"
          >
            {/* Visual Calendar Mockup */}
            <CalendarMockup />

            {/* Text Description Row */}
            <div className="text-left space-y-2 mt-auto">
              <div className="flex items-center gap-2 text-secondary">
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold tracking-tight text-slate-900">
                  Choose Dates
                </h4>
              </div>
              <p className="text-slate-500 text-[12.5px] sm:text-[13px] leading-relaxed font-medium">
                Select your pickup and return dates in seconds with smart calendar scheduling.
              </p>
            </div>
          </motion.div>

          {/* Card 3: Confirm Booking */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-[2.2rem] p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 min-h-88 relative overflow-hidden"
          >
            {/* Visual Preview Container */}
            <CheckoutMockup />

            {/* Text Description Row */}
            <div className="text-left space-y-2 mt-auto">
              <div className="flex items-center gap-2 text-emerald-600">
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold tracking-tight text-slate-900">
                  Reserve Rental
                </h4>
              </div>
              <p className="text-slate-500 text-[12.5px] sm:text-[13px] leading-relaxed font-medium">
                Confirm your online booking through a fast, highly secure rental checkout process.
              </p>
            </div>
          </motion.div>

          {/* Card 4: Collect & Return */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="group bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-[2.2rem] p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 min-h-88 relative overflow-hidden"
          >
            {/* Visual Preview Container */}
            <CollectMockup />

            {/* Text Description Row */}
            <div className="text-left space-y-2 mt-auto">
              <div className="flex items-center gap-2 text-indigo-600">
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold tracking-tight text-slate-900">
                  Pickup & Return
                </h4>
              </div>
              <p className="text-slate-500 text-[12.5px] sm:text-[13px] leading-relaxed font-medium">
                Collect and return your rental items with a smooth, hassle-free and organized experience.
              </p>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}

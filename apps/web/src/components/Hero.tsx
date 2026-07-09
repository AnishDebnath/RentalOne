/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  ArrowRight, Play, CheckCircle2, Sparkles, Star, Calendar, Box, ShieldCheck, QrCode,
  ChevronDown, LayoutDashboard, Users, Bed, Brush, CreditCard, TrendingUp, Search, Mic, Bell, Moon, MoreVertical, LogOut, DoorOpen
} from 'lucide-react';

export default function Hero() {
  const handleScrollTo = (id: string) => {
    const target = document.querySelector(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="hero" className="relative pt-32 pb-6 md:pt-40 md:pb-10 overflow-hidden bg-transparent">
      {/* Premium ambient glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full bg-primary-light/45 blur-[100px]" />
        <div className="absolute top-[-10%] right-[15%] w-[450px] h-[450px] rounded-full bg-secondary-light/45 blur-[120px]" />
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-primary-light/35 blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-slate-200/60 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] backdrop-blur-sm mb-6 select-none"
          >
            <span className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              Modern Rental Business Software
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-950 mb-6 leading-[1.1]"
          >
            Scale Your Rental Business with <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-[shiny-text_8s_linear_infinite]">
              Unified Booking & Inventory Management
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto mb-10"
          >
            RentalOne is the premium Rental Management Software built for owners. Easily automate your booking system, track inventory, process payments, and streamline daily operations on one unified platform.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
          >
            <button
              id="hero-cta-get-started"
              onClick={() => handleScrollTo('#final-cta')}
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-hover text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-xl shadow-secondary/25 hover:shadow-secondary/35 active:scale-[0.98] text-[15px]"
            >
              Book a Free Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              id="hero-cta-demo"
              onClick={() => handleScrollTo('#plan-structure')}
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 bg-white hover:bg-primary hover:text-white border border-primary text-primary font-semibold px-8 py-4 rounded-xl transition-all duration-200 active:scale-[0.98] text-[15px] shadow-sm"
            >
              Explore Plans & Pricing
            </button>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3.5 mb-8 max-w-4xl mx-auto text-slate-600 text-xs sm:text-sm font-medium"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" /> Real-time Inventory Management
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" /> Online Rental Booking System
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" /> Integrated CRM & Tracking
            </span>
          </motion.div>

          {/* Trust Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="text-center max-w-2xl mx-auto mb-16 select-none"
          >
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Trusted by growing rental operators worldwide.
            </p>
            <p className="text-[11px] sm:text-xs text-primary font-bold uppercase tracking-wider mt-1">
              Secure • Cloud-Based • No Credit Card Required
            </p>
          </motion.div>
        </div>

        {/* Dashboard Preview mockup in viewport with floating elements */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Centered container grouping mockup and floating elements */}
          <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center">
            {/* Dual Device (Laptop & Mobile) Mockup Area */}
            <div 
              className="relative w-full flex flex-col items-center justify-center pt-8 pb-16 min-h-[460px] md:min-h-[560px]"
              style={{
                maskImage: 'linear-gradient(to bottom, black 50%, rgba(0, 0, 0, 0.3) 78%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 50%, rgba(0, 0, 0, 0.3) 78%, transparent 100%)'
              }}
            >
            
            {/* 1. LAPTOP MOCKUP (Centered, Large - Static positioning, no bobbing animation) */}
            <div className="relative w-[88%] md:w-full max-w-3xl z-10">
              {/* Laptop Screen Body */}
              <div className="relative rounded-2xl border-4 border-slate-900 bg-slate-950 shadow-2xl overflow-hidden aspect-[16/10] w-full">
                {/* Camera / Sensor */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-12 h-3 bg-slate-900 rounded-full z-30 flex items-center justify-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                  <div className="w-1 h-1 rounded-full bg-blue-900/80" />
                </div>

                {/* Main Laptop Content Area - Ideal for actual product dashboard image */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col justify-between p-4 md:p-6 overflow-hidden">
                  
                  {/* Clean, Modern Dashboard Template Placeholder to look production-ready */}
                  <div className="w-full h-full flex flex-col opacity-60">
                    {/* Top simulated navbar */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-primary" />
                        <div className="w-16 h-2.5 bg-slate-200 rounded-full" />
                      </div>
                      <div className="flex gap-2">
                        <div className="w-10 h-4 bg-slate-150 rounded-md" />
                        <div className="w-14 h-4 bg-slate-200 rounded-md" />
                      </div>
                    </div>

                    {/* Layout body */}
                    <div className="flex gap-3 flex-1 overflow-hidden text-left">
                      {/* Left list sidebar */}
                      <div className="w-1/4 hidden sm:flex flex-col gap-2 border-r border-slate-100 pr-2">
                        <div className="w-full h-5 bg-primary-light rounded" />
                        <div className="w-3/4 h-3 bg-slate-100 rounded" />
                        <div className="w-1/2 h-3 bg-slate-100 rounded" />
                        <div className="w-2/3 h-3 bg-slate-100 rounded" />
                      </div>
                      
                      {/* Main grid */}
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div className="border border-slate-200/80 bg-white rounded-lg p-3 flex flex-col justify-between">
                          <div className="w-1/2 h-3 bg-slate-200 rounded" />
                          <div className="w-full h-12 bg-primary-light/50 rounded border border-primary-light border-dashed mt-2" />
                        </div>
                        <div className="border border-slate-200/80 bg-white rounded-lg p-3 flex flex-col justify-between">
                          <div className="w-2/3 h-3 bg-slate-200 rounded" />
                          <div className="w-full h-12 bg-slate-100 rounded mt-2" />
                        </div>
                        <div className="col-span-2 border border-slate-200/80 bg-white rounded-lg p-3">
                          <div className="w-1/3 h-3 bg-slate-200 rounded mb-2" />
                          <div className="w-full h-10 bg-slate-50 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Elegant overlay guiding user where to insert their image */}
                  <div className="absolute inset-0 bg-slate-950/5 hover:bg-slate-950/0 transition-colors duration-300 flex flex-col items-center justify-center p-4">
                    <div className="bg-white/95 backdrop-blur-md shadow-xl border border-slate-200/80 px-6 py-4 rounded-2xl flex flex-col items-center gap-2.5 max-w-xs text-center">
                      <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary">
                        <LayoutDashboard className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Your Web Dashboard</h4>
                        <p className="text-[10px] text-slate-500 mt-1">Place your web dashboard image inside this section later</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Laptop Keyboard Base & Hinge */}
              <div className="relative w-[108%] left-[-4%] h-3 bg-slate-800 rounded-b-xl border-t border-slate-700 shadow-lg z-20">
                {/* Trackpad notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-slate-900 rounded-b-sm" />
              </div>
            </div>

            {/* 2. OVERLAPPING MOBILE MOCKUP (Bottom Right - Static positioning, no bobbing animation) */}
            <div className="absolute right-[-2%] sm:right-[4%] bottom-[4%] w-[120px] sm:w-[170px] md:w-[195px] z-30 drop-shadow-2xl">
              {/* Smartphone Outer Body */}
              <div className="relative border-4 border-slate-900 bg-slate-950 rounded-[24px] sm:rounded-[28px] overflow-hidden aspect-[9/19] w-full shadow-2xl">
                {/* Speaker & Sensor bar */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-slate-900 rounded-full z-40 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-800" />
                </div>

                {/* Smartphone Screen Area */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-light to-white flex flex-col justify-between p-2.5 pt-7 overflow-hidden">
                  
                  {/* Clean, Modern Mobile App Template Placeholder */}
                  <div className="w-full h-full flex flex-col opacity-60">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      <div className="w-8 h-1 bg-slate-300 rounded-full" />
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1">
                      <div className="w-full h-10 bg-white rounded-lg border border-slate-200 p-1.5 flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 rounded bg-primary-light shrink-0" />
                        <div className="flex-1 space-y-0.5">
                          <div className="w-1/2 h-1 bg-slate-200 rounded" />
                          <div className="w-1/3 h-1 bg-slate-150 rounded" />
                        </div>
                      </div>
                      <div className="w-full h-10 bg-white rounded-lg border border-slate-200 p-1.5 flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 rounded bg-rose-50 shrink-0" />
                        <div className="flex-1 space-y-0.5">
                          <div className="w-2/3 h-1 bg-slate-200 rounded" />
                          <div className="w-1/2 h-1 bg-slate-150 rounded" />
                        </div>
                      </div>
                      <div className="flex-1 border border-slate-200 border-dashed rounded-lg bg-white/50 p-1.5 flex flex-col justify-end">
                        <div className="w-3/4 h-1.5 bg-slate-200 rounded mb-1" />
                        <div className="w-1/2 h-1 bg-slate-150 rounded" />
                      </div>
                    </div>
                  </div>

                  {/* Guides User */}
                  <div className="absolute inset-0 bg-slate-950/10 hover:bg-slate-950/0 transition-colors duration-300 flex flex-col items-center justify-center p-2 text-center">
                    <div className="bg-white/95 backdrop-blur-md shadow-lg border border-slate-200 rounded-xl p-2 max-w-[130px]">
                      <div className="w-5 h-5 rounded bg-primary-light flex items-center justify-center text-primary mx-auto mb-1">
                        <Users className="w-3 h-3" />
                      </div>
                      <h5 className="text-[8px] font-bold text-slate-900 leading-tight">Mobile App</h5>
                      <p className="text-[7px] text-slate-500 mt-0.5 leading-tight">Place mobile image here</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Unified Bottom Fade-out Overlay to fade out and blur both laptop and mobile mockups together */}
            <div className="absolute bottom-0 left-0 right-0 h-32 md:h-44 pointer-events-none z-40 select-none overflow-hidden">
              {/* Layered backdrop-blur zones to simulate a smooth gradient-like blur */}
              <div className="absolute bottom-0 left-0 right-0 h-full bg-slate-50/10 backdrop-blur-[2px] [mask-image:linear-gradient(to_top,black_20%,transparent_100%)] [WebkitMaskImage:linear-gradient(to_top,black_20%,transparent_100%)]" />
              <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-slate-50/20 backdrop-blur-[6px] [mask-image:linear-gradient(to_top,black_30%,transparent_100%)] [WebkitMaskImage:linear-gradient(to_top,black_30%,transparent_100%)]" />
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-slate-50/30 backdrop-blur-[12px] [mask-image:linear-gradient(to_top,black_40%,transparent_100%)] [WebkitMaskImage:linear-gradient(to_top,black_40%,transparent_100%)]" />
              
              {/* Color gradient fade to completely blend into slate-50 background */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent" />
            </div>

          </div> {/* Close Dual Device Mockup Area */}

          {/* 3. HIGH Z-INDEX FLOATING ELEMENTS */}
          {/* Floating Element 1: Left-side top (Asset Tracker / QR) */}
          <motion.div
            initial={{ opacity: 0, x: -40, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
            className="absolute left-[-15px] xl:left-[-35px] top-[15%] hidden lg:flex z-50"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-3 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xl rounded-2xl p-3.5 max-w-[220px]"
            >
              <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
                <QrCode className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">RentalOne Software</p>
                <h4 className="text-xs font-bold text-slate-800 leading-tight font-sans">Automate Rental Bookings</h4>
                <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">● Quick & 100% Secure</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating Element 2: Left-side bottom (Active Users / Bookings) */}
          <motion.div
            initial={{ opacity: 0, x: -40, y: 40 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: 'easeOut' }}
            className="absolute left-[-20px] xl:left-[-45px] top-[55%] hidden lg:flex z-50"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-3 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xl rounded-2xl p-3.5 max-w-[230px]"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Rental Management</p>
                <h4 className="text-xs font-bold text-slate-800 leading-tight font-sans">Real-Time Inventory Status</h4>
                <p className="text-[9px] text-slate-500 mt-0.5">Cars, Equipment & Venues</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating Element 3: Right-side top (Revenue stats) */}
          <motion.div
            initial={{ opacity: 0, x: 40, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: 'easeOut' }}
            className="absolute right-[-100px] top-[18%] hidden lg:flex z-50"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-3 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xl rounded-2xl p-3.5 max-w-[230px]"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Business Growth</p>
                <h4 className="text-xs font-bold text-slate-800 leading-tight font-sans">10k+ Rentals Managed</h4>
                <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">↑ 35% Higher Revenue</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating Element 4: Right-side bottom (Housekeeping / Staff productivity) */}
          <motion.div
            initial={{ opacity: 0, x: 40, y: 40 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: 'easeOut' }}
            className="absolute right-[-100px] top-[58%] hidden lg:flex z-50"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-3 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xl rounded-2xl p-3.5 max-w-[240px]"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Rental Operations</p>
                <h4 className="text-xs font-bold text-slate-800 leading-tight font-sans">Fleet & Asset Booking</h4>
                <p className="text-[9px] text-slate-500 mt-0.5">Scale Easily & Save Time</p>
              </div>
            </motion.div>
          </motion.div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}

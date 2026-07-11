/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import {
  ArrowRight, Play, CheckCircle2, Sparkles, Star, Calendar, Box, ShieldCheck, QrCode,
  ChevronDown, Users, Bed, Brush, CreditCard, TrendingUp, Search, Mic, Bell, Moon, MoreVertical, LogOut, DoorOpen
} from 'lucide-react';
import productDesktop from '../../assets/product-desktop.png';
import productMobile from '../../assets/product-mobile.png';

export default function Hero() {
  const [activeDevice, setActiveDevice] = useState<'phone' | 'laptop'>('phone');

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDevice(prev => prev === 'phone' ? 'laptop' : 'phone');
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleScrollTo = (id: string) => {
    const target = document.querySelector(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="hero" className="relative pt-32 pb-6 md:pt-40 md:pb-10 overflow-hidden bg-transparent">
      {/* Premium ambient glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-150 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] w-125 h-125 rounded-full bg-primary-light/45 blur-[100px]" />
        <div className="absolute top-[-10%] right-[15%] w-112.5 h-112.5 rounded-full bg-secondary-light/45 blur-[120px]" />
        <div className="absolute top-[40%] left-[30%] w-75 h-75 rounded-full bg-primary-light/35 blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 xl:px-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-slate-200/60 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] backdrop-blur-sm mb-6"
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
            className="font-display text-4xl md:text-[2.75rem] lg:text-6xl font-bold tracking-tight text-slate-950 mb-6 leading-[1.1]"
          >
            Scale Your Rental Business with <br className="hidden md:block" />
            <span className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-size-[200%_auto] animate-[shiny-text_8s_linear_infinite]">
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
            className="flex flex-col md:flex-row items-center justify-center gap-4 mb-10"
          >
            <button
              id="hero-cta-get-started"
              onClick={() => handleScrollTo('#final-cta')}
              className="w-full md:w-auto group inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-hover text-white font-semibold px-5 md:px-8 py-3 md:py-4 rounded-xl transition-all duration-200 shadow-xl shadow-secondary/25 hover:shadow-secondary/35 active:scale-[0.98] text-sm md:text-[15px]"
            >
              Book a Free Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              id="hero-cta-demo"
              onClick={() => handleScrollTo('#plan-structure')}
              className="w-full md:w-auto group inline-flex items-center justify-center gap-2 bg-white hover:bg-primary hover:text-white border border-primary text-primary font-semibold px-5 md:px-8 py-3 md:py-4 rounded-xl transition-all duration-200 active:scale-[0.98] text-sm md:text-[15px] shadow-sm"
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
            className="text-center max-w-2xl mx-auto mb-0 md:mb-16"
          >
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Trusted by growing rental operators worldwide.
            </p>
            <p className="text-[11px] sm:text-xs text-primary font-bold uppercase tracking-wider mt-1">
              Secure • Cloud-Based • Real-Time Tracking
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
              className="relative w-full flex flex-col items-center justify-center pt-0 md:pt-4 pb-0 md:pb-8 min-h-100 md:min-h-120"
            >
              {/* Mobile Carousel - Alternating Phone & Laptop */}
              <div className="flex md:hidden relative w-full min-h-100 items-center justify-center">
                <AnimatePresence mode="wait">
                  {activeDevice === 'phone' ? (
                    <motion.div
                      key="phone"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.45, ease: 'easeInOut' }}
                      className="absolute flex items-center justify-center w-full"
                    >
                      <div className="relative w-35 sm:w-42.5 drop-shadow-2xl z-30">
                        <div className="relative border-4 border-slate-900 bg-slate-950 rounded-3xl sm:rounded-[28px] overflow-hidden aspect-9/19 w-full shadow-2xl">
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-slate-900 rounded-full z-40 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-slate-800" />
                          </div>
                          <img
                            src={productMobile}
                            alt="Mobile App"
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="laptop"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.45, ease: 'easeInOut' }}
                      className="absolute flex items-center justify-center w-full"
                    >
                      <div className="relative w-[88%] max-w-3xl z-10">
                        <div className="relative rounded-2xl border-4 border-slate-900 bg-slate-950 shadow-2xl overflow-hidden aspect-16/10 w-full">
                          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-slate-900 rounded-full z-30 flex items-center justify-center gap-0.5">
                            <div className="w-1 h-1 rounded-full bg-slate-800" />
                            <div className="w-0.5 h-0.5 rounded-full bg-blue-900/80" />
                          </div>
                          <img
                            src={productDesktop}
                            alt="Product Dashboard"
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="relative w-[108%] left-[-4%] h-3 bg-slate-800 rounded-b-xl border-t border-slate-700 shadow-lg z-20">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-slate-900 rounded-b-sm" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Tablet/Desktop Static Overlapping Layout */}
              <div className="hidden md:block relative w-full">
                <div className="relative w-full max-w-3xl md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto z-10">
                  <div className="relative rounded-2xl border-4 border-slate-900 bg-slate-950 shadow-2xl overflow-hidden aspect-16/10 w-full">
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-12 h-3 bg-slate-900 rounded-full z-30 flex items-center justify-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                      <div className="w-1 h-1 rounded-full bg-blue-900/80" />
                    </div>
                    <img
                      src={productDesktop}
                      alt="Product Dashboard"
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="relative w-[108%] left-[-4%] h-3 bg-slate-800 rounded-b-xl border-t border-slate-700 shadow-lg z-20">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-slate-900 rounded-b-sm" />
                  </div>
                </div>

                <div className="absolute right-[4%] bottom-[4%] w-48.75 md:w-36.5 lg:w-42.5 xl:w-48.75 z-30 drop-shadow-2xl">
                  <div className="relative border-4 border-slate-900 bg-slate-950 rounded-[28px] overflow-hidden aspect-9/19 w-full shadow-2xl">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-slate-900 rounded-full z-40 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-slate-800" />
                    </div>
                    <img
                      src={productMobile}
                      alt="Mobile App"
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

            </div> {/* Close Dual Device Mockup Area */}

            {/* 3. HIGH Z-INDEX FLOATING ELEMENTS */}
            {/* Floating Element 1: Left-side top (Asset Tracker / QR) */}
            <motion.div
              initial={{ opacity: 0, x: -40, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
              className="absolute -left-3.75 xl:-left-8.75 top-[15%] hidden z-50"
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center gap-3 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xl rounded-2xl p-3.5 max-w-55"
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
              className="absolute -left-5 xl:-left-11.25 top-[55%] hidden z-50"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center gap-3 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xl rounded-2xl p-3.5 max-w-57.5"
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
              className="absolute -right-25 lg:-right-12 xl:-right-25 top-[18%] hidden z-50"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center gap-3 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xl rounded-2xl p-3.5 max-w-57.5"
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
              className="absolute -right-25 lg:-right-12 xl:-right-25 top-[58%] hidden z-50"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center gap-3 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xl rounded-2xl p-3.5 max-w-60"
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

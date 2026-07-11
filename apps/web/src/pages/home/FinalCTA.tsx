/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  X,
  Calendar,
  HelpCircle,
  Sparkle,
  Sparkles,
  MousePointer2,
  Camera,
  Truck,
  TrendingUp,
  BarChart3,
  Layers,
  Package,
  ArrowRight
} from 'lucide-react';

export default function FinalCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    fleetSize: '100-500 items',
    useCase: 'Camera & Production Gear'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle demo/free trial form submit
  const handleBookingSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setIsSubmitted(true);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      fleetSize: '100-500 items',
      useCase: 'Camera & Production Gear'
    });
    setIsSubmitted(false);
    setIsModalOpen(false);
  };

  return (
    <section id="cta" className="py-16 bg-transparent px-4 md:px-8 lg:px-12 xl:px-20 relative overflow-hidden flex flex-col items-center">

      {/* Outer Banner Wrapper matching the elegant, premium website theme */}
      <div className="w-full max-w-5xl rounded-3xl bg-white border border-slate-100 p-8 sm:p-12 md:py-16 md:px-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden flex flex-col items-center text-center">

        {/* Subtle decorative dot pattern background texture */}
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[16px_16px]" />

        {/* Atmospheric ambient radiant glow matching theme flow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-125 h-62.5 rounded-full bg-linear-to-b from-primary/5 to-secondary/0 blur-[80px] pointer-events-none" />

        {/* ========================================================= */}
        {/* RESTORED PRODUCT-SPECIFIC SIDE LAYOUT CARDS (No borders, no animation) */}
        {/* ========================================================= */}

        {/* CARD 1 (Top Left): Camera Gear Booking */}
        <div className="absolute left-6 top-8 hidden xl:flex flex-col bg-white shadow-md rounded-2xl p-4 w-48 text-left pointer-events-none z-10 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-primary-light flex items-center justify-center text-primary">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Production</span>
              <span className="text-[12px] font-black text-slate-800 leading-tight block">Sony FX3 Kit</span>
            </div>
          </div>
          <div className="space-y-1.5 bg-slate-50/50 p-2.5 rounded-xl">
            <div className="flex justify-between items-center text-[10px] font-semibold text-slate-600">
              <span>Status</span>
              <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md font-bold">DISPATCHED</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-medium text-slate-500">
              <span>Period</span>
              <span>Jul 08 - 14</span>
            </div>
          </div>
        </div>

        {/* CARD 2 (Bottom Left): Vehicle & Logistics Tracker */}
        <div className="absolute left-6 bottom-8 hidden lg:flex flex-col bg-white shadow-lg rounded-2xl p-4 w-52 text-left pointer-events-none z-10 transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest bg-primary-light px-1.5 py-0.5 rounded">F-102 TRANSIT</span>
            <Truck className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <span className="text-[13px] font-extrabold text-slate-800 font-display block">Vehicle Dispatch</span>
          <span className="text-[10px] font-medium text-slate-400 block mt-0.5">Route: Event Hub</span>

          <div className="mt-3 space-y-1">
            <div className="flex justify-between items-center text-[9px] font-bold text-slate-500">
              <span>On-Route Delivery</span>
              <span>82% Completed</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '82%' }}></div>
            </div>
          </div>
        </div>

        {/* CARD 3 (Top Right): Event & Truss Inventory Stack */}
        <div className="absolute right-6 top-8 hidden xl:flex flex-col bg-white shadow-md rounded-2xl p-4 w-44 text-left pointer-events-none z-10 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary-light flex items-center justify-center text-primary">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Event Asset</span>
              <span className="text-[12px] font-black text-slate-800 leading-tight block">Stage Truss</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-slate-900 font-display">94%</span>
            <span className="text-[9px] text-primary bg-primary-light font-bold px-1.5 py-0.5 rounded">ALLOCATED</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-primary rounded-full" style={{ width: '94%' }}></div>
          </div>
        </div>

        {/* CARD 4 (Bottom Right): Weekly Equipment Return Rate */}
        <div className="absolute right-6 bottom-8 hidden lg:flex flex-col bg-white shadow-lg rounded-2xl p-3.5 w-44 text-left pointer-events-none z-10 transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-800 font-display">Check-in Rates</span>
            <span className="text-[8px] font-bold text-slate-400 font-mono">4 Weeks</span>
          </div>
          <div className="flex items-baseline mb-2">
            <span className="text-lg font-black text-slate-900 font-display">98.4%</span>
            <span className="text-[8px] text-emerald-600 bg-emerald-50 font-bold px-1.5 py-0.5 rounded ml-1">On-Time</span>
          </div>

          {/* Mini elegant bar graph represent weekly check-ins */}
          <div className="h-10 flex items-end gap-1.5 px-0.5">
            <div className="flex-1 bg-slate-100 rounded-t-sm h-[75%] transition-all duration-300"></div>
            <div className="flex-1 bg-slate-100 rounded-t-sm h-[85%] transition-all duration-300"></div>
            <div className="flex-1 bg-primary-light/50 rounded-t-sm h-[65%] transition-all duration-300"></div>
            <div className="flex-1 bg-primary rounded-t-sm h-[95%] transition-all duration-300"></div>
          </div>
          <div className="flex justify-between text-[7px] font-semibold text-slate-400 mt-1 px-0.5 font-mono">
            <span>Wk 1</span>
            <span>Wk 2</span>
            <span>Wk 3</span>
            <span>Wk 4</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CENTERED CTA MAIN CONTENT BLOCK                          */}
        {/* ========================================================= */}
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">

          {/* Elegant top badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary border border-primary-light/50 text-[11px] font-bold tracking-tight mb-5 shadow-3xs">
            <Sparkle className="w-3.5 h-3.5 fill-primary-light" />
            <span>Get Started Now</span>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-4 leading-tight"
          >
            Ready to Scale Your <br className="hidden md:inline" /> <span className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">Rental Business?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-slate-500 text-sm md:text-base leading-relaxed font-medium mb-8 max-w-lg mx-auto"
          >
            Experience the ultimate rental management software. Simplify your daily bookings, track physical inventory in real-time, and scale your business operations.
          </motion.p>

          {/* CTA buttons matching the first buttons style & requested colors */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 w-full md:w-auto px-4"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto group inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-hover text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-xl shadow-secondary/25 hover:shadow-secondary/35 active:scale-[0.98] text-sm"
            >
              Book Free Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                const target = document.querySelector('#plan-structure');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="w-full md:w-auto group inline-flex items-center justify-center gap-2 bg-white hover:bg-primary hover:text-white border border-primary text-primary font-semibold px-6 py-3 rounded-xl transition-all duration-200 active:scale-[0.98] text-sm shadow-sm"
            >
              View Pricing
            </button>
          </motion.div>
        </div>

      </div>

      {/* On-Screen Onboarding Dialog / Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* Dark glass backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border border-slate-200 shadow-2xl rounded-3xl w-full max-w-lg overflow-hidden relative z-10"
            >

              {/* Header block with modern accent gradient */}
              <div className="bg-linear-to-r from-primary-light to-secondary-light px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white">
                    <Sparkles className="w-4 h-4 fill-white/10" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-slate-950 text-base">
                      Start with RentalOne
                    </h3>
                    <p className="text-slate-500 text-[11px] font-semibold">
                      Experience modern rental logistics
                    </p>
                  </div>
                </div>

                <button
                  onClick={resetForm}
                  className="w-7 h-7 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white transition-all shadow-2xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Workspace */}
              <div className="p-6 text-left">
                {!isSubmitted ? (
                  <form onSubmit={handleBookingSubmit} className="space-y-4">

                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm px-4 py-3 rounded-xl focus:outline-none focus:bg-white focus:border-primary transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Business Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm px-4 py-3 rounded-xl focus:outline-none focus:bg-white focus:border-primary transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Company Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Cine Rentals"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm px-4 py-3 rounded-xl focus:outline-none focus:bg-white focus:border-primary transition-all placeholder:text-slate-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Equipment Size
                        </label>
                        <select
                          value={formData.fleetSize}
                          onChange={(e) => setFormData({ ...formData, fleetSize: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm px-4 py-3 rounded-xl focus:outline-none focus:bg-white focus:border-primary transition-all"
                        >
                          <option value="Under 100 items">Under 100 items</option>
                          <option value="100-500 items">100-500 items</option>
                          <option value="501-2000 items">501-2000 items</option>
                          <option value="Over 2000 items">Over 2000 items</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Primary Gear Type
                      </label>
                      <select
                        value={formData.useCase}
                        onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm px-4 py-3 rounded-xl focus:outline-none focus:bg-white focus:border-primary transition-all"
                      >
                        <option value="Camera & Production Gear">Camera & Production Gear</option>
                        <option value="Studio Rooms & Spaces">Studio Rooms & Spaces</option>
                        <option value="Lighting, AV & Sound">Lighting, AV & Sound</option>
                        <option value="Event Infrastructure">Event & Stage Infrastructure</option>
                        <option value="Heavy Equipment & Rigging">Heavy Rigging & Hardware</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full group inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md active:scale-[0.99] text-xs sm:text-sm mt-2"
                    >
                      Book My Demonstration
                      <Calendar className="w-4 h-4 text-primary-light" />
                    </button>

                    <p className="text-[10px] text-center text-slate-400 leading-normal max-w-sm mx-auto">
                      By submitting you agree to receive coordinates to join an exclusive, direct Walkthrough of RentalOne services.
                    </p>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 flex flex-col items-center justify-center gap-4"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-2 shadow-inner">
                      <Check className="w-6 h-6 stroke-3" />
                    </div>

                    <h3 className="text-xl font-black text-slate-950 font-display">
                      Walkthrough Booked!
                    </h3>

                    <p className="text-slate-500 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed font-medium">
                      Thank you, <strong>{formData.name}</strong>. An onboarding specialist from our <strong>{formData.useCase}</strong> logistics division will reach out at <strong>{formData.email}</strong> shortly to coordinate your private tour.
                    </p>

                    <button
                      onClick={resetForm}
                      className="w-full px-5 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs transition-colors border border-slate-200 mt-4"
                    >
                      Close Window
                    </button>
                  </motion.div>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, Star, Shield, Sparkles, X, ChevronRight, CheckCircle2, Rocket, TrendingUp, Crown } from 'lucide-react';

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    requirements: '',
  });

  const plans = [
    {
      name: 'Launch',
      icon: Rocket,
      iconColor: 'text-primary bg-primary-light border-primary-light/50',
      tagline: 'Best for local rental shops and boutique studios starting to automate their daily bookings.',
      highlightFeatures: [
        'Up to 200 products',
        'Up to 3 staff accounts',
        'Up to 5 production houses',
        'Unlimited customers & rentals',
        'Basic analytics dashboard',
        'Standard cloud storage',
        'Email support',
      ],
    },
    {
      name: 'Growth',
      icon: TrendingUp,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      tagline: 'Perfect for growing rental companies managing larger inventory fleets and team members.',
      highlightFeatures: [
        'Up to 1,000 products',
        'Up to 5 staff accounts',
        'Up to 10 production houses',
        'Unlimited customers & rentals',
        'Advanced analytics dashboard',
        'Increased cloud storage',
        'Priority support',
        'Optional custom development',
      ],
    },
    {
      name: 'Enterprise',
      icon: Crown,
      iconColor: 'text-amber-600 bg-amber-50 border-amber-100',
      tagline: 'Custom solutions with high-volume features for multi-location rental businesses.',
      highlightFeatures: [
        'Up to 3,000 products',
        'Up to 10 staff accounts',
        'Up to 50 production houses',
        'Unlimited customers & rentals',
        'Premium analytics dashboard',
        'Highest cloud storage',
        'Dedicated support',
        'Included custom development',
      ],
    },
  ];

  const handleOpenBooking = (planName: string) => {
    setSelectedPlan(planName);
    setFormSubmitted(false);
  };

  const handleCloseBooking = () => {
    setSelectedPlan(null);
    setBookingForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      requirements: '',
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <section id="plan-structure" className="py-24 bg-transparent text-slate-900 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary-light/40 blur-[120px]" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-sky-100/30 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light border border-primary-light text-xs font-semibold text-primary font-mono tracking-tight uppercase mb-4">
            <Star className="w-3.5 h-3.5 text-secondary fill-secondary" /> Simple Pricing Plans
          </div>
          
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-black tracking-tight text-slate-950 mb-4"
          >
            Flexible Plans Built for Any <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">Rental Business Size</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto font-medium"
          >
            Scale your business with our versatile Rental Management Software. Our flexible Rental Business Platform is designed to automate bookings, track assets, and boost efficiency.
          </motion.p>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto mb-16">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`p-7 sm:p-8 rounded-[2rem] border bg-white/75 backdrop-blur-md shadow-sm hover:shadow-xl flex flex-col justify-between relative transition-all duration-300 hover:-translate-y-1 group ${
                plan.name === 'Growth'
                  ? 'border-primary/30 ring-4 ring-primary/5'
                  : 'border-slate-200/80 hover:border-primary/30'
              }`}
            >
              <div>
                {/* Icon positioned beautifully above the plan name */}
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 shadow-sm ${plan.iconColor}`}>
                  <plan.icon className="w-5.5 h-5.5 stroke-[2]" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-2 font-display">{plan.name} Plan</h3>
                
                <p className="text-slate-500 text-xs sm:text-sm mb-6 leading-relaxed min-h-[48px]">
                  {plan.tagline}
                </p>

                {/* Inner features container box */}
                <div className="bg-slate-50/80 border border-slate-100/80 rounded-2xl p-5 mb-8">
                  <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600">
                    {plan.highlightFeatures.map((feat) => (
                      <li key={feat} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary-light border border-primary-light/50 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-primary stroke-[3]" />
                        </div>
                        <span className="font-medium text-slate-700">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => handleOpenBooking(plan.name)}
                className={`w-full group inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 ${
                  plan.name === 'Growth'
                    ? 'bg-secondary hover:bg-secondary-hover text-white shadow-md shadow-secondary/15 hover:shadow-secondary/25'
                    : 'bg-slate-50 hover:bg-primary-light text-slate-800 hover:text-primary border border-slate-200/60 hover:border-primary-light'
                }`}
              >
                <span>Book {plan.name} Plan</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              </button>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Interactive Booking Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseBooking}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden z-10 p-6 sm:p-8"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseBooking}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all border border-slate-200"
                aria-label="Close booking modal"
              >
                <X className="w-4 h-4" />
              </button>

              {!formSubmitted ? (
                <div>
                  {/* Modal Header */}
                  <div className="mb-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-light text-xs font-semibold text-primary mb-2">
                      <Sparkles className="w-3.5 h-3.5" /> Selected Plan
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 font-display">
                      Book {selectedPlan} Structure
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                      Provide your details to configure your customized RentalOne workspace.
                    </p>
                  </div>

                  {/* Booking Form */}
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Your Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        required
                        value={bookingForm.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm placeholder:text-slate-350 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                          Work Email *
                        </label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          required
                          value={bookingForm.email}
                          onChange={handleInputChange}
                          placeholder="john@company.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm placeholder:text-slate-350 transition-all"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                          Phone Number *
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          name="phone"
                          required
                          value={bookingForm.phone}
                          onChange={handleInputChange}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm placeholder:text-slate-350 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Company / Rental Agency *
                      </label>
                      <input
                        id="company"
                        type="text"
                        name="company"
                        required
                        value={bookingForm.company}
                        onChange={handleInputChange}
                        placeholder="Prime Rentals Ltd"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm placeholder:text-slate-350 transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="requirements" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Any Specific Fleet Requirements? (Optional)
                      </label>
                      <textarea
                        id="requirements"
                        name="requirements"
                        rows={3}
                        value={bookingForm.requirements}
                        onChange={handleInputChange}
                        placeholder="Tell us about your rental items (e.g., cameras, gear, event production sets)..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm placeholder:text-slate-350 transition-all resize-none"
                      />
                    </div>

                    <div className="flex items-start gap-2 text-[10px] text-slate-400 leading-normal pt-1">
                      <Shield className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>By submitting, you agree to secure configuration setup. RentalOne will reserve your fleet mapping slots. No credit card or billing details are required at this stage.</span>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-3.5 px-4 bg-secondary hover:bg-secondary-hover text-white rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-secondary/15 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Complete Plan Booking</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center flex flex-col items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6 text-emerald-600">
                    <CheckCircle2 className="w-10 h-10 stroke-[1.5]" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 font-display mb-2">Booking Reserved!</h3>
                  <p className="text-slate-500 text-xs sm:text-sm max-w-sm leading-relaxed mb-6">
                    Thank you, <span className="font-bold text-slate-800">{bookingForm.name}</span>. Your request for the <span className="font-bold text-primary">{selectedPlan} Plan</span> structure for <span className="font-bold text-slate-800">{bookingForm.company}</span> has been successfully logged.
                  </p>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 w-full text-left space-y-2 text-xs text-slate-500 mb-8">
                    <div className="flex justify-between"><span className="font-semibold">Selected Tier:</span> <span className="text-slate-800 font-bold">{selectedPlan}</span></div>
                    <div className="flex justify-between"><span className="font-semibold">Deployment:</span> <span className="text-slate-800 font-bold font-mono">Custom Workspace Allocation</span></div>
                    <div className="flex justify-between"><span className="font-semibold">Primary Contact:</span> <span className="text-slate-800 font-medium">{bookingForm.email}</span></div>
                  </div>

                  <button
                    onClick={handleCloseBooking}
                    className="py-3 px-6 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold text-xs sm:text-sm transition-all"
                  >
                    Back to Showcase
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

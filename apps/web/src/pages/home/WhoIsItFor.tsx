/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import {
  Users2,
  Box,
  Truck,
  Sliders,
  Wrench,
  ChevronRight,
  Camera,
  ArrowRight
} from 'lucide-react';

export default function WhoIsItFor() {
  const categories = [
    {
      icon: Camera,
      title: 'Camera Rental',
      description: 'Manage bookings for professional photography and filmmaking equipment rental businesses.',
      color: 'text-primary bg-primary-light border-primary-light/50',
      delay: 0.1
    },
    {
      icon: Sliders,
      title: 'Event Rental',
      description: 'Streamline reservations for furniture, lighting, and event equipment rental companies.',
      color: 'text-secondary bg-secondary-light border-secondary-light/50',
      delay: 0.2
    },
    {
      icon: Wrench,
      title: 'Tool Rental',
      description: 'Track machinery, construction tools, and industrial equipment rental businesses with ease.',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100/50',
      delay: 0.3
    },
    {
      icon: Truck,
      title: 'Vehicle Rental',
      description: 'Automate calendar bookings for car, bike, and commercial vehicle rental companies.',
      color: 'text-blue-600 bg-blue-50 border-blue-100/50',
      delay: 0.4
    }
  ];

  return (
    <section id="who-is-it-for" className="py-16 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 xl:px-20">

        {/* Outer Container with Soft Theme Background */}
        <div className="relative bg-linear-to-br from-primary-light/40 via-sky-50/20 to-primary-light/30 border border-slate-200/50 rounded-[2.5rem] py-8 px-6 md:py-12 md:px-16 overflow-hidden shadow-[0_12px_40px_-12px_rgba(0,0,0,0.03)]">
          {/* Subtle backglow elements */}
          <div className="absolute top-[-20%] right-[-10%] w-87.5 h-87.5 rounded-full bg-primary-light/50 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[-10%] w-87.5 h-87.5 rounded-full bg-sky-100/40 blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">

            {/* Left Column: Heading and CTA */}
            <div className="lg:col-span-5 space-y-6 text-left">
              {/* Review section tag style aligned with other headers */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light border border-primary-light/50 text-xs font-semibold text-primary font-mono tracking-tight uppercase">
                <Users2 className="w-3.5 h-3.5" /> Rental Business Software
              </div>

              <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight text-slate-950 leading-tight">
                The Ultimate <br className="hidden md:inline" />
                <span className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">Rental Software</span> <br className="hidden md:inline" />
                Built for <br className="hidden md:inline" />
                Every Business
              </h2>

              <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
                RentalOne is a flexible rental management software designed to automate bookings and streamline operations for equipment rental companies and modern rental store businesses.
              </p>

              <div>
                <a
                  href="#final-cta"
                  className="group px-5 md:px-6 py-3 rounded-xl bg-secondary hover:bg-secondary-hover text-white font-bold text-sm transition-all duration-200 shadow-md shadow-secondary/15 inline-flex items-center gap-1.5 hover:scale-[1.02]"
                >
                  Book a Free Demo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* Right Column: 2-column staggered layout matching the screenshot */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

                {/* Column 1 - Left Card Column (Shifted down slightly on sm+ screens) */}
                <div className="space-y-6 sm:mt-8">
                  {categories.filter((_, idx) => idx % 2 === 0).map((card) => {
                    const Icon = card.icon;
                    return (
                      <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: card.delay }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="bg-white border border-slate-100 p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all text-left flex flex-col min-h-47.5"
                      >
                        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 mb-6 ${card.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-slate-950 tracking-tight mb-2">
                            {card.title}
                          </h3>
                          <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed font-medium">
                            {card.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Column 2 - Right Card Column (Standard alignment) */}
                <div className="space-y-6">
                  {categories.filter((_, idx) => idx % 2 !== 0).map((card) => {
                    const Icon = card.icon;
                    return (
                      <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: card.delay }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="bg-white border border-slate-100 p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all text-left flex flex-col min-h-47.5"
                      >
                        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 mb-6 ${card.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-slate-950 tracking-tight mb-2">
                            {card.title}
                          </h3>
                          <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed font-medium">
                            {card.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

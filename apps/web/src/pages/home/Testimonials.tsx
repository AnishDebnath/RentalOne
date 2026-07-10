/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Star, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { testimonialsRow1, testimonialsRow2 } from '../../data/testimonials';

export default function Testimonials() {

  return (
    <section id="testimonials" className="py-16 bg-transparent relative overflow-hidden">
      {/* Dynamic Background subtle grid and glowing spot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-125 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-100 h-100 rounded-full bg-emerald-50/20 blur-[100px]" />
      </div>

      <div className="w-full">

        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-14 px-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light border border-primary-light text-xs font-semibold text-primary font-mono tracking-tight uppercase mb-4">
            <MessageSquare className="w-3.5 h-3.5 text-primary fill-primary" /> Trusted by Operators
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-black tracking-tight text-slate-950 mb-4 leading-tight"
          >
            Why Rental Businesses Choose <span className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">RentalOne</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium"
          >
            See how equipment rental shops around the world simplify their daily rental operations, manage inventory, and automate customer bookings with our premium rental management software.
          </motion.p>
        </div>

        {/* Double Row Continuous Sliding Marquee */}
        <div className="relative w-full overflow-hidden flex flex-col gap-8 select-none py-4">

          {/* Row 1: Left to Right */}
          <div className="flex overflow-hidden w-full relative">
            <div className="animate-marquee flex gap-6 whitespace-nowrap">
              {testimonialsRow1.map((rev, index) => (
                <div
                  key={index}
                  className="w-80 md:w-90 shrink-0 bg-white border border-slate-100/80 p-6 sm:p-7 rounded-4xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between h-57.5 whitespace-normal transition-all hover:shadow-[0_12px_35px_rgba(0,0,0,0.04)]"
                >
                  <div>
                    <div className="flex items-center gap-3.5 mb-4">
                      <img
                        src={rev.avatar}
                        alt={rev.name}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-full object-cover border border-slate-100 shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">{rev.name}</h4>
                        <p className="text-xs text-slate-400 font-medium">{rev.role}</p>
                      </div>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                      "{rev.quote}"
                    </p>
                  </div>
                  <div className="flex gap-1 text-amber-400 pt-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              ))}

              {/* Duplicate for infinite effect */}
              {testimonialsRow1.map((rev, index) => (
                <div
                  key={`dup1-${index}`}
                  className="w-80 md:w-90 shrink-0 bg-white border border-slate-100/80 p-6 sm:p-7 rounded-4xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between h-57.5 whitespace-normal transition-all hover:shadow-[0_12px_35px_rgba(0,0,0,0.04)]"
                >
                  <div>
                    <div className="flex items-center gap-3.5 mb-4">
                      <img
                        src={rev.avatar}
                        alt={rev.name}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-full object-cover border border-slate-100 shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">{rev.name}</h4>
                        <p className="text-xs text-slate-400 font-medium">{rev.role}</p>
                      </div>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                      "{rev.quote}"
                    </p>
                  </div>
                  <div className="flex gap-1 text-amber-400 pt-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Right to Left */}
          <div className="flex overflow-hidden w-full relative">
            <div className="animate-marquee-reverse flex gap-6 whitespace-nowrap">
              {testimonialsRow2.map((rev, index) => (
                <div
                  key={index}
                  className="w-80 md:w-90 shrink-0 bg-white border border-slate-100/80 p-6 sm:p-7 rounded-4xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between h-57.5 whitespace-normal transition-all hover:shadow-[0_12px_35px_rgba(0,0,0,0.04)]"
                >
                  <div>
                    <div className="flex items-center gap-3.5 mb-4">
                      <img
                        src={rev.avatar}
                        alt={rev.name}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-full object-cover border border-slate-100 shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">{rev.name}</h4>
                        <p className="text-xs text-slate-400 font-medium">{rev.role}</p>
                      </div>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                      "{rev.quote}"
                    </p>
                  </div>
                  <div className="flex gap-1 text-amber-400 pt-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              ))}

              {/* Duplicate for infinite effect */}
              {testimonialsRow2.map((rev, index) => (
                <div
                  key={`dup2-${index}`}
                  className="w-80 md:w-90 shrink-0 bg-white border border-slate-100/80 p-6 sm:p-7 rounded-4xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between h-57.5 whitespace-normal transition-all hover:shadow-[0_12px_35px_rgba(0,0,0,0.04)]"
                >
                  <div>
                    <div className="flex items-center gap-3.5 mb-4">
                      <img
                        src={rev.avatar}
                        alt={rev.name}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-full object-cover border border-slate-100 shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">{rev.name}</h4>
                        <p className="text-xs text-slate-400 font-medium">{rev.role}</p>
                      </div>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                      "{rev.quote}"
                    </p>
                  </div>
                  <div className="flex gap-1 text-amber-400 pt-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { faqs } from '../../data/faqs';

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="faq" className="py-16 bg-transparent relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-100 h-100 rounded-full bg-primary-light/40 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 xl:px-20">

        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16 px-4 md:px-8 lg:px-12 xl:px-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light border border-primary-light text-xs font-semibold text-primary font-mono tracking-tight uppercase mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-primary fill-primary" /> Frequently Asked
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-black tracking-tight text-slate-950 mb-4 leading-tight"
          >
            Questions Rental <span className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent font-display">Businesses Ask</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Find quick answers about RentalOne, rental management software, online booking, inventory management, pricing, and getting started.
          </motion.p>
        </div>

        {/* 2-Column Responsive Accordion Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`bg-white border rounded-2xl transition-all duration-300 overflow-hidden self-start group ${isOpen
                  ? 'border-primary-light shadow-md shadow-primary/5'
                  : 'border-slate-100 hover:border-slate-200 hover:shadow-md shadow-sm'
                  }`}
              >
                {/* Question Header button */}
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5 pr-4">
                    {/* Circle icon on the left */}
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen
                      ? 'bg-primary-light border-primary-light text-primary shadow-inner'
                      : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:bg-primary-light group-hover:border-primary-light group-hover:text-primary'
                      }`}>
                      <HelpCircle className="w-4 h-4 stroke-[2.5]" />
                    </div>

                    <span className="font-bold text-slate-800 text-sm sm:text-base leading-tight transition-colors duration-300 group-hover:text-primary">
                      {faq.question}
                    </span>
                  </div>

                  {/* Rotating Chevron on the right */}
                  <div className={`w-7.5 h-7.5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen
                    ? 'rotate-180 bg-primary border-primary text-white shadow-sm'
                    : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600'
                    }`}>
                    <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </button>

                {/* Animated Collapsible Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-5 pl-13 text-slate-500 text-xs sm:text-sm leading-relaxed border-t border-slate-50/50 pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

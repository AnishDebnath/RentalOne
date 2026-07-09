/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  const faqs = [
    {
      id: 'faq-1',
      question: 'What is rental management software?',
      answer: 'Rental management software is a dedicated digital platform designed to automate booking calendars, track inventory status, schedule dispatches, process client payments, and manage contract operations seamlessly for rental companies of all types.',
    },
    {
      id: 'faq-2',
      question: 'Which businesses can use RentalOne?',
      answer: 'RentalOne is built for diverse rental industries. It is the perfect rental business platform for camera gear, event furniture, construction tools, vehicle fleets, sports gear, medical equipment, and other specialized rental companies.',
    },
    {
      id: 'faq-3',
      question: 'What are the benefits of rental management software?',
      answer: 'Our rental business software saves you hours of admin work weekly, prevents double-bookings, simplifies equipment maintenance, coordinates staff dispatches, and delivers a modern, high-converting booking experience for your rental store clients.',
    },
    {
      id: 'faq-4',
      question: 'Can customers book rentals online?',
      answer: 'Yes. RentalOne features fully integrated online booking components. Your rental business can accept real-time bookings, check gear availability, request digital contract sign-offs, and process payments directly from your website.',
    },
    {
      id: 'faq-5',
      question: 'Can RentalOne manage inventory and bookings together?',
      answer: 'Absolutely. Our unified rental management system synchronizes active bookings with your physical inventory levels instantly. When items are checked out, our real-time database locks availability to prevent double-bookings.',
    },
    {
      id: 'faq-6',
      question: 'Is RentalOne suitable for small and growing rental businesses?',
      answer: 'Yes. RentalOne is designed to grow alongside your rental company. From a boutique rental store to complex, multi-site equipment rental operations, our software is flexible, affordable, and fully customizable.',
    },
    {
      id: 'faq-7',
      question: 'Is RentalOne cloud-based and secure?',
      answer: 'Yes. RentalOne is a modern, cloud-based platform. We secure your business data with enterprise-grade encryption, role-based staff permissions, automatic database backups, and fully sandboxed environments for complete security.',
    },
    {
      id: 'faq-8',
      question: 'Can I request a personalized demo before purchasing?',
      answer: 'Of course. We offer free, custom-tailored 1-on-1 walkthroughs. Simply scroll down to request a live demonstration and we\'ll show you exactly how RentalOne fits your specific rental business model.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-transparent relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-100 h-100 rounded-full bg-primary-light/40 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16 px-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light border border-primary-light text-xs font-semibold text-primary font-mono tracking-tight uppercase mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-primary fill-primary" /> Frequently Asked
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-black tracking-tight text-slate-950 mb-4 leading-tight"
          >
            Questions Rental <span className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent font-display">Businesses Ask</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium"
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

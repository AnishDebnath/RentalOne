/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { TrendingUp, Award, Zap, ShieldCheck } from 'lucide-react';

export default function Stats() {
  const statistics = [
    {
      value: '$240M+',
      label: 'SaaS Volume Processed',
      description: 'Annual rental order values managed securely by operators globally on our rails.',
      icon: <TrendingUp className="w-4 h-4 text-primary" />,
      badge: '↑ 18.4%',
    },
    {
      value: '99.2%',
      label: 'Contract Liability Sealed',
      description: 'Of agreements include automated liability sign-offs, reducing overall asset litigation.',
      icon: <ShieldCheck className="w-4 h-4 text-primary" />,
      badge: 'Certified',
    },
    {
      value: '4.8M+',
      label: 'Handheld QR Code Scans',
      description: 'Completed in active dispatch docks, warehouse return bays, and delivery vehicles.',
      icon: <Zap className="w-4 h-4 text-primary" />,
      badge: 'Sub-second',
    },
    {
      value: '18 Days',
      label: 'Average Turnover Time Saved',
      description: 'Cut per operator annually by automating deposits, checkout surveys, and billing updates.',
      icon: <Award className="w-4 h-4 text-primary" />,
      badge: '-40% Friction',
    },
  ];

  return (
    <section id="statistics" className="py-16 bg-transparent border-y border-slate-200/40">
      <div className="max-w-7xl mx-auto px-6">

        {/* Subtle grid backing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statistics.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-xs hover:shadow-md hover:border-slate-300/80 transition-all text-left flex flex-col justify-between min-h-50"
            >
              <div>
                {/* Upper line */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
                    {stat.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {stat.badge}
                  </span>
                </div>

                {/* Big number */}
                <h3 className="text-3xl sm:text-4xl font-black font-display text-slate-950 tracking-tight mb-2">
                  {stat.value}
                </h3>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">{stat.label}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

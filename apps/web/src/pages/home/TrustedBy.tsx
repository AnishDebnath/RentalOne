/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

export default function TrustedBy() {
  const logos = [
    {
      name: 'StudioPro',
      svg: (
        <svg className="h-6 text-slate-400 group-hover:text-primary transition-colors" viewBox="0 0 120 28" fill="currentColor">
          <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
          <circle cx="14" cy="14" r="4" />
          <text x="34" y="20" className="font-sans font-bold text-sm tracking-widest text-slate-800">STUDIOPRO</text>
        </svg>
      )
    },
    {
      name: 'EventWorks',
      svg: (
        <svg className="h-6 text-slate-400 group-hover:text-primary transition-colors" viewBox="0 0 130 28" fill="currentColor">
          <path d="M4 14 L14 4 L24 14 L14 24 Z" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <path d="M9 14 L14 9 L19 14 L14 19 Z" />
          <text x="36" y="19" className="font-sans font-extrabold text-[13px] tracking-widest text-slate-800">EVENTWORKS</text>
        </svg>
      )
    },
    {
      name: 'EquipShare',
      svg: (
        <svg className="h-6 text-slate-400 group-hover:text-primary transition-colors" viewBox="0 0 130 28" fill="currentColor">
          <rect x="3" y="5" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <line x1="3" y1="14" x2="21" y2="14" stroke="currentColor" strokeWidth="2.5" />
          <text x="32" y="19" className="font-sans font-bold text-[13px] tracking-wide text-slate-800">EquipShare</text>
        </svg>
      )
    },
    {
      name: 'ApexCam',
      svg: (
        <svg className="h-6 text-slate-400 group-hover:text-primary transition-colors" viewBox="0 0 120 28" fill="currentColor">
          <polygon points="12,4 22,22 2,22" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <circle cx="12" cy="14" r="3.5" />
          <text x="32" y="20" className="font-sans font-black text-xs tracking-widest text-slate-800">APEXCAM</text>
        </svg>
      )
    },
    {
      name: 'VeloFleet',
      svg: (
        <svg className="h-6 text-slate-400 group-hover:text-primary transition-colors" viewBox="0 0 120 28" fill="currentColor">
          <path d="M4 8 L20 8 L12 22 Z" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <circle cx="12" cy="8" r="2.5" />
          <text x="32" y="19" className="font-sans font-bold text-[13px] tracking-tight text-slate-800">velo_fleet</text>
        </svg>
      )
    },
    {
      name: 'NovaRent',
      svg: (
        <svg className="h-6 text-slate-400 group-hover:text-primary transition-colors" viewBox="0 0 120 28" fill="currentColor">
          <polygon points="12,4 20,9 20,19 12,24 4,19 4,9" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <circle cx="12" cy="14" r="3" />
          <text x="32" y="19" className="font-sans font-bold text-[13px] tracking-wider text-slate-800">NOVARENT</text>
        </svg>
      )
    },
    {
      name: 'PrimeGear',
      svg: (
        <svg className="h-6 text-slate-400 group-hover:text-primary transition-colors" viewBox="0 0 120 28" fill="currentColor">
          <path d="M4 6 L20 6 M4 14 L20 14 M4 22 L20 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <circle cx="12" cy="14" r="3" />
          <text x="32" y="19" className="font-sans font-extrabold text-[13px] tracking-tight text-slate-800">PRIMEGEAR</text>
        </svg>
      )
    },
    {
      name: 'FlexStay',
      svg: (
        <svg className="h-6 text-slate-400 group-hover:text-primary transition-colors" viewBox="0 0 120 28" fill="currentColor">
          <path d="M4 14 Q12 4 20 14 T36 14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <text x="44" y="19" className="font-sans font-bold text-[13px] tracking-wide text-slate-800">FlexStay</text>
        </svg>
      )
    }
  ];

  return (
    <section id="trusted-by" className="pt-2 pb-12 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 mb-8 font-mono">
          Trusted by 200 Rental Businesses
        </p>
        <div className="w-full overflow-x-auto scrollbar-none">
          <div className="flex flex-row flex-nowrap items-center justify-start md:justify-center min-w-max md:min-w-0 mx-auto gap-8 md:gap-12 lg:gap-16 px-4 md:px-0">
            {logos.map((logo, index) => (
              <motion.div
                key={logo.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group cursor-pointer shrink-0"
              >
                {logo.svg}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MouseEvent } from 'react';
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin
} from 'lucide-react';
import logo from '@rentalone/ui/assets/rentalone-logo.png';
import mindtrixLogo from '@rentalone/ui/assets/watermark.png';
import parentEnterpriseLogo from '@rentalone/ui/assets/mindtrix-media-logo.png';

export default function Footer() {
  const handleScrollTo = (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <footer id="main-footer" className="pb-6 bg-transparent px-4 md:px-8 lg:px-12 xl:px-20 relative overflow-hidden flex flex-col items-center">

      {/* Outer Banner Wrapper matching CTA style */}
      <div className="w-full max-w-6xl rounded-[2.5rem] bg-[#fbfbfc] border border-slate-200/50 p-8 sm:p-12 md:p-16 shadow-xs relative overflow-hidden">

        {/* Decorative gradient radial glows for atmosphere matching screenshot warmth */}
        <div className="absolute bottom-0 right-1/4 w-150 h-100 rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.02)_0%,transparent_70%)] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-150 h-100 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.03)_0%,transparent_70%)] blur-[120px] pointer-events-none" />

        {/* Upper footer grid layout matching reference screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start pb-12 relative z-10">

          {/* Left Area: RentalOne under Mindtrix Media */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <div className="flex items-center gap-2 mb-3.5">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                A PRODUCT OF
              </span>
              <div className="h-px w-6 bg-slate-200" />
              <span className="text-xs font-semibold text-rose-500 font-display">
                Mindtrix Media
              </span>
            </div>

            <img
              src={logo}
              alt="RentalOne"
              className="h-10 sm:h-12 w-auto object-contain"
            />

            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mt-4 max-w-sm font-medium">
              RentalOne is a premium rental management platform by Mindtrix Media. Simplify your rental business with our top-rated software, featuring automated online bookings and real-time inventory tracking.
            </p>

            <div className="mt-6 flex items-center gap-3.5 bg-white border border-slate-100 rounded-2xl p-3.5 w-full max-w-sm shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-3xs">
                <img src={parentEnterpriseLogo} alt="Mindtrix Media" className="w-full h-full object-contain" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide block leading-none">
                  Parent Enterprise
                </span>
                <span className="text-xs font-bold text-slate-800 mt-1 block leading-tight">
                  Mindtrix Media Co.
                </span>
              </div>
            </div>
          </div>

          {/* Right Link Columns & Socials */}
          <div className="lg:col-span-6 flex flex-col gap-8 md:gap-10 text-left">
            <div className="grid grid-cols-2 gap-6 sm:gap-8">
              {/* Column 1: Sections */}
              <div>
                <h4 className="text-[13px] font-bold text-slate-900 mb-4 font-display">Sections</h4>
                <ul className="space-y-2.5 text-xs sm:text-[13px]">
                  <li>
                    <a href="#" onClick={(e) => handleScrollTo(e, '#')} className="text-slate-500 hover:text-primary transition-colors font-medium">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#how-it-works" onClick={(e) => handleScrollTo(e, '#how-it-works')} className="text-slate-500 hover:text-primary transition-colors font-medium">
                      How it Works
                    </a>
                  </li>
                  <li>
                    <a href="#features" onClick={(e) => handleScrollTo(e, '#features')} className="text-slate-500 hover:text-primary transition-colors font-medium">
                      Core Modules
                    </a>
                  </li>
                  <li>
                    <a href="#pricing" onClick={(e) => handleScrollTo(e, '#pricing')} className="text-slate-500 hover:text-primary transition-colors font-medium">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#faq" onClick={(e) => handleScrollTo(e, '#faq')} className="text-slate-500 hover:text-primary transition-colors font-medium">
                      Reviews
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 2: Legal Info */}
              <div>
                <h4 className="text-[13px] font-bold text-slate-900 mb-4 font-display">Legal Info</h4>
                <ul className="space-y-2.5 text-xs sm:text-[13px]">
                  <li>
                    <a href="#" className="text-slate-500 hover:text-primary transition-colors font-medium">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-slate-500 hover:text-primary transition-colors font-medium">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-slate-500 hover:text-primary transition-colors font-medium">
                      Cookies Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Social Media Row aligned to the right side on larger viewports */}
            <div className="flex items-center justify-start md:justify-end gap-2.5">
              <a
                href="#"
                className="w-8 h-8 rounded-full border border-slate-200/80 hover:border-slate-400 hover:bg-white flex items-center justify-center text-slate-600 hover:text-slate-950 transition-all duration-200 shadow-2xs"
                title="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full border border-slate-200/80 hover:border-slate-400 hover:bg-white flex items-center justify-center text-slate-600 hover:text-slate-950 transition-all duration-200 shadow-2xs"
                title="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full border border-slate-200/80 hover:border-slate-400 hover:bg-white flex items-center justify-center text-slate-600 hover:text-slate-950 transition-all duration-200 shadow-2xs"
                title="Twitter"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full border border-slate-200/80 hover:border-slate-400 hover:bg-white flex items-center justify-center text-slate-600 hover:text-slate-950 transition-all duration-200 shadow-2xs"
                title="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright line with ultra-thin divider line */}
        <div className="border-t border-slate-200/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs font-semibold relative z-10">
          <div className="text-slate-500 font-medium">
            © 2026 RentalOne by Mindtrix Media. All rights reserved.
          </div>

          <div className="flex gap-5 text-slate-500 font-semibold">
            <a href="#" className="hover:text-primary transition-colors">Terms & Conditions</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Giant visual display text watermark at the bottom center */}
        {/* ========================================================= */}
        <div className="w-full text-center mt-8 pointer-events-none relative z-0 overflow-hidden">
          <span className="font-display tracking-[0.12em] font-black text-[7.5vw] md:text-[8vw] lg:text-[88px] leading-none opacity-[0.035] text-slate-950 uppercase block truncate">
            RentalOne
          </span>
        </div>

        {/* Mindtrix Media Branding */}
        <a
          href="https://www.mindtrixmedia.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 pt-4 border-t border-slate-200/40 text-center flex flex-col items-center gap-2 hover:opacity-80 transition-opacity relative z-10"
        >
          <img
            src={mindtrixLogo}
            alt="Mindtrix Media"
            className="w-28 object-contain"
          />
          <p className="text-[10px] text-slate-400 tracking-[0.2em] uppercase leading-tight font-semibold">
            Growing Together with <span className="text-primary">♥</span> Mindtrix Media
          </p>
        </a>

      </div>
    </footer>
  );
}

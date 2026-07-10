/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight, ShieldCheck, Layers } from 'lucide-react';
import logo from '@rentalone/ui/assets/rentalone-logo.png';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Product', href: '#product' },
    { label: 'Solution', href: '#solution' },
    { label: 'Pricing', href: '#plan-structure' },
    { label: 'Testimonial', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleScrollTo = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      id="main-navigation"
      className="fixed top-0 left-0 right-0 z-100 transition-all duration-300 py-4 px-4 sm:px-6 md:px-8"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`max-w-6xl mx-auto w-full transition-all duration-300 ${isScrolled
          ? 'bg-white/95 border-slate-200/80 shadow-lg shadow-slate-100/50'
          : 'bg-white/90 border-slate-100/50 shadow-md'
          } backdrop-blur-md border rounded-[22px] px-6 py-2.5 flex items-center justify-between`}
      >
        {/* Logo */}
        <a href="#" className="flex items-center group shrink-0">
          <img
            src={logo}
            alt="RentalOne"
            className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105 origin-left"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          <a
            href="#product"
            onClick={(e) => handleScrollTo(e, '#product')}
            className="text-[13.5px] font-semibold text-slate-900 hover:text-primary transition-colors"
          >
            Product
          </a>
          <a
            href="#solution"
            onClick={(e) => handleScrollTo(e, '#solution')}
            className="text-[13.5px] font-semibold text-slate-900 hover:text-primary transition-colors"
          >
            Solution
          </a>
          <a
            href="#plan-structure"
            onClick={(e) => handleScrollTo(e, '#plan-structure')}
            className="text-[13.5px] font-semibold text-slate-900 hover:text-primary transition-colors"
          >
            Pricing
          </a>
          <a
            href="#testimonials"
            onClick={(e) => handleScrollTo(e, '#testimonials')}
            className="text-[13.5px] font-semibold text-slate-900 hover:text-primary transition-colors"
          >
            Testimonial
          </a>
          <a
            href="#faq"
            onClick={(e) => handleScrollTo(e, '#faq')}
            className="text-[13.5px] font-semibold text-slate-900 hover:text-primary transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            id="nav-book-demo-btn"
            onClick={() => {
              const target = document.querySelector('#final-cta');
              if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="group bg-primary hover:bg-primary-hover text-white text-[13px] font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm active:scale-[0.98] inline-flex items-center gap-1.5"
          >
            Book a Free Demo
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          id="nav-mobile-menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </motion.div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-navigation-panel"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="lg:hidden mt-2 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl overflow-hidden shadow-xl"
          >
            <div className="px-6 py-5 flex flex-col gap-4">
              <a
                href="#product"
                onClick={(e) => handleScrollTo(e, '#product')}
                className="text-[14px] font-semibold text-slate-700 hover:text-primary transition-colors py-1"
              >
                Product
              </a>
              <a
                href="#solution"
                onClick={(e) => handleScrollTo(e, '#solution')}
                className="text-[14px] font-semibold text-slate-700 hover:text-primary transition-colors py-1"
              >
                Solution
              </a>
              <a
                href="#plan-structure"
                onClick={(e) => handleScrollTo(e, '#plan-structure')}
                className="text-[14px] font-semibold text-slate-700 hover:text-primary transition-colors py-1"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                onClick={(e) => handleScrollTo(e, '#testimonials')}
                className="text-[14px] font-semibold text-slate-700 hover:text-primary transition-colors py-1"
              >
                Testimonial
              </a>
              <a
                href="#faq"
                onClick={(e) => handleScrollTo(e, '#faq')}
                className="text-[14px] font-semibold text-slate-700 hover:text-primary transition-colors py-1"
              >
                FAQ
              </a>
              <hr className="border-slate-100 my-1" />
              <div className="flex flex-col gap-2.5">
                <button
                  id="nav-mobile-book-demo-btn"
                  onClick={() => {
                    setIsOpen(false);
                    const target = document.querySelector('#final-cta');
                    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="w-full group flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-hover text-white font-bold py-2.5 rounded-xl transition-all shadow-md text-[13px]"
                >
                  Book a Free Demo
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

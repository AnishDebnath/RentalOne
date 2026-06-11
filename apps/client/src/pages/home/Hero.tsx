import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { homeHeroBanner as heroSlides } from '../../data/herobanner';
import { motion, AnimatePresence } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="app-shell space-y-4 pt-2">
      <div className="relative overflow-hidden rounded-[32px] bg-slate-900 group shadow-2xl">

        {/* Animated Background Image - Gentle zoom effect for premium feel */}
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={activeSlide}
            src={heroSlides[activeSlide].image}
            alt="Featured camera gear background"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.8, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>

        {/* Enhanced Gradient Overlay for optimal text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent z-0" />

        <div className="relative z-10 flex min-h-[280px] flex-col justify-end p-6 md:min-h-[380px] md:p-8">

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-md md:max-w-lg rounded-[28px] bg-gradient-to-br from-white/10 to-transparent p-5 md:p-7 backdrop-blur-xl border border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.4)] space-y-4"
            >
              <div className="flex items-center gap-2" aria-hidden="true">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary shadow-[0_0_8px_rgba(255,107,0,0.8)]"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                  Featured Kit
                </span>
              </div>

              <div className="space-y-1.5">
                <h1 className="text-2xl font-extrabold leading-tight md:text-3xl lg:text-4xl text-white drop-shadow-lg">
                  {heroSlides[activeSlide].title}
                </h1>

                <p className="text-xs font-medium leading-relaxed text-slate-200 md:text-sm line-clamp-2 drop-shadow-md pb-1">
                  {heroSlides[activeSlide].copy}
                </p>
              </div>

              {/* Call to Action Button integrated into the card for logical grouping */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/category')}
                  className="primary-button w-fit !h-9 !min-h-0 !py-0 !px-5 text-xs sm:!h-10 sm:!px-6 sm:text-sm shadow-lg shadow-primary/30 transition-transform active:scale-95 hover:scale-105"
                >
                  {heroSlides[activeSlide].cta}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Pagination Indicators - Inline on mobile, absolute on desktop */}
          <div className="flex justify-center gap-2.5 z-20 mt-6 md:absolute md:right-8 md:bottom-8 md:mt-0">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`relative h-2.5 transition-all duration-500 rounded-full ${activeSlide === index ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'w-2.5 bg-white/40 hover:bg-white/60'
                  }`}
              >
                {activeSlide === index && (
                  <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-30" />
                )}
              </button>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;

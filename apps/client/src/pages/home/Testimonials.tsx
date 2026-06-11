import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { reviews } from '../../data/reviews';
import { LazyImage } from '@camera-rental-house/ui';

const Testimonials = () => {
  // Triple the reviews to ensure a seamless loop
  const duplicatedReviews = [...reviews, ...reviews, ...reviews];

  return (
    <section className="space-y-6 pb-6 overflow-hidden">
      <div className="app-shell flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink md:text-2xl pl-5">Reviews</h2>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm border border-slate-100">
          <div className="flex -space-x-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-5 w-5 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                <img src={`https://i.pravatar.cc/100?u=${i}`} alt="" />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-bold text-slate-600">4.9/5 Rating</span>
          </div>
        </div>
      </div>

      <div className="relative xl:app-shell">
        <div className="overflow-hidden">
          <motion.div
            animate={{
              x: [0, -1600],
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex gap-4 px-4"
          >
            {duplicatedReviews.map((review, index) => (
              <article
                key={`${review.id}-${index}`}
                className="min-w-[280px] max-w-[320px] shrink-0 flex flex-col justify-between rounded-[24px] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 transition-all hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-primary/10">
                        <LazyImage
                          src={review.avatar}
                          alt={review.author}
                          aspectRatio="aspect-square"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">{review.author}</h3>
                        <p className="text-[10px] font-medium text-slate-400">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 border border-slate-100 shadow-sm shrink-0">
                      <svg viewBox="0 0 24 24" className="h-4 w-4">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.09H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.91l3.66-2.8z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.09l3.66 2.84c.87-2.6 3.3-4.55 6.16-4.55z" fill="#EA4335" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-200 text-slate-200'}`}
                      />
                    ))}
                  </div>

                  <p className="line-clamp-4 text-xs font-medium leading-relaxed text-slate-600 italic">
                    "{review.comment}"
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-slate-50 pt-3">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-primary">Google Verified</span>
                </div>
              </article>
            ))}
          </motion.div>
        </div>

        {/* Soft edge fade for better UI blend - hidden when app-shell container kicks in at xl (1280px) */}
        {/* <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-page/60 to-transparent z-10 xl:hidden" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-page/60 to-transparent z-10 xl:hidden" /> */}
      </div>

      <div className="app-shell flex justify-center !px-5 pt-4">
        <a
          href="https://maps.google.com" // Placeholder, real URL should be provided
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 rounded-full bg-white/50 px-4 py-2 text-xs font-bold text-slate-600 border border-slate-100 backdrop-blur-sm transition-all hover:bg-white hover:shadow-md active:scale-95"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/80 shadow-inner">
            <svg viewBox="0 0 24 24" className="h-3 w-3">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#EA4335" />
            </svg>
          </div>
          <span>Find us on Google Maps</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-3 w-3 transition-transform group-hover:translate-x-0.5">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default Testimonials;

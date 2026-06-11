import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageCarousel = ({ images }) => {
  const [index, setIndex] = useState(0);

  // Auto-slideshow logic
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (!images || images.length === 0) return null;

  const handleDragEnd = (_, info) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      setIndex((prev) => (prev + 1) % images.length);
    } else if (info.offset.x > swipeThreshold) {
      setIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-line bg-slate-900 shadow-xl shadow-ink/5 aspect-[4/3] sm:aspect-video md:aspect-[4/3]">
      {/* Animated Image Wrapper - Hero Banner Style */}
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={index}
          src={images[index]?.image_url}
          alt=""
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 h-full w-full object-cover cursor-grab active:cursor-grabbing"
        />
      </AnimatePresence>

      {/* Dots Indicator Overlay */}
      {images.length > 1 && (
        <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2.5 z-10 pointer-events-none">
          <div className="flex bg-ink/30 backdrop-blur-md px-3 py-2 rounded-full gap-2.5 border border-white/20 pointer-events-auto">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`relative h-2 transition-all duration-500 rounded-full ${
                  index === i 
                    ? 'w-6 bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]' 
                    : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
              >
                {index === i && (
                  <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-30" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;





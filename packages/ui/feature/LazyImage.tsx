import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  aspectRatio?: string;
}

export const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholderClassName = '', 
  aspectRatio = 'aspect-square' 
}: Props) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className}`}>
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 z-10 bg-slate-100 animate-pulse ${placeholderClassName}`}
          />
        )}
      </AnimatePresence>

      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{
          opacity: isLoaded ? 1 : 0,
          scale: isLoaded ? 1 : 1.05
        }}
        transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
        className={`h-full w-full object-cover ${className}`}
      />
    </div>
  );
};

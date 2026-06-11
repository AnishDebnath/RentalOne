import React from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';
import { useToast } from './ToastContext';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';

const ToastViewport = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-[9999] flex flex-col gap-3 md:left-auto md:right-6 md:w-96">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className="pointer-events-auto relative rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-start gap-3">
              <div className={clsx(
                "rounded-xl p-2",
                toast.tone === 'success' && "bg-emerald-100 text-emerald-600",
                toast.tone === 'info' && "bg-sky-100 text-sky-600",
                toast.tone === 'warning' && "bg-amber-100 text-amber-600",
                toast.tone === 'error' && "bg-rose-100 text-rose-600"
              )}>
                {toast.tone === 'success' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : toast.tone === 'info' ? (
                  <Info className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1 pt-0.5">
                <p className="text-[13px] font-bold text-ink">{toast.title}</p>
                <p className="mt-1 text-xs font-medium text-muted">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="mt-1 text-muted transition hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastViewport;

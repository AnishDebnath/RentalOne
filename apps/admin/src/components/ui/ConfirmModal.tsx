import { AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLenis } from '@camera-rental-house/ui';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: 'danger' | 'warning' | 'success' | 'info';
  loading?: boolean;
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  tone = 'info',
  loading = false
}: ConfirmModalProps) => {
  const lenis = useLenis();

  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.documentElement.style.overflow = '';
    }
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = '';
    };
  }, [isOpen, lenis]);

  const tones = {
    danger: {
      bg: 'bg-danger/10',
      text: 'text-danger',
      border: 'border-danger/20',
      btn: 'bg-danger text-white hover:bg-danger-dark'
    },
    warning: {
      bg: 'bg-warning/10',
      text: 'text-warning',
      border: 'border-warning/20',
      btn: 'bg-warning text-white hover:bg-warning-dark'
    },
    success: {
      bg: 'bg-success/10',
      text: 'text-success',
      border: 'border-success/20',
      btn: 'bg-success text-white hover:bg-success-dark'
    },
    info: {
      bg: 'bg-primary/10',
      text: 'text-primary',
      border: 'border-primary/20',
      btn: 'bg-primary text-white hover:bg-primary-dark'
    }
  };

  const selectedTone = tones[tone];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/60 bg-white shadow-2xl shadow-ink/20"
          >
            <div className="p-8 sm:p-10">
              <div className="mb-6 flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${selectedTone.bg}`}>
                  <AlertCircle className={`h-6 w-6 ${selectedTone.text}`} />
                </div>
                <button
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-slate-50 hover:text-ink"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-black tracking-tight text-ink sm:text-2xl">{title}</h3>
                <p className="text-sm font-medium leading-relaxed text-muted/80">{message}</p>
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 whitespace-nowrap rounded-2xl border border-line bg-white px-6 py-4 text-sm font-bold text-ink transition-all hover:bg-slate-50"
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={loading}
                  className={`flex-1 flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl px-6 py-4 text-sm font-bold transition-all shadow-lg shadow-ink/5 ${selectedTone.btn} disabled:opacity-50`}
                >
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : null}
                  <span className="truncate">{confirmLabel}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ConfirmModal;

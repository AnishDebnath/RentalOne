import { useState, type FormEvent, useEffect } from 'react';
import { Building2, User, Phone, X, Loader2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useLenis } from '@camera-rental-house/ui';
import axiosInstance from '../../api/axiosInstance';

type HouseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (house: any) => void;
};

type HouseFormState = {
  name: string;
  ownerName: string;
  phone: string;
};

const initialForm: HouseFormState = {
  name: '',
  ownerName: '',
  phone: '',
};

export default function HouseModal({ isOpen, onClose, onSuccess }: HouseModalProps) {
  const lenis = useLenis();
  const [form, setForm] = useState<HouseFormState>(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
      setForm(initialForm);
      setError(null);
    } else {
      lenis?.start();
      document.documentElement.style.overflow = '';
    }
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = '';
    };
  }, [isOpen, lenis]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.ownerName.trim() || !form.phone.trim()) {
      setError('Name, Owner Name, and Phone are required.');
      return;
    }

    if (form.phone.length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const { data } = await axiosInstance.post('/admin/houses', form);
      onSuccess(data);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register production house.');
    } finally {
      setIsSaving(false);
    }
  };

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
            className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/60 bg-white shadow-2xl shadow-ink/20"
          >
            <div className="p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <button
                  onClick={onClose}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-colors hover:bg-slate-50 hover:text-ink"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6 space-y-1">
                <h3 className="text-xl font-black tracking-tight text-ink sm:text-2xl">Register House</h3>
                <p className="text-sm font-medium text-muted/70">Add a new business partner.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* House Name */}
                <label className="block space-y-1.5">
                  <span className="text-[13px] font-bold text-ink flex items-center gap-2 uppercase tracking-wide opacity-80">
                    <Building2 className="h-3.5 w-3.5 text-muted/60" /> House Name
                  </span>
                  <div className="input-shell h-12">
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm(c => ({ ...c, name: e.target.value }))}
                      placeholder="e.g. Dreamland Studio"
                      className="w-full border-0 bg-transparent p-0 text-base font-medium focus:ring-0"
                    />
                  </div>
                </label>

                {/* Owner Name */}
                <label className="block space-y-1.5">
                  <span className="text-[13px] font-bold text-ink flex items-center gap-2 uppercase tracking-wide opacity-80">
                    <User className="h-3.5 w-3.5 text-muted/60" /> Owner Name
                  </span>
                  <div className="input-shell h-12">
                    <input
                      required
                      value={form.ownerName}
                      onChange={(e) => setForm(c => ({ ...c, ownerName: e.target.value }))}
                      placeholder="e.g. Ajoy Das"
                      className="w-full border-0 bg-transparent p-0 text-base font-medium focus:ring-0"
                    />
                  </div>
                </label>

                {/* Phone Number */}
                <label className="block space-y-1.5">
                  <span className="text-[13px] font-bold text-ink flex items-center gap-2 uppercase tracking-wide opacity-80">
                    <Phone className="h-3.5 w-3.5 text-muted/60" /> Phone Number
                  </span>
                  <div className="input-shell h-12">
                    <input
                      required
                      type="tel"
                      maxLength={10}
                      value={form.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 10) {
                          setForm(c => ({ ...c, phone: val }));
                        }
                      }}
                      placeholder="Enter 10-digit number"
                      className="w-full border-0 bg-transparent p-0 text-base font-medium focus:ring-0"
                    />
                  </div>
                </label>

                {error && (
                  <div className="rounded-xl bg-danger/5 p-3 text-sm font-bold text-danger border border-danger/10">
                    {error}
                  </div>
                )}

                <div className="pt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-xl border border-line bg-white px-6 py-3.5 text-sm font-bold text-ink hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-[1.5] primary-button flex items-center justify-center gap-2 py-3.5 shadow-lg shadow-primary/20"
                  >
                    {isSaving ? (
                      <><Loader2 className="h-5 w-5 animate-spin" /> Working...</>
                    ) : (
                      <><Plus className="h-5 w-5" /> Add House</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

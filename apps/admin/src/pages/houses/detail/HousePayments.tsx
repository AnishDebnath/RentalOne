import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, CreditCard, Trash2, Plus, Loader2, ChevronDown, ChevronLeft, ChevronRight, Check, Wallet } from 'lucide-react';
import { useToast } from '@camera-rental-house/ui';
import axiosInstance from '../../../api/axiosInstance';

type Payment = {
  id: string;
  house_id: string;
  amount: number;
  payment_date: string;
  payment_mode: string;
  created_at: string;
};

type HousePaymentsProps = {
  houseId: string;
  onRefresh: () => void;
};

const HousePayments = ({ houseId, onRefresh }: HousePaymentsProps) => {
  const { addToast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [paymentMode, setPaymentMode] = useState('Online');

  // Custom picker drop states
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [calendarViewDate, setCalendarViewDate] = useState(() => new Date());

  const calendarRef = useRef<HTMLDivElement>(null);
  const modeDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setIsCalendarOpen(false);
      }
      if (modeDropdownRef.current && !modeDropdownRef.current.contains(e.target as Node)) {
        setIsModeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync calendar view when date opens
  useEffect(() => {
    if (isCalendarOpen && paymentDate) {
      setCalendarViewDate(new Date(paymentDate));
    }
  }, [isCalendarOpen, paymentDate]);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get(`/admin/houses/${houseId}/payments`);
      setPayments(res.data || []);
    } catch (error) {
      addToast({ title: 'Error', message: 'Failed to fetch payments.', tone: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (houseId) {
      fetchPayments();
    }
  }, [houseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      addToast({ title: 'Validation Error', message: 'Please enter a valid amount.', tone: 'error' });
      return;
    }
    if (!paymentDate) {
      addToast({ title: 'Validation Error', message: 'Please select a date.', tone: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosInstance.post(`/admin/houses/${houseId}/payments`, {
        amount: Number(amount),
        paymentDate,
        paymentMode,
      });
      addToast({ title: 'Success', message: 'Payment recorded successfully.', tone: 'success' });
      setAmount('');
      setPaymentDate(new Date().toISOString().split('T')[0]);
      await fetchPayments();
      onRefresh();
    } catch (error) {
      addToast({ title: 'Error', message: 'Failed to record payment.', tone: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (paymentId: string) => {
    setDeletingId(paymentId);
    try {
      await axiosInstance.delete(`/admin/houses/${houseId}/payments/${paymentId}`);
      addToast({ title: 'Deleted', message: 'Payment removed successfully.', tone: 'success' });
      await fetchPayments();
      onRefresh();
    } catch (error) {
      addToast({ title: 'Error', message: 'Failed to delete payment.', tone: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  const getBadgeClass = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'online':
      case 'upi':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'cash':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'bank transfer':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'cheque':
        return 'bg-sky-50 text-sky-700 border-sky-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Calendar logic
  const year = calendarViewDate.getFullYear();
  const month = calendarViewDate.getMonth();

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthName = calendarViewDate.toLocaleString('default', { month: 'long' });

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const isToday = (d: number) => {
    const today = new Date();
    return today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
  };

  const isSelected = (d: number) => {
    const sDate = new Date(paymentDate);
    return sDate.getDate() === d && sDate.getMonth() === month && sDate.getFullYear() === year;
  };

  const selectDate = (d: number) => {
    const newDate = new Date(year, month, d);
    setPaymentDate(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`);
    setIsCalendarOpen(false);
  };

  const paymentModeOptions = ['Online', 'Cash', 'Bank Transfer', 'Cheque', 'Other'];

  return (
    <div className="bg-white rounded-[1.5rem] border border-line shadow-sm">
      {/* Header */}
      <div className="border-b border-line px-6 py-5 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-ink uppercase tracking-wider">Record House Payment</h2>
          <p className="text-[11px] font-medium text-muted mt-0.5">Log payouts, expenses or payments taken from the house.</p>
        </div>
        <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center border border-line text-muted">
          <CalendarIcon className="h-4 w-4" />
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Add Payment Form */}
          <div className="lg:col-span-4">
            <h3 className="text-xs font-black text-ink uppercase tracking-wider mb-4 flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" /> New Entry
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Custom Date Picker */}
              <div ref={calendarRef} className={`relative ${isCalendarOpen ? 'z-30' : 'z-10'}`}>
                <label className="block text-[10px] font-black text-ink/70 uppercase tracking-widest mb-1.5">
                  Payment Date
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted pointer-events-none z-10">
                    <CalendarIcon className="h-4 w-4" />
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className={`w-full flex items-center justify-between pl-10 pr-4 py-2.5 rounded-xl border text-sm font-bold text-ink transition-all outline-none text-left ${isCalendarOpen ? 'border-primary ring-4 ring-primary/5 bg-white' : 'border-line hover:border-line/80 bg-white'
                      }`}
                  >
                    <span>{formatDate(paymentDate)}</span>
                    <ChevronDown className={`h-4 w-4 text-muted/85 transition-transform duration-300 ${isCalendarOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isCalendarOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 p-4 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-line z-[100] w-full min-w-[280px]"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <button
                            type="button"
                            onClick={() => setCalendarViewDate(new Date(year, month - 1, 1))}
                            className="p-1.5 hover:bg-slate-50 rounded-lg text-muted transition-colors"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <span className="text-sm font-black text-ink">{monthName} {year}</span>
                          <button
                            type="button"
                            onClick={() => setCalendarViewDate(new Date(year, month + 1, 1))}
                            className="p-1.5 hover:bg-slate-50 rounded-lg text-muted transition-colors"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                            <div key={d} className="text-[9px] font-black uppercase tracking-wider text-tertiary">{d}</div>
                          ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center">
                          {days.map((d, i) => (
                            <div key={i} className="aspect-square flex items-center justify-center p-0.5">
                              {d && (
                                <button
                                  type="button"
                                  onClick={() => selectDate(d)}
                                  className={`w-full h-full rounded-full text-xs font-bold transition-all ${isSelected(d) ? 'bg-primary text-white shadow-md shadow-primary/20 scale-110' :
                                    isToday(d) ? 'bg-primary/10 text-primary' :
                                      'text-ink hover:bg-slate-50 hover:scale-110'
                                    }`}
                                >
                                  {d}
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Amount - Text Type but only Number allowed */}
              <div className="relative z-10">
                <label className="block text-[10px] font-black text-ink/70 uppercase tracking-widest mb-1.5">
                  Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted font-bold text-sm pointer-events-none z-10">
                    ₹
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*$/.test(val)) {
                        setAmount(val);
                      }
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-line focus:border-primary/30 focus:ring-4 focus:ring-primary/5 text-sm font-bold text-ink outline-none transition-all placeholder:text-muted/60 placeholder:font-medium"
                  />
                </div>
              </div>

              {/* Custom Dropdown for Payment Mode - Single Chevron arrow only */}
              <div ref={modeDropdownRef} className={`relative ${isModeDropdownOpen ? 'z-30' : 'z-10'}`}>
                <label className="block text-[10px] font-black text-ink/70 uppercase tracking-widest mb-1.5">
                  Payment Mode
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted pointer-events-none z-10">
                    <CreditCard className="h-4 w-4" />
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
                    className={`w-full flex items-center justify-between pl-10 pr-4 py-2.5 rounded-xl border text-sm font-bold text-ink transition-all outline-none text-left ${isModeDropdownOpen ? 'border-primary ring-4 ring-primary/5 bg-white' : 'border-line hover:border-line/80 bg-white'
                      }`}
                  >
                    <span>{paymentMode}</span>
                    <ChevronDown className={`h-4 w-4 text-muted/85 transition-transform duration-300 ${isModeDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isModeDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-line z-[100] w-full overflow-hidden"
                      >
                        <ul className="py-1">
                          {paymentModeOptions.map((mode) => (
                            <li key={mode}>
                              <button
                                type="button"
                                onClick={() => {
                                  setPaymentMode(mode);
                                  setIsModeDropdownOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold transition-colors text-left hover:bg-slate-50 ${paymentMode === mode ? 'text-primary bg-primary/5' : 'text-ink'
                                  }`}
                              >
                                <span>{mode}</span>
                                {paymentMode === mode && <Check className="h-3.5 w-3.5 text-primary" />}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:shadow-primary/30 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Recording...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Payment
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Payments History List */}
          <div className="lg:col-span-8 flex flex-col min-h-[300px]">
            <h3 className="text-xs font-black text-ink uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Payment History</span>
              <span className="text-[10px] font-bold text-muted bg-slate-50 border border-line/60 rounded-full px-2.5 py-0.5 tabular-nums">
                {payments.length} Records
              </span>
            </h3>

            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <span className="text-xs font-bold text-muted uppercase tracking-widest">Loading history...</span>
              </div>
            ) : payments.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 border border-dashed border-line rounded-2xl bg-slate-50/20 text-center">
                <div className="h-12 w-12 rounded-full bg-slate-50 border border-line flex items-center justify-center text-muted mb-3">
                  <Wallet className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-black text-ink">No Payments Logged</h4>
                <p className="text-xs font-medium text-muted mt-1 max-w-[280px]">
                  All recorded payments from the house will be listed here. Use the form on the left to add one.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table View - Hidden on mobile */}
                <div className="hidden md:block flex-1 border border-line rounded-2xl overflow-hidden bg-slate-50/10">
                  <div data-lenis-prevent className="overflow-auto max-h-[270px] custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 z-10 bg-slate-50 border-b border-line">
                        <tr className="text-[9px] font-black text-muted uppercase tracking-widest">
                          <th className="px-5 py-3.5 bg-slate-50">Date</th>
                          <th className="px-5 py-3.5 bg-slate-50">Mode</th>
                          <th className="px-5 py-3.5 text-right bg-slate-50">Amount</th>
                          <th className="px-5 py-3.5 text-center bg-slate-50">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line/40">
                        <AnimatePresence>
                          {payments.map((p) => (
                            <motion.tr
                              key={p.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="hover:bg-slate-50/30 transition-colors"
                            >
                              <td className="px-5 py-3 text-xs font-bold text-ink whitespace-nowrap">
                                {formatDate(p.payment_date)}
                              </td>
                              <td className="px-5 py-3">
                                <span className={`inline-flex items-center text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${getBadgeClass(p.payment_mode)}`}>
                                  {p.payment_mode}
                                </span>
                              </td>
                              <td className="px-5 py-3 text-right text-xs font-black text-emerald-600 tabular-nums whitespace-nowrap">
                                ₹{Number(p.amount).toLocaleString('en-IN')}
                              </td>
                              <td className="px-5 py-3 text-center">
                                <button
                                  onClick={() => handleDelete(p.id)}
                                  disabled={deletingId === p.id}
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-line bg-white text-muted hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 transition-all disabled:opacity-50"
                                  title="Delete payment"
                                >
                                  {deletingId === p.id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-3.5 w-3.5" />
                                  )}
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Card List View - Hidden on desktop */}
                <div data-lenis-prevent className="block md:hidden flex-1 space-y-3 max-h-[340px] overflow-y-auto pr-1">
                  <AnimatePresence>
                    {payments.map((p) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 rounded-2xl border border-line bg-slate-50/10 flex items-center justify-between gap-4"
                      >
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-black text-ink">
                            {formatDate(p.payment_date)}
                          </span>
                          <div>
                            <span className={`inline-flex items-center text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getBadgeClass(p.payment_mode)}`}>
                              {p.payment_mode}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-emerald-600 tabular-nums">
                            ₹{Number(p.amount).toLocaleString('en-IN')}
                          </span>
                          <button
                            onClick={() => handleDelete(p.id)}
                            disabled={deletingId === p.id}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-line bg-white text-muted hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 transition-all disabled:opacity-50"
                            title="Delete payment"
                          >
                            {deletingId === p.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HousePayments;

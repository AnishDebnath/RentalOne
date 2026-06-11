import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ScanLine, UserCheck, ShieldCheck, Phone } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { useLenis } from '@camera-rental-house/ui';

interface Props {
  user: {
    id: string;
    memberId?: string;
    name: string;
    image: string;
    phone: string;
  };
  onClose: () => void;
  onVerify: () => void;
}

const UserVerificationModal = ({ user, onClose, onVerify }: Props) => {
  const [status, setStatus] = useState<'scanning' | 'success' | 'error' | 'timeout'>('scanning');
  const [manualId, setManualId] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerId = 'user-qr-reader';
  const lenis = useLenis();

  // Handle scroll locking
  useEffect(() => {
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = '';
    };
  }, [lenis]);

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error('Stop error:', err);
      }
    }
  };

  const startScanning = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Camera access restricted. Secure context (HTTPS or localhost) required.');
      setStatus('timeout');
      return;
    }

    setStatus('scanning');

    // Timeout logic - 10 seconds
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setStatus(current => {
        if (current === 'scanning') {
          stopScanner();
          return 'timeout';
        }
        return current;
      });
    }, 10000);

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0
    };

    try {
      const html5QrCode = new Html5Qrcode(containerId);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          const rawText = decodedText.trim();
          let scannedId = rawText;

          try {
            const payload = JSON.parse(rawText);
            // Support multiple possible property names
            scannedId = payload.memberId || payload.member_id || payload.id || rawText;
          } catch {
            scannedId = rawText;
          }

          const targetId = user.id.toLowerCase();
          const targetMemberId = user.memberId?.toLowerCase();
          const currentScan = String(scannedId).toLowerCase();

          if (currentScan === targetId || (targetMemberId && currentScan === targetMemberId)) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            handleSuccess();
          } else {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setStatus('error');
            html5QrCode.stop();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
          }
        },
        undefined
      ).catch((err) => {
        console.error('Environment camera failed, trying user camera...', err);
        // Fallback to front camera
        html5QrCode.start(
          { facingMode: 'user' },
          config,
          (decodedText) => {
            const rawText = decodedText.trim();
            let scannedId = rawText;

            try {
              const payload = JSON.parse(rawText);
              scannedId = payload.memberId || payload.member_id || payload.id || rawText;
            } catch {
              scannedId = rawText;
            }

            const targetId = user.id.toLowerCase();
            const targetMemberId = user.memberId?.toLowerCase();
            const currentScan = String(scannedId).toLowerCase();

            if (currentScan === targetId || (targetMemberId && currentScan === targetMemberId)) {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              handleSuccess();
            } else {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              setStatus('error');
              html5QrCode.stop();
            }
          },
          undefined
        ).catch((err2) => {
          console.error('All cameras failed:', err2);
        });
      });
    } catch (err) {
      console.error('Start error:', err);
    }
  };

  const handleManualVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanManual = manualId.trim().toLowerCase();
    if (
      cleanManual === user.id.toLowerCase() ||
      (user.memberId && cleanManual === user.memberId.toLowerCase())
    ) {
      handleSuccess();
    } else {
      setStatus('error');
      setTimeout(() => setStatus('scanning'), 2000);
    }
  };

  const handleSuccess = () => {
    setStatus('success');
    stopScanner();
    setTimeout(() => {
      onVerify();
      onClose();
    }, 1500);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      startScanning();
    }, 500);
    return () => {
      clearTimeout(timer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      stopScanner();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink/30 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <UserCheck className="h-5 w-5" />
            </div>
            <h3 className="font-black text-ink text-xs uppercase tracking-widest">Verify Identity</h3>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card Mini */}
        <div className="mb-6 flex items-center gap-4 rounded-2xl border border-line p-3 bg-slate-50/50">
          <div className="h-10 w-10 rounded-xl overflow-hidden border border-line">
            {user.image ? (
              <img src={user.image} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-300">
                <UserCheck className="h-5 w-5" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-ink leading-tight">{user.name}</p>
            <div className="flex items-center gap-1.5">
              <Phone className="h-3 w-3 text-blue-500 fill-blue-500/10" />
              <p className="text-[10px] font-extrabold text-tertiary uppercase tracking-widest mt-0.5">{user.phone}</p>
            </div>
          </div>
        </div>

        {/* Manual Input */}
        <form onSubmit={handleManualVerify} className="mb-6">
          <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-2 px-1">
            Manual ID Entry
          </label>
          <div className="relative group">
            <input
              type="text"
              value={manualId}
              onChange={(e) => setManualId(e.target.value.toUpperCase())}
              placeholder="Enter User ID..."
              className="w-full h-11 rounded-xl border-line bg-slate-50 px-4 text-sm font-bold text-ink placeholder:text-muted/40 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1.5 h-8 rounded-lg bg-ink px-4 text-[10px] font-black text-white uppercase tracking-widest hover:bg-slate-900 active:scale-95 transition-all"
            >
              Verify
            </button>
          </div>
        </form>

        <div className="relative mb-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-line"></div></div>
          <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.3em] text-muted"><span className="bg-white px-4">OR SCAN QR</span></div>
        </div>

        {/* Camera Area */}
        <div className="relative mt-4 aspect-square w-full overflow-hidden rounded-2xl border-2 border-line bg-ink shadow-inner">
          <div id={containerId} className="absolute inset-0 h-full w-full" />

          <AnimatePresence>
            {/* {status === 'scanning' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none absolute inset-0 z-10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative h-48 w-48">
                    <div className="absolute left-0 top-0 h-8 w-8 border-l-4 border-t-4 border-black rounded-tl-xl" />
                    <div className="absolute right-0 top-0 h-8 w-8 border-r-4 border-t-4 border-black rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4 border-black rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 h-8 w-8 border-b-4 border-r-4 border-black rounded-br-xl" />
                  </div>
                </div>
              </motion.div>
            )} */}

            {status === 'success' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-emerald-500/90 backdrop-blur-md">
                <div className="mb-4 rounded-full bg-white p-5 shadow-2xl"><ShieldCheck className="h-10 w-10 text-emerald-500" /></div>
                <p className="text-base font-black text-white uppercase tracking-[0.25em]">Verified</p>
                <p className="mt-2 text-[10px] font-bold text-emerald-50 uppercase tracking-widest opacity-80">Identity Confirmed</p>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-rose-500/90 backdrop-blur-md p-6 text-center">
                <div className="mb-4 rounded-full bg-white p-5 shadow-2xl"><X className="h-10 w-10 text-rose-500" /></div>
                <p className="text-base font-black text-white uppercase tracking-[0.25em]">Mismatch</p>
                <p className="mt-2 text-[10px] font-bold text-rose-50 uppercase tracking-widest opacity-80">Wrong User Identity</p>
              </motion.div>
            )}
            {status === 'timeout' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-rose-500/90 backdrop-blur-md p-6 text-center">
                <div className="mb-4 rounded-full bg-white p-5 shadow-2xl"><X className="h-10 w-10 text-rose-500" /></div>
                <p className="text-base font-black text-white uppercase tracking-[0.25em]">Scan Failed</p>
                <p className="mt-2 text-[10px] font-bold text-rose-50 uppercase tracking-widest opacity-80">Timeout — No QR detected</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex flex-col items-center">
          {status === 'scanning' ? (
            <p className="text-center text-[9px] font-black text-muted uppercase tracking-[0.2em] animate-pulse">
              Awaiting input or scan...
            </p>
          ) : status === 'success' ? (
            <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="h-1 w-12 rounded-full bg-emerald-100 mb-4" />
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
                Verification Successful
              </p>
            </div>
          ) : (
            <button
              onClick={startScanning}
              className="flex w-fit items-center justify-center gap-2 rounded-xl bg-ink h-10 px-6 text-xs font-black text-white hover:bg-slate-900 active:scale-95 transition-all shadow-lg"
            >
              <ScanLine className="h-4 w-4 text-white" />
              Try Again
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserVerificationModal;

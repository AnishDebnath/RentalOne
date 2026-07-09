import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ScanLine, PackageCheck } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { useLenis } from '@rentalone/ui';
import axiosInstance from '../../api/axiosInstance';

interface Props {
  product: any;
  onClose: () => void;
  onVerify: (id: string) => void;
  onSubstitute?: (oldId: string, newProduct: any) => void;
}

const ProductVerificationModal = ({ product, onClose, onVerify, onSubstitute }: Props) => {
  const [status, setStatus] = useState<'scanning' | 'success' | 'timeout' | 'error' | 'substitution_confirm'>('scanning');
  const [altProduct, setAltProduct] = useState<any>(null);
  const [searchingProduct, setSearchingProduct] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);
  const [substituteMode, setSubstituteMode] = useState<'scan' | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerId = 'qr-reader-container';
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

  const startSubstituteScanner = async () => {
    await stopScanner();
    setManualError(null);
    setStatus('scanning');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      stopScanner();
      setStatus('timeout');
    }, 10000);
    const scanner = new Html5Qrcode(containerId);
    scannerRef.current = scanner;
    const config = { fps: 10, qrbox: { width: 200, height: 200 }, aspectRatio: 1.0 };
    scanner.start(
      { facingMode: 'environment' },
      config,
      (decodedText) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        let scannedId = decodedText;
        try {
          const payload = JSON.parse(decodedText);
          scannedId = payload.productId || payload.uniqueCode || decodedText;
        } catch { /* raw */ }
        scanner.stop().then(() => {
          handleSubstituteLookup(scannedId);
        }).catch(() => {
          handleSubstituteLookup(scannedId);
        });
      },
      undefined
    ).catch(async (err) => {
      console.error('Sub-scanner env error, trying user cam:', err);
      scanner.start(
        { facingMode: 'user' },
        config,
        (decodedText) => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          let scannedId = decodedText;
          try {
            const payload = JSON.parse(decodedText);
            scannedId = payload.productId || payload.uniqueCode || decodedText;
          } catch { /* raw */ }
          scanner.stop().then(() => {
            handleSubstituteLookup(scannedId);
          }).catch(() => {
            handleSubstituteLookup(scannedId);
          });
        },
        undefined
      ).catch(err2 => {
        console.error('Sub-scanner user error:', err2);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setManualError('Camera unavailable.');
        setStatus('timeout');
      });
    });
  };

  const handleMismatch = async (scannedId: string) => {
    setManualError('Wrong product scanned.');
    setStatus('error');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    await stopScanner();
  };

  const handleSubstituteLookup = async (scannedId: string) => {
    setManualError(null);
    setSearchingProduct(true);
    try {
      let foundProduct = null;
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(scannedId);

      if (isUUID) {
        try {
          const response = await axiosInstance.get(`/products/${scannedId}`);
          foundProduct = response.data;
        } catch (e) { /* ignore 404 and try search */ }
      }

      if (!foundProduct) {
        const response = await axiosInstance.get('/products', { params: { search: scannedId, limit: 1 } });
        foundProduct = response.data.items?.[0];
      }

      if (foundProduct) {
        // Prevent substituting with the originally booked product
        if (
          foundProduct.id.toLowerCase() === product.id.toLowerCase() ||
          (product.unique_code && foundProduct.unique_code?.toLowerCase() === product.unique_code.toLowerCase())
        ) {
          setStatus('error');
          setManualError('This is the booked product. Use main scanner.');
          await stopScanner();
          return;
        }

        await stopScanner();
        setAltProduct(foundProduct);
        setStatus('success');
        setTimeout(() => {
          setStatus('substitution_confirm');
        }, 1000);
      } else {
        setStatus('error');
        setManualError('Substitute product not found.');
      }
    } catch (err) {
      console.error('Failed to search product for substitution:', err);
      setStatus('error');
      setManualError('Failed to search database.');
    } finally {
      setSearchingProduct(false);
    }
  };

  const startScanning = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Camera access restricted. Secure context (HTTPS or localhost) required.');
      setStatus('timeout');
      return;
    }

    setStatus('scanning');

    // Timeout logic - 10 seconds
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      // Use setStatus with a function to check the current state safely
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

    const scanner = new Html5Qrcode(containerId);
    scannerRef.current = scanner;

    scanner.start(
      { facingMode: 'environment' },
      config,
      (decodedText) => {
        let scannedId = decodedText;
        try {
          const payload = JSON.parse(decodedText);
          scannedId = payload.productId || payload.uniqueCode || decodedText;
        } catch { /* use raw */ }

        if (
          scannedId.toLowerCase() === product.id.toLowerCase() ||
          (product.unique_code && scannedId.toLowerCase() === product.unique_code.toLowerCase())
        ) {
          setStatus('success');
          scanner.stop();
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          setTimeout(() => {
            onVerify(product.id);
            onClose();
          }, 1500);
        } else {
          handleMismatch(scannedId);
        }
      },
      undefined
    ).catch(err => {
      console.error('Scanner error:', err);
      // Try again with user camera if environment fails
      scanner.start(
        { facingMode: 'user' },
        config,
        (decodedText) => {
          let scannedId = decodedText;
          try {
            const payload = JSON.parse(decodedText);
            scannedId = payload.productId || payload.uniqueCode || decodedText;
          } catch { /* use raw */ }

          if (
            scannedId.toLowerCase() === product.id.toLowerCase() ||
            (product.unique_code && scannedId.toLowerCase() === product.unique_code.toLowerCase())
          ) {
            setStatus('success');
            scanner.stop();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setTimeout(() => {
              onVerify(product.id);
              onClose();
            }, 1500);
          } else {
            handleMismatch(scannedId);
          }
        },
        undefined
      ).catch(err2 => {
        console.error('Final scanner error:', err2);
        setStatus('timeout');
      });
    });
  };

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      startScanning();
    }, 500);

    return () => {
      clearTimeout(timer);
      stopScanner();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <PackageCheck className="h-5 w-5" />
            </div>
            <h3 className="font-black text-ink text-xs uppercase tracking-widest">Verify Product</h3>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Product Details */}
        <div className="mb-6 flex items-center gap-4 rounded-xl border border-line p-3 bg-slate-50/50">
          <img
            src={product.image}
            className="h-12 w-12 rounded-lg object-cover border border-line shadow-sm"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-ink leading-tight">{product.name}</p>
            <p className="text-[10px] font-extrabold text-tertiary uppercase tracking-widest mt-0.5">
              Product Code: {product.unique_code || 'N/A'}
            </p>
          </div>
        </div>

        {/* Camera View Area */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-line bg-ink shadow-inner">
          {/* HTML5 QR Code Container - always rendered, overlays cover it */}
          <div id={containerId} className="absolute inset-0 h-full w-full" />

          {/* Success State */}
          <AnimatePresence>
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-emerald-500/90 backdrop-blur-md"
              >
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="mb-4 rounded-full bg-white p-5 shadow-2xl"
                >
                  <ScanLine className="h-10 w-10 text-emerald-500" />
                </motion.div>
                <p className="text-base font-black text-white uppercase tracking-[0.25em]">Product Found</p>
                <p className="mt-2 text-[10px] font-bold text-emerald-50 uppercase tracking-widest opacity-80">
                  Product Verified
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Timeout State */}
          <AnimatePresence>
            {status === 'timeout' && (
              <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-rose-500/90 backdrop-blur-md p-6 text-center"
              >
                <div className="mb-4 rounded-full bg-white p-5 shadow-2xl">
                  <X className="h-10 w-10 text-rose-500" />
                </div>
                <p className="text-base font-black text-white uppercase tracking-[0.25em]">Scan Failed</p>
                <p className="mt-2 text-[10px] font-bold text-rose-50 uppercase tracking-widest opacity-80 leading-relaxed">
                  Timeout — No QR detected
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mismatch State */}
          <AnimatePresence>
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-rose-500/90 backdrop-blur-md p-6 text-center"
              >
                <div className="mb-4 rounded-full bg-white p-5 shadow-2xl">
                  <X className="h-10 w-10 text-rose-500" />
                </div>
                <p className="text-base font-black text-white uppercase tracking-[0.25em]">Mismatch</p>
                <p className="mt-2 text-[10px] font-bold text-rose-50 uppercase tracking-widest opacity-80 leading-relaxed">
                  Wrong Product Scanned
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Substitution Confirm State */}
          <AnimatePresence>
            {status === 'substitution_confirm' && altProduct && (
              <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-slate-900/95 backdrop-blur-md p-5 text-center text-white"
              >
                <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-500 mb-3">Product Substitute</p>

                <div className="w-full text-left space-y-3.5 mb-5 bg-white/5 p-3.5 rounded-xl border border-white/10 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">Booked Gear:</span>
                    <span className="font-extrabold text-white">{product.name} ({product.unique_code})</span>
                  </div>
                  <div className="border-t border-white/10 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">Scanned Gear:</span>
                    <span className="font-extrabold text-emerald-400">{altProduct.name} ({altProduct.unique_code})</span>
                  </div>
                </div>

                <p className="text-[10px] font-medium text-white/70 mb-5 leading-relaxed">
                  Substitute this booked item with the scanned gear for release?
                </p>

                <div className="flex w-full gap-2.5">
                  <button
                    onClick={() => {
                      if (onSubstitute) onSubstitute(product.id, altProduct);
                      onClose();
                    }}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider active:scale-95 transition-all animate-in fade-in"
                  >
                    Substitute
                  </button>
                  <button
                    onClick={() => {
                      setAltProduct(null);
                      if (substituteMode === 'scan') {
                        startSubstituteScanner();
                      } else {
                        startScanning();
                      }
                    }}
                    className="flex-1 bg-white/15 hover:bg-white/20 text-white py-2.5 px-4 rounded-xl border border-white/10 text-xs font-black uppercase tracking-wider active:scale-95 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-2 w-full">
          {status === 'scanning' && (
            <>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: '0ms' }} />
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: '150ms' }} />
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: '300ms' }} />
              </div>
              <p className="text-[9px] font-black text-muted uppercase tracking-[0.2em]">
                {substituteMode === 'scan' ? 'Scanning substitute product QR...' : 'Searching for product QR...'}
              </p>
            </>
          )}

          {(status === 'timeout' || status === 'error') && (
            <div className="w-full space-y-4">
              <div className="flex w-full gap-2">
                <button
                  onClick={() => {
                    setManualError(null);
                    if (substituteMode === 'scan') {
                      startSubstituteScanner();
                    } else {
                      startScanning();
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-ink h-10 px-4 text-xs font-black text-white hover:bg-slate-900 active:scale-95 transition-all shadow-lg"
                >
                  <ScanLine className="h-4 w-4 text-white" />
                  Try Scanning Again
                </button>
              </div>
            </div>
          )}

          {(status === 'scanning' || status === 'timeout' || status === 'error') && (
            <div className="mt-3 w-full border-t border-line pt-3 space-y-2">
              {onSubstitute && (substituteMode === null ? (
                <>
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted/60 block text-center">Product damaged or lost? Release different item:</span>
                  <div className="flex justify-center">
                    <button
                      onClick={async () => {
                        await stopScanner();
                        setSubstituteMode('scan');
                        setManualError(null);
                        setTimeout(() => startSubstituteScanner(), 200);
                      }}
                      className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black uppercase tracking-wider active:scale-95 transition-all shadow-lg shadow-amber-500/20"
                    >
                      <ScanLine className="h-4 w-4" />
                      Scan Different Product
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={async () => {
                      if (timeoutRef.current) clearTimeout(timeoutRef.current);
                      await stopScanner();
                      setSubstituteMode(null);
                      setManualError(null);
                      startScanning();
                    }}
                    className="w-full h-9 rounded-xl border border-line text-muted text-[10px] font-black uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    Back to Main Scanner
                  </button>
                  {manualError && <p className="text-[10px] font-bold text-rose-500 text-center">{manualError}</p>}
                </div>
              ))}
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="h-1 w-12 rounded-full bg-emerald-100 mb-4" />
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
                Verification Successful
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductVerificationModal;

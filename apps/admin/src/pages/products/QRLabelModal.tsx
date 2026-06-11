import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLenis } from '@camera-rental-house/ui';
import PrintLabel from '../../components/ui/PrintLabel';

type QRLabelModalProps = {
  product: any;
  onClose: () => void;
};

const QRLabelModal = ({ product, onClose }: QRLabelModalProps) => {
  const lenis = useLenis();

  useEffect(() => {
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = '';
    };
  }, [lenis]);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink/30 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-[2.5rem] bg-white p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-white/60">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 border border-line text-muted transition hover:bg-white hover:text-ink"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="mb-6 text-xl font-black text-ink">Product Label Preview</h2>
        <PrintLabel product={product} />
      </div>
    </div>,
    document.body
  );
};

export default QRLabelModal;

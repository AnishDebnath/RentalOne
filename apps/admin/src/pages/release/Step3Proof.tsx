import { useRef } from 'react';
import { Camera, ShieldCheck, RefreshCw } from 'lucide-react';
import { compressImage } from '@camera-rental-house/ui';

interface Props {
  photo: string | null;
  onCapture: (photo: string) => void;
  onClear: () => void;
  isReadOnly?: boolean;
}

const Step3Proof = ({ photo, onCapture, onClear, isReadOnly }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const compressed = await compressImage(base64) as string;
        onCapture(compressed);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  return (
    <section className="card-surface p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 shadow-sm border border-orange-100">
          <Camera className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-tight text-ink">Step 3 — Handover Proof</h3>
          <p className="text-xs font-medium text-muted mt-0.5">Capture live photo of user with products</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center">
          <div className={`relative h-72 w-72 rounded-3xl border-2 overflow-hidden transition-all duration-500 ${photo ? 'border-emerald-500 shadow-xl scale-105' : 'border-dashed border-slate-200 bg-slate-50/50'}`}>
            {photo ? (
              <img src={photo} className="h-full w-full object-cover" alt="Handover Proof" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <Camera className="h-12 w-12 text-slate-300" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Capture</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {isReadOnly ? (
             <div className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-500">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                Handover Evidence Linked
             </div>
          ) : !photo ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-12 flex items-center justify-center gap-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all hover:border-orange-500/30 active:scale-95"
            >
              <Camera className="h-5 w-5 text-orange-600" />
              Take Handover Photo
            </button>
          ) : (
            <div className="space-y-3">
              <div className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-100 text-sm font-bold text-emerald-600 animate-in fade-in zoom-in duration-300">
                <ShieldCheck className="h-5 w-5" />
                Handover Proof Captured!
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-500 hover:text-orange-600 hover:bg-slate-50 transition-all active:scale-95"
              >
                <RefreshCw className="h-4 w-4" />
                Retake Photo
              </button>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </section>
  );
};

export default Step3Proof;

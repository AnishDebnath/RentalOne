import { Camera, ScanLine } from 'lucide-react';

const QRScanner = ({ title, description, onMockScan }) => (
  <div className="card-surface space-y-4 p-5 md:p-6">
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-card bg-primary-light text-primary">
        <ScanLine className="h-5 w-5" />
      </div>
      <div>
        <p className="text-base font-bold text-ink">{title}</p>
        <p className="text-sm font-medium text-muted">{description}</p>
      </div>
    </div>
    <div className="rounded-card border border-dashed border-line bg-white/60 px-6 py-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-card bg-white text-primary shadow-sm">
        <Camera className="h-6 w-6" />
      </div>
      <p className="text-sm font-bold tracking-tight text-ink">Camera Authorization Required</p>
      <p className="mt-1 text-xs font-medium text-muted">Tap below to request permission and start scanning.</p>
    </div>
    <button type="button" onClick={onMockScan} className="secondary-button w-full shadow-sm">
      Scan QR Code
    </button>
  </div>
);

export default QRScanner;

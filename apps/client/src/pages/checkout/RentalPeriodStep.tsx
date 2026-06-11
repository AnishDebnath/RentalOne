import { motion } from 'framer-motion';
import { Info, Clock, RefreshCw, ShieldCheck } from 'lucide-react';
import CustomCalendar from '../../components/ui/CustomCalendar';
import LoadingButton from '../../components/ui/LoadingButton';

interface RentalPeriodStepProps {
  pickupDate: Date | null;
  dropDate: Date | null;
  onDateClick: (date: Date) => void;
  onPrev: () => void;
  onNext: () => void;
}

const RentalPeriodStep = ({ pickupDate, dropDate, onDateClick, onPrev, onNext }: RentalPeriodStepProps) => {
  const guidelines = [
    {
      title: 'Standard Timing',
      desc: 'Pickup starts at 10 AM. Return by 12 PM on your end date.',
      Icon: Clock
    },
    {
      title: 'Grace Period',
      desc: '1-hour buffer for returns. Late fees apply after that.',
      Icon: RefreshCw
    },
    {
      title: 'Damage Protection',
      desc: 'All gear is inspected before pickup and upon return.',
      Icon: ShieldCheck
    }
  ];

  return (
    <motion.section
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className="space-y-6"
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white/50 p-6 md:p-8 lg:p-10 backdrop-blur-2xl transition-all duration-300 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-1 bg-primary rounded-full" />
          <div>
            <h2 className="text-xl font-bold tracking-tight text-ink">Rental Duration</h2>
            <p className="text-xs text-muted font-medium">Select your pickup and return milestones.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-10 items-start">
          {/* Left Side: Guidelines */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="p-6 rounded-3xl bg-white/40 border border-white shadow-sm space-y-6">
              <div className="flex items-center gap-3 text-primary">
                <Info className="h-5 w-5" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Rental Guidelines</h3>
              </div>

              <div className="space-y-6">
                {guidelines.map((g) => (
                  <div key={g.title} className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary border border-primary/5 shadow-sm shrink-0">
                      <g.Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ink mb-1">{g.title}</h4>
                      <p className="text-[11px] font-medium text-muted leading-relaxed">{g.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
              <p className="text-[11px] font-medium text-ink/70 leading-relaxed italic">
                "Please ensure you have your ID or QR code of profile ready during pickup for a smooth handover."
              </p>
            </div>
          </div>

          {/* Right Side: Calendar */}
          <div className="order-1 lg:order-2">
            <CustomCalendar
              pickupDate={pickupDate}
              dropDate={dropDate}
              onDateClick={onDateClick}
              readOnly={true}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={onPrev}
            className="secondary-button !w-full sm:!w-1/3 !rounded-2xl !h-14"
          >
            Go Back
          </button>
          <LoadingButton
            disabled={!pickupDate || !dropDate}
            onClick={onNext}
            className="!rounded-2xl !h-14"
          >
            Confirm Order
          </LoadingButton>
        </div>
      </div>
    </motion.section>
  );
};

export default RentalPeriodStep;

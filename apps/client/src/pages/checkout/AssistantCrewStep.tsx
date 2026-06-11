import { motion } from 'framer-motion';
import { Users, Minus, Plus, Info, HelpCircle, ShieldCheck, Clock } from 'lucide-react';
import LoadingButton from '../../components/ui/LoadingButton';

interface AssistantCrewStepProps {
  assistantCount: number;
  onChange: (count: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

const AssistantCrewStep = ({ assistantCount, onChange, onPrev, onNext }: AssistantCrewStepProps) => {
  const handleDecrement = () => {
    if (assistantCount > 0) {
      onChange(assistantCount - 1);
    }
  };

  const handleIncrement = () => {
    if (assistantCount < 10) {
      onChange(assistantCount + 1);
    }
  };

  const guidelines = [
    {
      title: 'Equipment Support',
      desc: 'Assists with setup, breakdown, and transport of heavy gear.',
      Icon: Users
    },
    {
      title: 'Expert Handling',
      desc: 'Experienced crew members ensuring optimal safety of all devices.',
      Icon: ShieldCheck
    },
    {
      title: 'Dynamic Shifts',
      desc: 'Crew charges are calculated based on shifts and rental duration.',
      Icon: Clock
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
        <div className="absolute top-0 right-0 h-40 w-40 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-1 bg-primary rounded-full" />
          <div>
            <h2 className="text-xl font-bold tracking-tight text-ink">Assistant Crew Support</h2>
            <p className="text-xs text-muted font-medium">Add skilled support staff for your rental equipment handling.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-10 items-start">
          {/* Left Side: Guidelines */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="p-6 rounded-3xl bg-white/40 border border-white shadow-sm space-y-6">
              <div className="flex items-center gap-3 text-primary">
                <HelpCircle className="h-5 w-5" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Crew Guidelines</h3>
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
                "Assistant crew members are dedicated to supporting your setup, transport, and equipment configuration on set."
              </p>
            </div>
          </div>

          {/* Right Side: Interactive Selector */}
          <div className="order-1 lg:order-2 space-y-8 bg-white/40 border border-white shadow-sm p-6 md:p-8 rounded-[2rem]">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white border border-line text-primary shadow-sm">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-ink leading-tight">Hire Assistant Crew</h3>
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1.5">Number of crew persons needed</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-5 bg-white/60 border border-white shadow-sm p-3.5 rounded-3xl w-full max-w-[280px]">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={assistantCount === 0}
                className={`h-11 w-11 rounded-2xl flex items-center justify-center transition-all bg-white border border-line shadow-sm active:scale-95
                  ${assistantCount === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50 text-ink'}
                `}
              >
                <Minus className="h-4.5 w-4.5" />
              </button>

              <div className="w-24 text-center select-none">
                <span className="text-2xl font-bold text-primary leading-none">{assistantCount}</span>
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-none mt-1">
                  {assistantCount === 1 ? 'Person' : 'People'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleIncrement}
                disabled={assistantCount === 10}
                className={`h-11 w-11 rounded-2xl flex items-center justify-center transition-all bg-white border border-line shadow-sm active:scale-95
                  ${assistantCount === 10 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50 text-ink'}
                `}
              >
                <Plus className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3">
              <Info className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] font-medium text-ink/70 leading-relaxed">
                Need hands on-site? Request up to 10 crew members. Select 0 if you have your own crew.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={onPrev}
            className="secondary-button !w-full sm:!w-1/3 !rounded-2xl !h-14"
          >
            Go Back
          </button>
          <LoadingButton
            onClick={onNext}
            className="!rounded-2xl !h-14"
          >
            Continue to Summary
          </LoadingButton>
        </div>
      </div>
    </motion.section>
  );
};

export default AssistantCrewStep;

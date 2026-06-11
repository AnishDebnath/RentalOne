import { CheckCheck, LucideIcon, ChevronRight } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  Icon: LucideIcon;
}

interface CheckoutHeaderProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (index: number) => void;
}

const CheckoutHeader = ({ steps, currentStep, onStepClick }: CheckoutHeaderProps) => {
  return (
    <header className="w-full mb-8">
      <div className="flex flex-col gap-5">
        <h1 className="text-2xl font-bold text-ink tracking-tight px-4">Checkout</h1>

        <div className="flex w-full md:w-fit items-center justify-between md:justify-start md:gap-2 overflow-x-auto hide-scrollbar px-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center shrink-0">
              <button
                onClick={() => onStepClick(i)}
                disabled={i > currentStep}
                className={`
                  flex items-center transition-all duration-500 rounded-2xl py-2.5
                  ${i === currentStep
                    ? 'bg-primary text-white px-5 gap-3 shadow-lg shadow-primary/20'
                    : i < currentStep
                      ? 'bg-success/10 text-success hover:bg-success/15 px-3 border border-success/10'
                      : 'bg-white/50 text-muted/70 px-3 border border-line/40'
                  }
                `}
              >
                <div className={`
                  flex h-6 w-6 items-center justify-center rounded-full border transition-colors
                  ${i === currentStep ? 'border-white/30 bg-white/10' : i < currentStep ? 'border-success/20 bg-success/10' : 'border-line/60'}
                `}>
                  {i < currentStep ? <CheckCheck className="h-3.5 w-3.5" /> : <s.Icon className="h-3.5 w-3.5" />}
                </div>

                {i === currentStep && (
                  <span className="text-xs font-bold whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                    {s.label}
                  </span>
                )}
              </button>

              {i < steps.length - 1 && (
                <div className="mx-2 text-muted/90">
                  <ChevronRight className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default CheckoutHeader;

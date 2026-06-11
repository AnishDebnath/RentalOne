import { ShieldCheck, Zap, Sparkles, Clock, Headphones, Wallet } from 'lucide-react';

const reasons = [
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Premium Gear",
    description: "Access latest top-tier cameras, lenses, and production equipment.",
    color: "from-blue-500/10 to-blue-500/5 text-blue-600",
  },
  {
    icon: <Wallet className="h-6 w-6" />,
    title: "Affordable Rates",
    description: "Transparent pricing without hidden costs or security deposits.",
    color: "from-emerald-500/10 to-emerald-500/5 text-emerald-600",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Flexible Rental",
    description: "Daily, weekly, or monthly plans tailored to your project timeline.",
    color: "from-amber-500/10 to-amber-500/5 text-amber-600",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Instant Booking",
    description: "Reserve your gear in seconds with our streamlined checkout.",
    color: "from-cyan-500/10 to-cyan-500/5 text-cyan-600",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="app-shell">
      <div className="flex items-center justify-between pl-4 mb-6">
        <h2 className="text-xl font-bold text-ink md:text-2xl">
          Why Rent From Us
        </h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-2">
        {reasons.map((reason, index) => (
          <div
            key={index}
            className="group flex flex-col items-start rounded-[20px] sm:rounded-[24px] bg-white/60 backdrop-blur-xl p-4 sm:p-6 xl:p-7 border border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-300 hover:bg-white/95 hover:shadow-[0_12px_32px_rgba(31,56,82,0.08)]"
          >
            <div className={`mb-3 sm:mb-5 flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br ${reason.color} border border-white shadow-sm transition-transform duration-500 group-hover:scale-110`}>
              <div className="scale-75 sm:scale-100 flex items-center justify-center">{reason.icon}</div>
            </div>
            <h3 className="mb-1 sm:mb-2 text-sm sm:text-base font-bold text-slate-800 tracking-tight">{reason.title}</h3>
            <p className="text-[11px] sm:text-sm leading-relaxed text-slate-500 font-medium opacity-90">
              {reason.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;

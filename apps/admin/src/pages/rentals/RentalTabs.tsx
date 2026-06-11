type RentalTabsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  counts: { [key: string]: number };
};

const RentalTabs = ({ activeTab, setActiveTab, counts }: RentalTabsProps) => {
  const tabs = [
    {
      id: 'upcoming',
      label: 'To Collect',
      tone: 'bg-sky-50',
      accent: 'bg-sky-500',
      text: 'text-sky-700'
    },
    {
      id: 'active',
      label: 'Active',
      tone: 'bg-amber-50',
      accent: 'bg-amber-500',
      text: 'text-amber-700'
    },
    {
      id: 'returning',
      label: 'To Return',
      tone: 'bg-emerald-50',
      accent: 'bg-emerald-500',
      text: 'text-emerald-700'
    },
  ];

  return (
    <section className="grid grid-cols-3 gap-2 sm:gap-4">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`group relative flex flex-col items-center justify-between overflow-hidden rounded-[1rem] border border-line p-3 text-center transition-all sm:p-4 ${tab.tone} ${tab.text} ${isActive
              ? 'shadow-sm scale-[1.02] z-10'
              : 'hover:bg-white shadow-sm'
              }`}
          >
            <p className={`flex min-h-[24px] items-center text-[9px] font-bold uppercase tracking-wider sm:text-xs ${isActive ? 'opacity-80' : 'text-tertiary'
              }`}>
              {tab.label}
            </p>
            <p className="mt-1 text-2xl font-black sm:mt-2 sm:text-3xl">
              {counts[tab.id] || 0}
            </p>

            {/* Selection Indicator Line */}
            <div className={`absolute bottom-0 left-0 h-1.5 w-full transition-transform duration-300 ${isActive ? `${tab.accent} translate-y-0` : 'translate-y-full'
              }`} />
          </button>
        );
      })}
    </section>
  );
};

export default RentalTabs;

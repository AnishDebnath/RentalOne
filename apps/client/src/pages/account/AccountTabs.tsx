import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface AccountTabsProps {
  tabs: readonly Tab[];
  activeTab: string;
  onTabChange: (id: any) => void;
}

const AccountTabs = ({ tabs, activeTab, onTabChange }: AccountTabsProps) => {
  return (
    <div className="flex w-full rounded-[1.25rem] md:rounded-full border border-white/60 bg-white/40 p-1.5 shadow-sm backdrop-blur-md md:w-fit md:min-w-[420px]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-xl md:rounded-full px-2 py-2.5 md:px-4 md:py-3 text-[10px] md:text-sm font-bold transition-all duration-300 ${isActive ? 'text-white' : 'text-muted hover:text-ink'
              }`}
          >
            {isActive && (
              <motion.div
                layoutId="account-active-tab"
                className="absolute inset-0 bg-primary shadow-sm rounded-xl md:rounded-full"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-1.5 whitespace-nowrap text-center text-wrap sm:whitespace-nowrap flex-col sm:flex-row leading-tight">
              <tab.icon className="h-4 w-4 md:h-4 md:w-4 shrink-0 mb-0.5 sm:mb-0" />
              <span>{tab.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default AccountTabs;

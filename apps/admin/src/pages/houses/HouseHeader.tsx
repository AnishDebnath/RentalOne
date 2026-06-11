import { PlusCircle } from 'lucide-react';

type HouseHeaderProps = {
  onAddClick: () => void;
};

const HouseHeader = ({ onAddClick }: HouseHeaderProps) => (
  <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="min-w-0">
      <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">Production Houses</h1>
      <p className="mt-1 text-xs font-medium text-muted sm:text-sm">Manage business partners and production house bookings.</p>
    </div>
    <button 
      onClick={onAddClick}
      className="primary-button group"
    >
      <PlusCircle className="mr-2 h-4 w-4" />
      Add New House
    </button>
  </div>
);

export default HouseHeader;

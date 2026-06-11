import { Search, UserRound, ShieldCheck, Loader2 } from 'lucide-react';
import FilterSelect from '../../components/ui/FilterSelect';

type UserFiltersProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
};

const STATUS_OPTIONS = [
  { label: 'All Users', value: 'all', icon: <UserRound className="h-3.5 w-3.5" /> },
  { label: 'Verified', value: 'verified', icon: <ShieldCheck className="h-3.5 w-3.5 text-success" /> },
  { label: 'Review Pending', value: 'review', icon: <Loader2 className="h-3.5 w-3.5 text-warning" /> },
];

const UserFilters = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter }: UserFiltersProps) => (
  <section className="bg-white rounded-[1rem] border border-line shadow-sm p-4 flex flex-col md:flex-row items-stretch gap-4">
    <label className="input-shell flex-1 min-h-11 md:max-w-lg">
      <Search className="h-4 w-4 text-muted" />
      <input
        type="search"
        placeholder="Search customer name, phone, or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border-0 bg-transparent p-0 text-sm font-medium focus:ring-0"
      />
    </label>

    <div className="md:w-[240px]">
      <FilterSelect
        options={STATUS_OPTIONS}
        value={statusFilter}
        onChange={setStatusFilter}
        placeholder="Filter Status"
      />
    </div>
  </section>
);

export default UserFilters;

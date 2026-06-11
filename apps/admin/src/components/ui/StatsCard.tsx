import { Box, CalendarRange, IndianRupee, Users } from 'lucide-react';

const icons = {
  box: Box,
  calendar: CalendarRange,
  users: Users,
  'indian-rupee': IndianRupee,
};

const StatsCard = ({ item }) => {
  const Icon = icons[item.icon] || Box;
  const isNegative = String(item.change).startsWith('-');

  return (
    <article className="card-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-card bg-primary-light text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={`rounded-pill px-3 py-1 text-xs font-bold ${
            isNegative ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'
          }`}
        >
          {item.change}
        </span>
      </div>
      <p className="mt-5 text-sm font-bold text-ink">{item.label}</p>
      <p className="mt-4 text-3xl font-bold tracking-tight text-ink">{item.value}</p>
      <p className="mt-3 text-xs font-medium text-muted">{item.note || 'This month'}</p>
    </article>
  );
};

export default StatsCard;

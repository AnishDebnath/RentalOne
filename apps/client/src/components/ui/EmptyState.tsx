import { Link } from 'react-router-dom';

const EmptyState = ({ title, message, actionLabel, actionTo, icon }) => (
  <div className="card-surface flex flex-col items-center gap-4 px-6 py-12 text-center">
    <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-primary-light text-primary">
      {icon}
    </div>
    <div className="space-y-2">
      <h3 className="text-xl font-semibold text-ink">{title}</h3>
      <p className="text-sm text-muted">{message}</p>
    </div>
    <Link to={actionTo} className="primary-button">
      {actionLabel}
    </Link>
  </div>
);

export default EmptyState;

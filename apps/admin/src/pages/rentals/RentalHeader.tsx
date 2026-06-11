type RentalHeaderProps = {
  isStaff: boolean;
};

const RentalHeader = ({ isStaff }: RentalHeaderProps) => {
  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">Rentals</h1>
        <p className="mt-1 text-xs font-medium text-muted sm:text-sm">
          {isStaff
            ? 'Counter view for handoffs, returns, and customer pickup timing.'
            : 'Track upcoming, active, and completed camera rental orders.'}
        </p>
      </div>
    </div>
  );
};

export default RentalHeader;

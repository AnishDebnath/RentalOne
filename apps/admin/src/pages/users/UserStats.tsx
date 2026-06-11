type UserStatsProps = {
  totalUsers: number;
  verifiedUsers: number;
  pendingUsers: number;
};

const UserStats = ({ totalUsers, verifiedUsers, pendingUsers }: UserStatsProps) => {
  const stats = [
    { label: 'Total Customers', value: totalUsers, tone: 'bg-sky-50' },
    { label: 'Verified', value: verifiedUsers, tone: 'bg-emerald-50' },
    { label: 'Needs Review', value: pendingUsers, tone: 'bg-amber-50' },
  ];

  return (
    <section className="grid grid-cols-3 gap-2 sm:gap-4">
      {stats.map((item) => (
        <article
          key={item.label}
          className={`flex flex-col items-center justify-between rounded-[1rem] border border-line p-3 text-center shadow-sm sm:p-4 ${item.tone}`}
        >
          <p className="flex min-h-[24px] items-center text-[9px] font-bold uppercase tracking-wider text-tertiary sm:text-xs">
            {item.label}
          </p>
          <p className="mt-1 text-2xl font-bold text-ink sm:mt-2 sm:text-3xl">{item.value}</p>
        </article>
      ))}
    </section>
  );
};

export default UserStats;

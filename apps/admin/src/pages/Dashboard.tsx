import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  PackagePlus,
  ScanLine,
  Sparkles,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StatsCard from '../components/ui/StatsCard';
import { adminRentals, adminStats, adminUsers } from '../data/mockAdmin';
import { getAuthRole } from '@camera-rental-house/shared';

const shortcuts = [
  {
    title: 'Add Camera Kit',
    description: 'Create inventory and QR label',
    href: '/products/add',
    icon: PackagePlus,
    className: 'bg-sky-50',
  },
  {
    title: 'Review Rentals',
    description: 'Check pickups and returns',
    href: '/rentals',
    icon: CalendarClock,
    className: 'bg-amber-50',
  },
  {
    title: 'Counter Station',
    description: 'Release or return gear',
    href: '/release',
    icon: ScanLine,
    className: 'bg-emerald-50',
  },
  {
    title: 'Customer Records',
    description: 'Verify identity documents',
    href: '/users',
    icon: Users,
    className: 'bg-violet-50',
  },
];

const salesData = [
  { date: 'Jan 2026', label: 'Jan', revenue: 84000, rentals: 18 },
  { date: 'Feb 2026', label: 'Feb', revenue: 148000, rentals: 27 },
  { date: 'Mar 2026', label: 'Mar', revenue: 126000, rentals: 24 },
  { date: 'Apr 2026', label: 'Apr', revenue: 182000, rentals: 33 },
  { date: 'May 2026', label: 'May', revenue: 158000, rentals: 29 },
  { date: 'Jun 2026', label: 'Jun', revenue: 119000, rentals: 22 },
  { date: 'Jul 2026', label: 'Jul', revenue: 76000, rentals: 15 },
  { date: 'Aug 2026', label: 'Aug', revenue: 174000, rentals: 31 },
  { date: 'Sep 2026', label: 'Sep', revenue: 151000, rentals: 28 },
  { date: 'Oct 2026', label: 'Oct', revenue: 196000, rentals: 36 },
  { date: 'Nov 2026', label: 'Nov', revenue: 164000, rentals: 30 },
  { date: 'Dec 2026', label: 'Dec', revenue: 91000, rentals: 19 },
];

const customerSummary = [
  { label: 'New Customers', value: '15', tone: 'bg-sky-50' },
  { label: 'VIP Customers', value: '12', tone: 'bg-amber-50' },
  { label: 'Total Customers', value: '342', tone: 'bg-emerald-50' },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const SalesLineChart = () => {
  const [activeIndex, setActiveIndex] = useState(salesData.length - 3);
  const width = 760;
  const height = 260;
  const padding = { top: 28, right: 28, bottom: 44, left: 68 };

  const { points, linePath, areaPath, yTicks, activePoint, minValue, maxValue } = useMemo(() => {
    const values = salesData.map((item) => item.revenue);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const paddedMin = Math.max(0, min - range * 0.25);
    const paddedMax = max + range * 0.2;
    const paddedRange = paddedMax - paddedMin || 1;

    const nextPoints = salesData.map((item, index) => {
      const x = padding.left + (index / (salesData.length - 1)) * chartWidth;
      const y = padding.top + ((paddedMax - item.revenue) / paddedRange) * chartHeight;
      return { ...item, x, y };
    });

    let nextLinePath = `M ${nextPoints[0]?.x || 0} ${nextPoints[0]?.y || 0}`;
    for (let i = 0; i < nextPoints.length - 1; i++) {
      const p1 = nextPoints[i];
      const p2 = nextPoints[i + 1];
      const cx = (p1.x + p2.x) / 2;
      nextLinePath += ` C ${cx} ${p1.y}, ${cx} ${p2.y}, ${p2.x} ${p2.y}`;
    }

    const baseline = height - padding.bottom;
    const nextAreaPath = `${nextLinePath} L ${nextPoints[nextPoints.length - 1].x} ${baseline} L ${nextPoints[0].x} ${baseline} Z`;
    const ticks = [paddedMax, paddedMin + paddedRange * 0.66, paddedMin + paddedRange * 0.33, paddedMin].map(
      (value) => ({
        value,
        y: padding.top + ((paddedMax - value) / paddedRange) * chartHeight,
      }),
    );

    return {
      points: nextPoints,
      linePath: nextLinePath,
      areaPath: nextAreaPath,
      yTicks: ticks,
      activePoint: nextPoints[activeIndex] || nextPoints[0],
      minValue: paddedMin,
      maxValue: paddedMax,
    };
  }, [activeIndex]);

  const tooltipLeft = `${(activePoint.x / width) * 100}%`;
  const tooltipTop = `${(activePoint.y / height) * 100}%`;

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-white px-2 py-6 border border-line shadow-sm">
      <div
        className="pointer-events-none absolute z-10 w-48 -translate-x-1/2 rounded-[1rem] border border-line bg-white px-4 py-3 text-left shadow-xl transition-all duration-300"
        style={{
          left: tooltipLeft,
          top: tooltipTop,
          transform: `translate(-50%, ${activePoint.y < 90 ? '24px' : '-115%'})`,
        }}
      >
        <p className="text-[11px] font-semibold text-muted mb-2">{activePoint.date}</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold text-ink">{activePoint.rentals}</span>
            <span className="text-muted font-medium">Rental Orders</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold text-ink">{formatCurrency(activePoint.revenue)}</span>
            <span className="text-muted font-medium">Revenue</span>
          </div>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="h-72 w-full" role="img" aria-label="Monthly rental revenue line chart">
        <defs>
          <linearGradient id="salesArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0f766e" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0f766e" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Vertical Dashed Grid Lines */}
        {points.map((point, index) => (
          <line key={`grid-${index}`} x1={point.x} x2={point.x} y1={padding.top} y2={height - padding.bottom} stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
        ))}

        {/* Y-Axis Labels */}
        {yTicks.map((tick) => (
          <text key={tick.y} x={padding.left - 16} y={tick.y + 4} textAnchor="end" className="fill-muted text-[11px] font-medium">
            ₹{Math.round(tick.value / 1000)}k
          </text>
        ))}

        {/* Active Background Pill */}
        <rect
          x={activePoint.x - 14}
          y={padding.top - 8}
          width="28"
          height={height - padding.top - padding.bottom + 16}
          fill="#f1f5f9"
          rx="8"
          className="transition-all duration-300"
        />

        {/* Chart Lines */}
        <path d={areaPath} fill="url(#salesArea)" className="transition-all duration-300" />
        <path d={linePath} fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300" />

        {/* Interaction Areas and Points */}
        {points.map((point, index) => (
          <g key={point.date}>
            <rect
              x={point.x - 18}
              y={padding.top}
              width="36"
              height={height - padding.top - padding.bottom}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setActiveIndex(index)}
            />
            {index === activeIndex && (
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#0f766e"
                stroke="#ffffff"
                strokeWidth="2"
                className="cursor-pointer transition-all duration-300 pointer-events-none"
              />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};

const Dashboard = () => {
  const role = getAuthRole();
  const isStaff = role === 'staff';
  const visibleShortcuts = isStaff ? shortcuts.slice(1, 3) : shortcuts;
  const topCustomers = [...adminUsers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 3);

  return (
    <div className="admin-shell space-y-5 py-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">Dashboard</h1>
          <p className="mt-2 text-sm font-medium text-muted">
            {isStaff
              ? "Today's rental handoffs, returns, and counter workflow."
              : 'Welcome back. Here is what is happening across the rental house today.'}
          </p>
        </div>
        <Link to={isStaff ? '/release' : '/products/add'} className="primary-button">
          <Sparkles className="mr-2 h-4 w-4" />
          {isStaff ? 'Open Station' : 'New Product'}
        </Link>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {visibleShortcuts.map((shortcut) => {
          const Icon = shortcut.icon;
          return (
            <Link
              key={shortcut.title}
              to={shortcut.href}
              className={`group flex min-h-20 items-start justify-between rounded-[1rem] border border-line p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-cardHover ${shortcut.className}`}
            >
              <div>
                <p className="text-sm font-bold text-ink">{shortcut.title}</p>
                <p className="mt-1 text-xs font-medium text-muted">{shortcut.description}</p>
              </div>
              <div className="flex items-center gap-2 text-ink">
                <Icon className="h-4 w-4" />
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {adminStats.map((item) => (
              <StatsCard key={item.label} item={item} />
            ))}
          </div>

          <section className="card-surface p-5 md:p-6">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-bold text-ink">Sales Analytics</h2>
                <p className="mt-1 text-sm font-medium text-muted">Monthly rental revenue trend.</p>
              </div>
              <div className="flex rounded-pill border border-line bg-white p-1">
                {['Daily', 'Weekly', 'Monthly'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`rounded-pill px-4 py-2 text-xs font-bold ${item === 'Monthly' ? 'bg-primary text-white' : 'text-muted'
                      }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <SalesLineChart />
          </section>
        </div>

        <aside className="min-w-0 space-y-5">
          <section className="card-surface p-5">
            <h2 className="text-lg font-bold text-ink">Customer Insights</h2>
            <div className="mt-5 space-y-4">
              {customerSummary.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-full ${item.tone}`}>
                      <Users className="h-4 w-4 text-ink" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-ink">{item.label}</p>
                      <p className="text-xs font-medium text-muted">This week</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-ink">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-line pt-5">
              <p className="text-sm font-bold text-ink">Top Customers</p>
              <div className="mt-4 space-y-3">
                {topCustomers.map((customer) => (
                  <Link
                    key={customer.id}
                    to={`/users/${customer.id}`}
                    className="flex items-center justify-between rounded-[1rem] px-1 py-1 transition hover:bg-primary-light"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-ink">
                        {customer.full_name
                          .split(' ')
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join('')}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-ink">{customer.full_name}</p>
                        <p className="text-xs font-medium text-muted">{customer.totalRentals} rentals</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-success">{formatCurrency(customer.totalSpent)}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="card-surface p-5">
            <h2 className="text-lg font-bold text-ink">Active Rentals</h2>
            <div className="mt-4 space-y-3">
              {[...adminRentals.upcoming, ...adminRentals.active].map((rental) => (
                <Link
                  key={rental.id}
                  to="/rentals"
                  className="block rounded-[1rem] border border-line bg-white p-4 transition hover:border-slate-300"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-ink">{rental.name}</p>
                    <span className="rounded-pill bg-emerald-50 px-3 py-1 text-xs font-bold text-success">
                      {rental.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-medium text-muted">{rental.items}</p>
                </Link>
              ))}
            </div>
            <div className="mt-5 rounded-[1rem] bg-emerald-50 p-4">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="h-4 w-4" />
                <p className="text-sm font-bold">Retention 60%</p>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
                <div className="h-full w-3/5 rounded-full bg-success" />
              </div>
              <p className="mt-2 text-xs font-medium text-muted">+2.4% from last month</p>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
};

export default Dashboard;

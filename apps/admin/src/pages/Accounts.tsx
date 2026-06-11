import { useState } from 'react';
import { Wallet, TrendingUp, Receipt, ArrowUpRight, ArrowDownRight, ArrowUpCircle, ArrowDownCircle, History, CalendarDays, Calendar } from 'lucide-react';
import DataTable from '../components/ui/DataTable';
import clsx from 'clsx';

const mockTransactions = [
  { id: '1', type: 'Income', title: 'Order #CR-12039', category: 'Rental', amount: 4500.00, date: '2026-04-26' },
  { id: '2', type: 'Expense', title: 'Office Rent', category: 'Operational', amount: 15000.00, date: '2026-04-25' },
  { id: '3', type: 'Income', title: 'Order #CR-12035', category: 'Rental', amount: 2100.00, date: '2026-04-24' },
  { id: '4', type: 'Expense', title: 'Camera Repair', category: 'Maintenance', amount: 3500.00, date: '2026-04-23' },
  { id: '5', type: 'Income', title: 'Order #CR-12030', category: 'Rental', amount: 6700.00, date: '2026-04-22' },
];

const mockMonthlyTransactions = [
  { id: 'm1', type: 'Income', title: 'April 2026 Revenue', category: 'Monthly Total', amount: 84200.00, date: 'April 2026' },
  { id: 'm2', type: 'Expense', title: 'April 2026 Expenses', category: 'Monthly Total', amount: 32100.00, date: 'April 2026' },
  { id: 'm3', type: 'Income', title: 'March 2026 Revenue', category: 'Monthly Total', amount: 78500.00, date: 'March 2026' },
  { id: 'm4', type: 'Expense', title: 'March 2026 Expenses', category: 'Monthly Total', amount: 28400.00, date: 'March 2026' },
];

const Accounts = () => {
  const [viewMode, setViewMode] = useState<'day' | 'month'>('day');

  const columns = [
    {
      key: 'title',
      label: 'Transaction',
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className={clsx(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            row.type === 'Income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          )}>
            {row.type === 'Income' ? <ArrowUpCircle className="h-4.5 w-4.5" /> : <ArrowDownCircle className="h-4.5 w-4.5" />}
          </div>
          <div>
            <p className="font-bold text-ink">{row.title}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{row.category}</p>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (row: any) => (
        <span className={clsx("text-xs font-bold", row.type === 'Income' ? 'text-emerald-600' : 'text-rose-600')}>
          {row.type}
        </span>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (row: any) => (
        <span className={clsx("font-black", row.type === 'Income' ? 'text-ink' : 'text-rose-600')}>
          {row.type === 'Income' ? '+' : '-'}₹{row.amount.toLocaleString()}
        </span>
      )
    },
    { key: 'date', label: viewMode === 'day' ? 'Date' : 'Period' }
  ];

  const renderMobileCard = (row: any) => (
    <div key={row.id} className="card-surface p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={clsx(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            row.type === 'Income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          )}>
            {row.type === 'Income' ? <ArrowUpCircle className="h-4 w-4" /> : <ArrowDownCircle className="h-4 w-4" />}
          </div>
          <p className="font-bold text-ink">{row.title}</p>
        </div>
        <span className={clsx("font-black text-sm", row.type === 'Income' ? 'text-emerald-600' : 'text-rose-600')}>
          {row.type === 'Income' ? '+' : '-'}₹{row.amount.toLocaleString()}
        </span>
      </div>
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted">
        <span>{row.category}</span>
        <span>{row.date}</span>
      </div>
    </div>
  );

  return (
    <div className="admin-shell py-8">
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-ink">Accounts & Financials</h1>
          <p className="text-sm font-medium text-muted">Track cash flow, rental income, and business expenses.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex p-1 bg-slate-100 rounded-[1rem] border border-line">
            <button
              onClick={() => setViewMode('day')}
              className={clsx(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                viewMode === 'day' ? "bg-white text-primary shadow-sm" : "text-muted hover:text-ink"
              )}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              Daily
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={clsx(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                viewMode === 'month' ? "bg-white text-primary shadow-sm" : "text-muted hover:text-ink"
              )}
            >
              <Calendar className="h-3.5 w-3.5" />
              Monthly
            </button>
          </div>
          <div className="h-8 w-px bg-line" />
          <div className="flex gap-2">
            <button className="secondary-button text-xs px-4 h-9">
              <History className="mr-2 h-4 w-4" />
              Report
            </button>
            <button className="primary-button text-xs px-4 h-9">
              <Receipt className="mr-2 h-4 w-4" />
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Balance', value: '₹1,24,500', icon: Wallet, color: 'text-primary', tone: 'bg-primary/5' },
          { label: viewMode === 'day' ? 'Today\'s Income' : 'Monthly Income', value: viewMode === 'day' ? '₹13,300' : '₹84,200', icon: TrendingUp, color: 'text-emerald-500', tone: 'bg-emerald-50' },
          { label: viewMode === 'day' ? 'Today\'s Expenses' : 'Monthly Expenses', value: viewMode === 'day' ? '₹15,000' : '₹32,100', icon: Receipt, color: 'text-rose-500', tone: 'bg-rose-50' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[1rem] border border-line bg-white p-6 shadow-sm hover:shadow-sm transition-all">
            <div className="mb-4 flex items-center justify-between">
              <div className={clsx("flex h-12 w-12 items-center justify-center rounded-[1rem]", stat.tone, stat.color)}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50">
                <ArrowUpRight className="h-4 w-4 text-muted" />
              </div>
            </div>
            <p className="text-xs font-bold text-muted uppercase tracking-widest">{stat.label}</p>
            <p className="mt-1 text-2xl font-black text-ink">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="font-black text-ink flex items-center gap-2">
            {viewMode === 'day' ? 'Daily Transactions' : 'Monthly Aggregates'}
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-black">
              {viewMode === 'day' ? mockTransactions.length : mockMonthlyTransactions.length}
            </span>
          </h2>
          <button className="text-xs font-bold text-primary hover:underline">View All</button>
        </div>
        <DataTable
          columns={columns}
          rows={viewMode === 'day' ? mockTransactions : mockMonthlyTransactions}
          renderMobileCard={renderMobileCard}
        />
      </div>
    </div>
  );
};

export default Accounts;

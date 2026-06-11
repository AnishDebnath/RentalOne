import React from 'react';
import { UserRound, Phone, Mail, Calendar, ShoppingCart, IndianRupee } from 'lucide-react';

type UserPersonalInfoProps = {
  user: any;
  isChanged: (field: string) => boolean;
};

const UserPersonalInfo = ({ user, isChanged }: UserPersonalInfoProps) => {
  const formattedDate = user.created_at
    ? `${String(new Date(user.created_at).getDate()).padStart(2, '0')}-${String(
        new Date(user.created_at).getMonth() + 1
      ).padStart(2, '0')}-${new Date(user.created_at).getFullYear()}`
    : 'N/A';

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <section className="bg-white rounded-[1rem] border border-line shadow-sm p-5 md:p-6">
      <div className="mb-4 flex items-center gap-2 border-b border-line pb-3">
        <UserRound className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-ink">Personal Information</h2>
      </div>
      <div className="space-y-3">
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          {[
            {
              label: 'Phone',
              value: user.phone || 'N/A',
              tone: 'bg-sky-50',
              Icon: Phone,
              iconColor: 'text-sky-600',
              field: 'phone',
            },
            {
              label: 'Email',
              value: user.email || 'N/A',
              tone: 'bg-emerald-50',
              Icon: Mail,
              iconColor: 'text-emerald-600',
              field: 'email',
            },
            {
              label: 'Joined',
              value: formattedDate,
              tone: 'bg-amber-50',
              Icon: Calendar,
              iconColor: 'text-amber-600',
              field: '',
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`relative rounded-card p-4 text-sm font-medium text-muted transition-all ${
                item.tone
              } ${isChanged(item.field) ? 'ring-2 ring-amber-400 ring-offset-1' : ''}`}
            >
              {isChanged(item.field) && (
                <span className="absolute -top-2 right-2 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white animate-pulse">
                  Changed
                </span>
              )}
              <div className="flex items-center gap-2">
                <item.Icon className={`h-3.5 w-3.5 ${item.iconColor}`} />
                <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
              </div>
              <p className="mt-1 break-words font-bold text-ink">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
          {[
            {
              label: 'Total Rentals',
              value: `${user.totalRentals || 0} Orders`,
              tone: 'bg-indigo-50',
              Icon: ShoppingCart,
              iconColor: 'text-indigo-600',
            },
            {
              label: 'Total Spent',
              value: formatCurrency(user.totalSpent || 0),
              tone: 'bg-rose-50',
              Icon: IndianRupee,
              iconColor: 'text-rose-600',
            },
          ].map((item) => (
            <div key={item.label} className={`rounded-card p-4 text-sm font-medium text-muted ${item.tone}`}>
              <div className="flex items-center gap-2">
                <item.Icon className={`h-3.5 w-3.5 ${item.iconColor}`} />
                <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
              </div>
              <p className="mt-1 break-words font-bold text-ink">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserPersonalInfo;

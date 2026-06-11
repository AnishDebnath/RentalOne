export type AppRole = 'admin' | 'staff' | 'user';

export const isValidRole = (value: string | null): value is AppRole =>
  value === 'admin' || value === 'staff' || value === 'user';

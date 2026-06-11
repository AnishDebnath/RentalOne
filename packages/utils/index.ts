/**
 * Shared utility functions for the Camera Rental House platform.
 */

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

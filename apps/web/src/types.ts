/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RentalItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  rented: number;
  pricePerDay: number;
  status: 'available' | 'low_stock' | 'out_of_stock';
  image: string;
  qrCode: string;
}

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  itemRented: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: 'active' | 'pending' | 'completed' | 'overdue';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  avatar: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  connected: boolean;
  iconName: string;
}

export interface QuickStats {
  totalRevenue: number;
  activeRentals: number;
  upcomingReturns: number;
  inventoryUtilization: number;
}

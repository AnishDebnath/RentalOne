export const adminStats = [
  { label: 'Total Products', value: '124', change: '+12.5%', icon: 'box', note: 'This month' },
  { label: 'Active Rentals', value: '18', change: '+8.2%', icon: 'calendar', note: 'Today' },
  { label: 'Total Customers', value: '342', change: '+9.0%', icon: 'users', note: 'All time' },
  { label: 'Revenue', value: 'Rs 2.4L', change: '+14.0%', icon: 'indian-rupee', note: 'This month' },
];

export const adminProducts = [
  {
    id: '1',
    name: 'Sony FX3 Cinema Camera',
    brand: 'Sony',
    category: 'Cameras',
    description: 'Compact full-frame cinema camera with cage, top handle, and dual media kit.',
    price_per_day: 4200,
    created_at: '2026-03-28',
    unique_code: 'CAM-8D2L',
    status: 'in_stock',
    available_quantity: 1,
    qr_base64: 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=CAM-8D2L',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: '2',
    name: 'Canon RF 24-70mm f/2.8L',
    brand: 'Canon',
    category: 'Lenses',
    description: 'Fast RF zoom lens for events, interviews, and production coverage.',
    price_per_day: 1800,
    created_at: '2026-03-30',
    unique_code: 'LNS-7YQ1',
    status: 'in_stock',
    available_quantity: 5,
    qr_base64: 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=LNS-7YQ1',
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=500&q=80',
  },
];

export const adminUsers = [
  {
    id: 'u1',
    full_name: 'Alex Director',
    phone: '9876543210',
    email: 'alex@example.com',
    created_at: '2026-02-18',
    totalRentals: 8,
    totalSpent: 58400,
    is_blocked: false,
    aadhaar_signed_url: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80',
    voter_signed_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'u2',
    full_name: 'Maya Films',
    phone: '9012345678',
    email: 'maya@example.com',
    created_at: '2026-01-09',
    totalRentals: 4,
    totalSpent: 22800,
    is_blocked: true,
    aadhaar_signed_url: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80',
    voter_signed_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  },
];

export const adminRentals = {
  upcoming: [
    {
      id: 'RN-8821',
      name: 'Rohan Sharma',
      items: 'Sony FX3 + 24-70mm',
      status: 'upcoming',
    },
  ],
  active: [
    {
      id: 'RN-8819',
      name: 'Vikram Singh',
      items: 'A7S III + G-Master',
      status: 'released',
    },
  ],
};

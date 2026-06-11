export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  platform: 'Google';
}

export const reviews: Review[] = [
  {
    id: '1',
    author: 'Rahul Sharma',
    avatar: 'https://i.pravatar.cc/150?u=rahul',
    rating: 5,
    date: '2 months ago',
    comment: 'Best camera rental service in the city! The Sony A7IV was in pristine condition. Highly recommend for professional shoots.',
    platform: 'Google'
  },
  {
    id: '2',
    author: 'Priya Patel',
    avatar: 'https://i.pravatar.cc/150?u=priya',
    rating: 5,
    date: '3 weeks ago',
    comment: 'Very smooth booking process and friendly staff. They even helped me set up the gimbal. Great experience!',
    platform: 'Google'
  },
  {
    id: '3',
    author: 'Ankit Verma',
    avatar: 'https://i.pravatar.cc/150?u=ankit',
    rating: 4,
    date: '1 day ago',
    comment: 'Wide range of lenses available. Prices are competitive. The pick-up location is also very convenient.',
    platform: 'Google'
  },
  {
    id: '4',
    author: 'Sneha Gupta',
    avatar: 'https://i.pravatar.cc/150?u=sneha',
    rating: 5,
    date: '1 month ago',
    comment: 'I rented a lighting kit for a wedding shoot. Everything worked perfectly. Their customer support is top-notch!',
    platform: 'Google'
  },
  {
    id: '5',
    author: 'Vikram Singh',
    avatar: 'https://i.pravatar.cc/150?u=vikram',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Impressive inventory. They have all the latest cinematic gear. The online portal is very easy to use.',
    platform: 'Google'
  }
];

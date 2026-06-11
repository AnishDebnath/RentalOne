import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useToast } from '@camera-rental-house/ui';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { addToast } = useToast();
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('camera_rental_house_demo_cart');
    return stored ? JSON.parse(stored) : [];
  });

  const [pickupDate, setPickupDateState] = useState<Date | null>(() => {
    const stored = localStorage.getItem('camera_rental_house_demo_pickup');
    return stored ? new Date(stored) : null;
  });

  const [dropDate, setDropDateState] = useState<Date | null>(() => {
    const stored = localStorage.getItem('camera_rental_house_demo_drop');
    return stored ? new Date(stored) : null;
  });

  const setPickupDate = (date: Date | null) => {
    setPickupDateState(date);
    if (date) {
      localStorage.setItem('camera_rental_house_demo_pickup', date.toISOString());
    } else {
      localStorage.removeItem('camera_rental_house_demo_pickup');
    }
  };

  const setDropDate = (date: Date | null) => {
    setDropDateState(date);
    if (date) {
      localStorage.setItem('camera_rental_house_demo_drop', date.toISOString());
    } else {
      localStorage.removeItem('camera_rental_house_demo_drop');
    }
  };

  const persist = (next) => {
    setItems(next);
    localStorage.setItem('camera_rental_house_demo_cart', JSON.stringify(next));
  };

  const value = useMemo(
    () => ({
      items,
      subtotal: items.reduce((sum, item) => sum + item.price_per_day, 0),
      pickupDate,
      dropDate,
      setPickupDate,
      setDropDate,
      addToCart: (product) => {
        if (items.some((item) => item.id === product.id)) return;
        const productWithDates = {
          ...product,
          pickup_date: product.pickup_date || (pickupDate ? pickupDate.toISOString() : null),
          drop_date: product.drop_date || (dropDate ? dropDate.toISOString() : null),
        };
        persist([...items, productWithDates]);
        addToast({ title: 'Added to cart', message: product.name, tone: 'success' });
      },
      removeFromCart: (productId) => {
        persist(items.filter((item) => item.id !== productId));
        addToast({ title: 'Removed from cart', message: 'Item removed.', tone: 'info' });
      },
      clearCart: () => persist([]),
    }),
    [addToast, items, pickupDate, dropDate],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

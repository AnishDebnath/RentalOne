import { createContext, useContext, useMemo, useState } from 'react';
import { useToast } from '@camera-rental-house/ui';

const FavouritesContext = createContext(null);

export const FavouritesProvider = ({ children }) => {
  const { addToast } = useToast();
  const [favourites, setFavourites] = useState(() => {
    const stored = localStorage.getItem('camera_rental_house_demo_favourites');
    return stored ? JSON.parse(stored) : [];
  });

  const persist = (next) => {
    setFavourites(next);
    localStorage.setItem('camera_rental_house_demo_favourites', JSON.stringify(next));
  };

  const value = useMemo(
    () => ({
      favourites,
      isFavourite: (id) => favourites.some((item) => item.id === id),
      toggleFavourite: (product) => {
        const exists = favourites.some((item) => item.id === product.id);
        const next = exists
          ? favourites.filter((item) => item.id !== product.id)
          : [...favourites, product];
        persist(next);
        addToast({
          title: exists ? 'Removed from favourites' : 'Added to favourites',
          message: product.name,
          tone: exists ? 'info' : 'success',
        });
      },
    }),
    [addToast, favourites],
  );

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>;
};

export const useFavourites = () => {
  const context = useContext(FavouritesContext);
  if (!context) throw new Error('useFavourites must be used within FavouritesProvider');
  return context;
};

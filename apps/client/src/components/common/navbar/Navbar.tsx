import { useState, useEffect, Fragment, memo } from 'react';
import { Search, ShoppingBag, User, ChevronDown, LogOut, Package, Heart, LayoutGrid, Camera, PackageSearch } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Popover, Transition } from '@headlessui/react';
import { useAuth } from '../../../store/AuthContext';
import { useCart } from '../../../store/CartContext';
import { useFavourites } from '../../../store/FavouritesContext';
import clsx from 'clsx';
import { useTypewriter } from '../../../hooks/useTypewriter';
import { logo } from '@rentalone/shared';


const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isCategoryPage = location.pathname === '/category';
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();
  const { favourites } = useFavourites();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const placeholderText = useTypewriter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/category?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        isCategoryPage ? 'absolute' : 'fixed',
        'inset-x-0 top-0 z-[1000] transition-[background-color,border-color,box-shadow,backdrop-filter,transform,padding-top,padding-bottom] duration-500',
        isScrolled
          ? 'bg-white/30 backdrop-blur-[40px] py-3 border-b border-white/60 shadow-[0_10px_40px_rgba(31,_38,_135,_0.05)]'
          : 'bg-transparent py-5'
      )}
    >
      {/* Liquid Glass Highlight Overlay (shows only when scrolled) */}
      <div className={clsx(
        'absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none transition-opacity duration-500',
        isScrolled ? 'opacity-100' : 'opacity-0'
      )} />

      <div className="relative app-shell flex items-center justify-between gap-4 md:gap-8 z-10">
        {/* Left: Logo Section - Refined for professional weight */}
        <Link to="/" className="flex items-center group shrink-0">
          <img
            src={logo}
            alt="Camera Rental House"
            className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 origin-left"
          />
        </Link>

        {/* Center: Search Bar (Desktop) with Typing Animation */}
        {!isCategoryPage && (
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl items-center relative group"
          >
            <div className="absolute left-4 z-10">
              <Search className="h-4.5 w-4.5 text-muted group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder={placeholderText}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-14 rounded-2xl border border-white/60 bg-white/40 ring-1 ring-black/[0.03] backdrop-blur-md text-sm font-medium transition-all focus:bg-white focus:border-primary/40 focus:ring-4 focus:ring-primary/10 hover:border-primary/20 outline-none truncate placeholder:text-muted/60"
            />
            <Link
              to="/category"
              className="absolute right-2 h-8 w-8 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-white/40"
              title="View Categories"
            >
              <LayoutGrid className="h-4 w-4" />
            </Link>
          </form>
        )}

        {/* Right Section: Balanced icons & account */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Mobile Search Button */}
          {!isCategoryPage && (
            <button
              type="button"
              onClick={() => navigate('/category')}
              className="flex md:hidden h-10 w-10 items-center justify-center rounded-full bg-white/40 backdrop-blur-md border border-white/60 hover:bg-white/60 transition-colors"
            >
              <Search className="h-5 w-5 text-ink" />
            </button>
          )}

          {/* Favourites & Cart Icons (xl+ only) */}
          <Link
            to="/favourites"
            className="group relative hidden lg:flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/40 transition-colors"
          >
            <Heart className="h-5 w-5 text-ink group-hover:text-primary transition-colors" />
            {favourites.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-white">
                {favourites.length}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="group relative hidden lg:flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/40 transition-colors"
          >
            <ShoppingBag className="h-5 w-5 text-ink group-hover:text-primary transition-colors" />
            {items.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-white">
                {items.length}
              </span>
            )}
          </Link>

          {/* User Profile / Auth */}
          {isAuthenticated ? (
            <Popover className="relative">
              <Popover.Button className="flex items-center gap-2.5 rounded-full p-1 pr-3 border border-white/60 bg-white/40 backdrop-blur-md hover:bg-white/60 transition-all duration-200 focus:outline-none">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-primary-hover text-white font-bold text-sm shrink-0 overflow-hidden border border-white/40">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
                  ) : (
                    user?.fullName?.[0] || 'U'
                  )}
                </div>
                <span className="text-sm font-semibold text-ink max-w-[120px] sm:max-w-[200px] lg:max-w-[280px] truncate">
                  <span className="opacity-60 font-medium">Hey, </span>{user?.fullName}
                </span>
                <ChevronDown className="h-4 w-4 text-muted shrink-0" />
              </Popover.Button>

              <Transition
                as={Fragment}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Popover.Panel className="absolute right-0 mt-2 min-w-[14rem] w-max max-w-[18rem] sm:max-w-[22rem] origin-top-right z-[1001] divide-y divide-line rounded-2xl bg-white/95 backdrop-blur-xl p-2 shadow-xl ring-1 ring-black/5 focus:outline-none">
                  {({ close }) => (
                    <>
                      <div className="flex items-center gap-3 px-3 py-3">
                        <div className="h-10 w-10 rounded-xl overflow-hidden border border-line shrink-0">
                          {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold">
                              {user?.fullName?.[0] || 'U'}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Account</p>
                          <p className="mt-0.5 truncate text-sm font-bold text-ink">{user?.fullName}</p>
                        </div>
                      </div>
                      <div className="py-2 text-ink/80">
                        <Link to="/account?tab=active" onClick={() => close()} className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-page hover:text-primary">
                          <Camera className="h-4 w-4" /> Active Rentals
                        </Link>
                        <Link to="/account?tab=history" onClick={() => close()} className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-page hover:text-primary">
                          <PackageSearch className="h-4 w-4" /> Rental History
                        </Link>
                        <Link to="/account?tab=details" onClick={() => close()} className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-page hover:text-primary">
                          <User className="h-4 w-4" /> My Profile
                        </Link>
                      </div>
                      <div className="py-2">
                        <button onClick={() => { logout(); close(); }} className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/5">
                          <LogOut className="h-4 w-4" /> Log out
                        </button>
                      </div>
                    </>
                  )}
                </Popover.Panel>
              </Transition>
            </Popover>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="secondary-button !h-10 min-w-[70px] sm:min-w-[90px] !px-4 !text-sm flex items-center justify-center !rounded-full border border-white/60 bg-white/40"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="primary-button !h-10 min-w-[70px] sm:min-w-[90px] !px-4 !text-sm flex items-center justify-center !rounded-full shadow-lg shadow-primary/20"
              >
                Join
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default memo(Navbar);

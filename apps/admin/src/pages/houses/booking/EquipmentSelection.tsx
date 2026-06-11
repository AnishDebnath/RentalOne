import { Package, Filter } from 'lucide-react';
import ProductInventoryFilters from '../../../components/ui/ProductInventoryFilters';
import { BookingProductCard } from './BookingProductCard';

interface EquipmentSelectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  brandFilter: string;
  setBrandFilter: (brand: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  categoryOptions: any[];
  brandOptions: any[];
  statusOptions: any[];
  filteredProducts: any[];
  cart: any[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  hasDatesSelected: boolean;
  onSelectDatesClick?: () => void;
}

export const EquipmentSelection = ({
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
  categoryFilter,
  setCategoryFilter,
  brandFilter,
  setBrandFilter,
  statusFilter,
  setStatusFilter,
  categoryOptions,
  brandOptions,
  statusOptions,
  filteredProducts,
  cart,
  addToCart,
  removeFromCart,
  hasDatesSelected,
  onSelectDatesClick
}: EquipmentSelectionProps) => {
  return (
    <section className="card-surface p-6 space-y-6">
      <div className="flex items-center gap-3 pb-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500 border border-sky-100/50 shadow-sm">
          <Package className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-ink leading-none">Select Products</h2>
          <p className="text-[10px] font-bold text-muted uppercase mt-1.5">Browse & Add Equipment</p>
        </div>
      </div>

      <ProductInventoryFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        brandFilter={brandFilter}
        setBrandFilter={setBrandFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryOptions={categoryOptions}
        brandOptions={brandOptions}
        statusOptions={statusOptions}
        className="shadow-none border-0 bg-transparent p-0"
      />

      <div className="border-t border-line/50 pt-6">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
            <Filter className="h-10 w-10 mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest">No products match filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filteredProducts.map(product => (
              <BookingProductCard
                key={product.id}
                product={product}
                isInCart={cart.some(item => item.id === product.id)}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                hasDatesSelected={hasDatesSelected}
                onSelectDatesClick={onSelectDatesClick}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

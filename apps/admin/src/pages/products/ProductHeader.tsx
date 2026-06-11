import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductHeader = () => {
  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">Inventory</h1>
        <p className="mt-1 text-xs font-medium text-muted sm:text-sm">
          Manage inventory, pricing, stock, and QR labels.
        </p>
      </div>
      <Link to="/products/add" className="primary-button h-9 px-3 text-xs sm:h-11 sm:px-5 sm:text-sm whitespace-nowrap">
        <Plus className="mr-2 h-4 w-4" />
        Add Product
      </Link>
    </div>
  );
};

export default ProductHeader;

import { ImagePlus, Loader2, Plus, Save, X } from 'lucide-react';
import { type FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PrintLabel from '../../components/ui/PrintLabel';
import CustomSelect from '../../components/ui/CustomSelect';
import axiosInstance from '../../api/axiosInstance';
import { CATEGORIES_LIST as categoryOptions, BRANDS_LIST as brandOptions } from '@camera-rental-house/shared';
import ConfirmModal from '../../components/ui/ConfirmModal';
import ProductFormSkeleton from './ProductFormSkeleton';


type ProductFormState = {
  name: string;
  brand: string;
  category: string;
  description: string;
  price: string;
  price_2_days: string;
  price_5_days: string;
  is_out_of_stock: boolean;
};

const initialForm: ProductFormState = {
  name: '',
  brand: '',
  category: '',
  description: '',
  price: '',
  price_2_days: '',
  price_5_days: '',
  is_out_of_stock: false,
};

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState<ProductFormState>(initialForm);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Add Mode specific
  const [createdProduct, setCreatedProduct] = useState<any | null>(null);

  // Edit Mode specific
  const [product, setProduct] = useState<any>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [removeImageUrls, setRemoveImageUrls] = useState<string[]>([]);

  // Shared file upload
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const { data } = await axiosInstance.get(`/products/${id}`);
          setProduct(data);
          setExistingImages(data.images || []);
          setForm({
            name: data.name,
            brand: data.brand,
            category: data.category,
            description: data.description,
            price: String(data.price_per_day),
            price_2_days: data.price_2_days ? String(data.price_2_days) : '',
            price_5_days: data.price_5_days ? String(data.price_5_days) : '',
            is_out_of_stock: data.available_quantity === 0,
          });
        } catch (err) {
          setError('Failed to load gear details.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode]);

  const handleNewImages = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const remainingSlots = 5 - (existingImages.length - removeImageUrls.length + newFiles.length);
    const filesArray = Array.from(selectedFiles).slice(0, remainingSlots);
    const previewsArray = filesArray.map(file => URL.createObjectURL(file));
    setNewFiles(prev => [...prev, ...filesArray]);
    setNewPreviews(prev => [...prev, ...previewsArray]);
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newPreviews[index]);
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const toggleRemoveExisting = (url: string) => {
    setRemoveImageUrls(prev =>
      prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const activeImagesCount = existingImages.length - removeImageUrls.length + newFiles.length;
    if (activeImagesCount === 0) {
      setError('Please upload at least one product image.');
      return;
    }
    if (!form.name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!form.category) {
      setError('Please select a category.');
      return;
    }
    if (!form.brand) {
      setError('Please select a brand.');
      return;
    }
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) {
      setError('Please enter a valid rental price.');
      return;
    }
    if (!form.description.trim()) {
      setError('Description is required.');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    setIsSaving(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('brand', form.brand);
      formData.append('category', form.category);
      formData.append('description', form.description);
      formData.append('pricePerDay', form.price);
      if (form.price_2_days) formData.append('price2Days', form.price_2_days);
      if (form.price_5_days) formData.append('price5Days', form.price_5_days);
      formData.append('availableQuantity', form.is_out_of_stock ? '0' : '1');

      newFiles.forEach(file => formData.append('images', file));

      if (isEditMode) {
        formData.append('removeImageUrls', JSON.stringify(removeImageUrls));
        await axiosInstance.put(`/admin/products/${id}`, formData);
        navigate('/products');
      } else {
        const { data } = await axiosInstance.post('/admin/products', formData);
        setCreatedProduct({ name: data.name, unique_code: data.unique_code, qr_base64: data.qr_base64 });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `Failed to ${isEditMode ? 'update' : 'create'} product. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-shell space-y-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
            <p className="mt-1 line-clamp-1 text-xs font-medium text-muted sm:text-sm sm:line-clamp-none">
              {isEditMode ? 'Update details for this product.' : 'Register a unique physical item.'}
            </p>
          </div>
          <Link to="/products" className="secondary-button h-9 px-3 text-xs sm:h-11 sm:px-5 sm:text-sm whitespace-nowrap">
            Back to Inventory
          </Link>
        </div>
        <ProductFormSkeleton />
      </div>
    );
  }

  if (createdProduct && !isEditMode) {
    return (
      <div className="admin-shell space-y-6 py-6">
        <div className="rounded-card bg-emerald-50 p-4 border border-emerald-100 text-emerald-800 text-sm font-bold text-center">
          Product added successfully! Each product is now a unique product identity.
        </div>
        <PrintLabel product={createdProduct} />
        <div className="grid gap-3 md:grid-cols-2">
          <button
            onClick={() => { setCreatedProduct(null); setForm(initialForm); setNewPreviews([]); setNewFiles([]); }}
            className="secondary-button"
          >
            Add Another Product
          </button>
          <Link to="/products" className="primary-button text-center flex items-center justify-center">
            Go to Inventory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell space-y-6 py-8">
      {/* Page Header */}
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="mt-1 line-clamp-1 text-xs font-medium text-muted sm:text-sm sm:line-clamp-none">
            {isEditMode ? 'Update details for this product.' : 'Register a unique physical item.'}
          </p>
        </div>
        <Link to="/products" className="secondary-button h-9 px-3 text-xs sm:h-11 sm:px-5 sm:text-sm whitespace-nowrap">
          Back to Inventory
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Images */}
        <div className="card-surface p-5 space-y-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-tertiary">Product Images <span className="text-danger">*</span></p>
            <p className="mt-1 text-sm text-muted">Upload up to 5 photos. First image is the primary display.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {/* Existing Images */}
            {isEditMode && existingImages.map((url, index) => (
              <div key={url} className={`relative aspect-square rounded-card overflow-hidden border ${removeImageUrls.includes(url) ? 'opacity-40 grayscale border-danger' : 'border-line'}`}>
                <img src={url} alt="" className="h-full w-full object-cover" />
                {index === 0 && !removeImageUrls.includes(url) && (
                  <span className="absolute bottom-2 left-2 rounded-full bg-primary/80 px-2 py-0.5 text-xs font-bold text-white backdrop-blur-sm">Primary</span>
                )}
                <button
                  type="button"
                  onClick={() => toggleRemoveExisting(url)}
                  className={`absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-white backdrop-blur-sm shadow-sm transition ${removeImageUrls.includes(url) ? 'bg-primary' : 'bg-black/50 hover:bg-danger'}`}
                >
                  {removeImageUrls.includes(url) ? <Plus className="h-3 w-3" /> : <X className="h-3 w-3" />}
                </button>
              </div>
            ))}

            {/* New Previews */}
            {newPreviews.map((preview, index) => (
              <div key={preview} className="relative aspect-square rounded-card overflow-hidden border border-line">
                <img src={preview} alt="" className="h-full w-full object-cover" />
                {!isEditMode && index === 0 && (
                  <span className="absolute bottom-2 left-2 rounded-full bg-primary/80 px-2 py-0.5 text-xs font-bold text-white backdrop-blur-sm">Primary</span>
                )}
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-danger"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {/* Upload Button */}
            {(existingImages.length - removeImageUrls.length + newFiles.length) < 5 && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-card border border-dashed border-primary/40 bg-white/50">
                <ImagePlus className="h-6 w-6 text-primary" />
                <span className="text-sm font-bold text-muted">{(existingImages.length - removeImageUrls.length + newFiles.length) === 0 ? 'Add Images' : 'Add More'}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    handleNewImages(e.target.files);
                    e.target.value = '';
                  }}
                />
              </label>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="card-surface p-6 space-y-6">
          <div className="border-b border-line pb-4">
            <p className="text-sm font-bold uppercase tracking-widest text-tertiary">Product Details</p>
          </div>

          <label className="block space-y-2">
            <span className="text-base font-semibold text-ink">Product Name <span className="text-danger">*</span></span>
            <div className="input-shell">
              <input
                required
                value={form.name}
                onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
                placeholder="e.g. Sony FX3 Cinema Line"
                className="w-full border-0 bg-transparent p-0 text-base focus:ring-0"
              />
            </div>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <CustomSelect required label="Category" options={categoryOptions} value={form.category} onChange={(val) => setForm((c) => ({ ...c, category: val }))} />
            <CustomSelect required label="Brand" options={brandOptions} value={form.brand} onChange={(val) => setForm((c) => ({ ...c, brand: val }))} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block space-y-2">
              <span className="text-base font-semibold text-ink">Per Day Price <span className="text-danger">*</span></span>
              <div className="input-shell">
                <span className="font-semibold text-muted text-base">₹</span>
                <input
                  required
                  type="text"
                  inputMode="numeric"
                  value={form.price}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, '');
                    const parts = val.split('.');
                    const finalVal = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : val;
                    setForm((c) => ({ ...c, price: finalVal }));
                  }}
                  placeholder="2500"
                  className="w-full border-0 bg-transparent p-0 text-base focus:ring-0"
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-base font-semibold text-ink">2 Days Price <span className="text-muted text-xs font-normal">(Optional)</span></span>
              <div className="input-shell">
                <span className="font-semibold text-muted text-base">₹</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.price_2_days}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, '');
                    const parts = val.split('.');
                    const finalVal = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : val;
                    setForm((c) => ({ ...c, price_2_days: finalVal }));
                  }}
                  placeholder="4500"
                  className="w-full border-0 bg-transparent p-0 text-base focus:ring-0"
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-base font-semibold text-ink">5 Days Price <span className="text-muted text-xs font-normal">(Optional)</span></span>
              <div className="input-shell">
                <span className="font-semibold text-muted text-base">₹</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.price_5_days}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, '');
                    const parts = val.split('.');
                    const finalVal = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : val;
                    setForm((c) => ({ ...c, price_5_days: finalVal }));
                  }}
                  placeholder="10000"
                  className="w-full border-0 bg-transparent p-0 text-base focus:ring-0"
                />
              </div>
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-base font-semibold text-ink">Description <span className="text-danger">*</span></span>
            <div className="input-shell h-auto items-start py-3">
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm((c) => ({ ...c, description: e.target.value }))}
                placeholder="Brief description of the gear features, condition, accessories included..."
                className="w-full resize-none border-0 bg-transparent p-0 text-base focus:ring-0"
              />
            </div>
          </label>

          <div className="flex items-center justify-between rounded-xl border border-line bg-slate-50/50 p-4 shadow-sm">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-ink">Out of Stock</span>
              <p className="text-xs text-muted font-medium">Make this product unavailable for rent.</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={form.is_out_of_stock}
                onChange={(e) => setForm((c) => ({ ...c, is_out_of_stock: e.target.checked }))}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-danger peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none" />
            </label>
          </div>

          {isEditMode && product ? (
            <div className="rounded-card bg-amber-50 p-4 border border-amber-100">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Warning: Active Product</p>
              <p className="mt-1 text-sm text-amber-600 leading-relaxed">
                A QR code and unique product code ({product.unique_code}) are already generated and actively tracked for this product. Please do not change major details to avoid mismatching physical asset labels.
              </p>
            </div>
          ) : (
            <div className="rounded-card bg-amber-50 p-4 border border-amber-100">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Unique Identity Policy</p>
              <p className="mt-1 text-sm text-amber-600 leading-relaxed">
                Each product is a unique physical item. Add the same model separately to track serial numbers individually.
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-card bg-danger/5 p-3 text-sm font-bold text-danger border border-danger/20">
              {error}
            </div>
          )}

          <button type="submit" disabled={isSaving} className="primary-button w-full disabled:opacity-50 disabled:cursor-not-allowed">
            {isSaving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{isEditMode ? 'Saving Changes...' : 'Processing...'}</>
            ) : isEditMode ? (
              <><Save className="mr-2 h-4 w-4" />Save Changes</>
            ) : (
              <><Plus className="mr-2 h-4 w-4" />Register Gear & Generate Label</>
            )}
          </button>
        </div>
      </form>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        title={isEditMode ? 'Save Changes?' : 'Add Product?'}
        message={
          isEditMode
            ? 'Are you sure you want to save changes to this product? Active rentals or tracking may be affected.'
            : 'Are you sure you want to add this product? This will generate a new unique product code and QR label.'
        }
        confirmLabel={isEditMode ? 'Confirm Save' : 'Confirm Add'}
        tone="info"
      />
    </div>
  );
}

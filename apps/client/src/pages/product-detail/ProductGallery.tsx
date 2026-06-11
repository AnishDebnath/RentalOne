import ImageCarousel from '../../components/ui/ImageCarousel';

interface ProductImage {
  id: string;
  image_url: string;
  display_order: number;
}

interface ProductGalleryProps {
  images: ProductImage[];
}

const ProductGallery = ({ images }: ProductGalleryProps) => {
  return (
    <div className="space-y-6">
      <ImageCarousel images={images} />
    </div>
  );
};

export default ProductGallery;

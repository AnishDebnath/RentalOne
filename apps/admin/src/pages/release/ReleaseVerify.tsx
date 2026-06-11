import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductVerificationModal from './ProductVerificationModal';
import UserVerificationModal from './UserVerificationModal';
import Step1Products from './Step1Products';
import Step2UserIdentity from './Step2UserIdentity';
import Step3Proof from './Step3Proof';
import ReleaseSummary from './ReleaseSummary';

interface Props {
  rental: any;
  scannedProducts: string[];
  onVerifyProduct: (id: string) => void;
  isUserVerified: boolean;
  onToggleVerify: () => void;
  representativeName: string;
  setRepresentativeName: (name: string) => void;
  proofPhoto: string | null;
  onCapture: (photo: string) => void;
  onClearPhoto: () => void;
  onRelease: () => void;
  onReset: () => void;
  onSubstitute?: (oldId: string, newProduct: any) => void;
  error?: string | null;
  isReturn?: boolean;
}

const ReleaseVerify = ({
  rental,
  scannedProducts,
  onVerifyProduct,
  isUserVerified,
  onToggleVerify,
  representativeName,
  setRepresentativeName,
  proofPhoto,
  onCapture,
  onClearPhoto,
  onRelease,
  onReset,
  onSubstitute,
  error,
  isReturn = false,
}: Props) => {
  const [verifyingProduct, setVerifyingProduct] = useState<any>(null);
  const [isVerifyingUser, setIsVerifyingUser] = useState(false);
  const allProductsScanned = rental.products.every((p: any) => scannedProducts.includes(p.id));

  return (
    <motion.div
      key="verify"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid gap-6 lg:grid-cols-12"
    >
      <AnimatePresence>
        {verifyingProduct && (
          <ProductVerificationModal
            product={verifyingProduct}
            onClose={() => setVerifyingProduct(null)}
            onVerify={onVerifyProduct}
            onSubstitute={!isReturn ? onSubstitute : undefined}
          />
        )}
        {isVerifyingUser && (
          <UserVerificationModal
            user={{
              id: rental.user_id,
              memberId: rental.member_id,
              name: rental.name,
              phone: rental.phone,
              image: rental.user_image
            }}
            onClose={() => setIsVerifyingUser(false)}
            onVerify={onToggleVerify}
          />
        )}
      </AnimatePresence>

      {/* Left Column: Verification Steps */}
      <div className="lg:col-span-7 space-y-5">
        <Step1Products
          products={rental.products}
          scannedProducts={scannedProducts}
          onVerifyClick={setVerifyingProduct}
        />

        <Step2UserIdentity
          user={{
            id: rental.user_id,
            name: rental.name,
            phone: rental.phone,
            image: rental.user_image,
          }}
          isVerified={isUserVerified}
          onToggleVerify={() => setIsVerifyingUser(true)}
          representativeName={representativeName}
          setRepresentativeName={setRepresentativeName}
          isHouseBooking={rental.isHouseBooking}
          isReturn={isReturn}
          hasError={!!error && error.toLowerCase().includes('name')}
        />

        <Step3Proof
          photo={proofPhoto}
          onCapture={onCapture}
          onClear={onClearPhoto}
          isReadOnly={!!rental.handover_proof}
        />
      </div>

      {/* Right Column: Summary & Action */}
      <div className="lg:col-span-5 space-y-5">
        <ReleaseSummary
          allProductsScanned={allProductsScanned}
          isUserVerified={isUserVerified}
          hasProofPhoto={!!proofPhoto}
          representativeName={representativeName}
          isHouseBooking={rental.isHouseBooking}
          onRelease={onRelease}
          onReset={onReset}
        />

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-rose-50 p-4 border border-rose-100"
          >
            <p className="text-xs font-bold text-rose-600 leading-relaxed text-center">
              {error}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ReleaseVerify;

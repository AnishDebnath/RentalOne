import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  rental: any;
  onReset: () => void;
  isReturn?: boolean;
}

const ReleaseSuccess = ({ rental, onReset, isReturn }: Props) => (
  <div className="admin-shell flex min-h-[80vh] items-center justify-center py-10 px-4">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="max-w-md w-full text-center card-surface p-6"
    >
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 shadow-sm border border-emerald-100">
        <CheckCircle2 className="h-12 w-12" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-ink">
        {isReturn ? 'Return Successfully' : 'Release Successfully'}
      </h2>
      <p className="mt-3 text-sm font-medium text-muted leading-relaxed">
        Rental <span className="text-ink font-bold">{rental.rental_no}</span> has been officially {isReturn ? 'returned from' : 'released to'}{' '}
        <span className="text-ink font-bold">{rental.name}</span>.
      </p>
      <div className="mt-8">
        <button onClick={onReset} className="primary-button w-full">
          Start New Release / Return
        </button>
      </div>
    </motion.div>
  </div>
);

export default ReleaseSuccess;

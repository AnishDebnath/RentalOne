import { useMemo, useState } from 'react';
import { User, Calendar as CalendarIcon, ShoppingBag, AlertCircle, Users } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { differenceInDays } from 'date-fns';

import { useAuth } from '../../store/AuthContext';
import { useCart } from '../../store/CartContext';
import axiosInstance from '../../api/axiosInstance';
import { useToast } from '@rentalone/ui';

import CheckoutHeader from './CheckoutHeader';
import UserDetailsStep from './UserDetailsStep';
import RentalPeriodStep from './RentalPeriodStep';
import AssistantCrewStep from './AssistantCrewStep';
import OrderSummaryStep from './OrderSummaryStep';
import SuccessScreen from './SuccessScreen';

const Checkout = () => {
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const { addToast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [assistantCount, setAssistantCount] = useState<number>(0);

  const [finalTotal, setFinalTotal] = useState<number>(0);
  const [finalPickupDate, setFinalPickupDate] = useState<Date | null>(null);
  const [finalDropDate, setFinalDropDate] = useState<Date | null>(null);
  const [rentalNo, setRentalNo] = useState<string>('');

  const isHouse = user?.role === 'partner' || user?.isHouseOwner;

  const steps = useMemo(() => {
    const base = [
      { id: 'details', label: 'User Details', Icon: User },
      { id: 'dates', label: 'Rental Period', Icon: CalendarIcon },
    ];
    if (isHouse) {
      base.push({ id: 'crew', label: 'Assistant Crew', Icon: Users });
    }
    base.push({ id: 'summary', label: 'Order Summary', Icon: ShoppingBag });
    return base;
  }, [isHouse]);

  const currentStepId = steps[step]?.id;

  const checkoutPickupDate = useMemo(() => items[0]?.pickup_date ? new Date(items[0].pickup_date) : null, [items]);
  const checkoutDropDate = useMemo(() => items[0]?.drop_date ? new Date(items[0].drop_date) : null, [items]);

  const totalDays = useMemo(() => {
    if (!checkoutPickupDate || !checkoutDropDate) return 1;
    const diff = differenceInDays(checkoutDropDate, checkoutPickupDate) + 1;
    return Math.max(diff, 1);
  }, [checkoutPickupDate, checkoutDropDate]);

  const calculateItemPrice = (item: any, days: number) => {
    const p1 = Number(item.price_per_day) || 0;
    const p2 = Number(item.price_2_days) || 0;
    const p5 = Number(item.price_5_days) || 0;

    const getRawPrice = (d: number) => {
      let t = 0;
      let r = d;
      if (p5 > 0) {
        t += Math.floor(r / 5) * p5;
        r = r % 5;
      }
      if (p2 > 0 && r >= 2) {
        t += p2;
        r -= 2;
      }
      t += r * p1;
      return t;
    };

    let bestPrice = getRawPrice(days);
    for (let i = 1; i <= 4; i++) {
      const cappedPrice = getRawPrice(days + i);
      if (cappedPrice < bestPrice) bestPrice = cappedPrice;
    }
    return bestPrice;
  };

  const totalCost = items.reduce((sum, item) => sum + calculateItemPrice(item, totalDays), 0);

  const handleConfirm = async () => {
    if (!checkoutPickupDate || !checkoutDropDate) {
      addToast({ title: 'Select Dates', message: 'Please select pickup and return dates.', tone: 'warning' });
      return;
    }

    setLoading(true);
    setFinalTotal(totalCost);
    setFinalPickupDate(checkoutPickupDate);
    setFinalDropDate(checkoutDropDate);

    try {
      const { data } = await axiosInstance.post('/rentals', {
        pickupDate: checkoutPickupDate.toISOString(),
        eventDate: checkoutDropDate.toISOString(),
        assistantCrewCount: isHouse ? assistantCount : 0,
        items: items.map(item => ({
          productId: item.id,
          quantity: 1
        }))
      });

      setRentalNo(data.rental_no);
      addToast({ title: 'Success', message: 'Gear reserved successfully!', tone: 'success' });
      clearCart();
      setComplete(true);
    } catch (err: any) {
      console.error('Failed to create rental:', err);
      addToast({
        title: 'Booking Failed',
        message: err.message || 'Unable to connect to vault. Please try again.',
        tone: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (complete) {
    return (
      <SuccessScreen
        pickupDate={finalPickupDate}
        dropDate={finalDropDate}
        totalCost={finalTotal}
        rentalNo={rentalNo}
      />
    );
  }

  return (
    <div className="page-animate app-shell space-y-8 pt-2">
      <CheckoutHeader
        steps={steps}
        currentStep={step}
        onStepClick={setStep}
      />

      <main className="w-full">
        <AnimatePresence mode="wait">
          {currentStepId === 'details' && (
            <UserDetailsStep
              key="step-details"
              user={user}
              onNext={() => setStep(step + 1)}
            />
          )}

          {currentStepId === 'dates' && (
            <RentalPeriodStep
              key="step-dates"
              pickupDate={checkoutPickupDate}
              dropDate={checkoutDropDate}
              onDateClick={() => { }}
              onPrev={() => setStep(step - 1)}
              onNext={() => setStep(step + 1)}
            />
          )}

          {currentStepId === 'crew' && (
            <AssistantCrewStep
              key="step-crew"
              assistantCount={assistantCount}
              onChange={setAssistantCount}
              onPrev={() => setStep(step - 1)}
              onNext={() => setStep(step + 1)}
            />
          )}

          {currentStepId === 'summary' && (
            <div className="space-y-6">
              {!user.isVerified && (
                <div className="rounded-2xl bg-warning/5 border border-warning/20 p-5 flex items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-warning shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-ink">Verification Pending</p>
                    <p className="text-xs font-medium text-muted leading-relaxed">
                      Your account is currently under review by our team. You can browse and add items to your cart, but you'll be able to confirm rentals once your account is verified.
                    </p>
                  </div>
                </div>
              )}
              <OrderSummaryStep
                key="step-summary"
                items={items}
                totalDays={totalDays}
                subtotal={subtotal}
                totalCost={totalCost}
                calculateItemPrice={calculateItemPrice}
                loading={loading}
                onPrev={() => setStep(step - 1)}
                onConfirm={handleConfirm}
                disabled={!user.isVerified}
                assistantCount={isHouse ? assistantCount : 0}
              />
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Checkout;

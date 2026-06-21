import crypto from 'crypto';
import supabase from '../db/supabase.js';

const randomBlock = (): string =>
  crypto
    .randomBytes(3)
    .toString('hex')
    .toUpperCase()
    .slice(0, 5);

export const generateRentalId = async (): Promise<string> => {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const rentalNo = `RN-${randomBlock()}`;
    const { data, error } = await supabase
      .from('rentals')
      .select('id')
      .eq('rental_no', rentalNo)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return rentalNo;
    }
  }

  throw new Error('Unable to generate a unique rental ID.');
};

export default generateRentalId;

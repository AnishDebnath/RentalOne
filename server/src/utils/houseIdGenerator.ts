import crypto from 'crypto';
import supabase from '../db/supabase.js';

const randomBlock = (): string =>
  crypto
    .randomBytes(4)
    .toString('base64')
    .replace(/[^A-Z0-9]/gi, '')
    .toUpperCase()
    .slice(0, 6);

/**
 * Generates a unique house ID in the format: HSE-YYYY-XXXXXX
 */
export const generateHouseId = async (): Promise<string> => {
  const year = new Date().getFullYear();

  for (let attempt = 0; attempt < 10; attempt++) {
    const houseId = `HSE-${year}-${randomBlock()}`;

    const { data, error } = await supabase
      .from('production_houses')
      .select('id')
      .eq('house_id', houseId)
      .maybeSingle();

    if (error) throw error;

    if (!data) return houseId;
  }

  throw new Error('Unable to generate a unique house ID after 10 attempts.');
};

export default generateHouseId;

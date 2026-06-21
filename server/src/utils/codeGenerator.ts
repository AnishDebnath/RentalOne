import crypto from 'crypto';
import supabase from '../db/supabase.js';

const prefixMap: Record<string, string> = {
  cameras: 'CAM',
  lenses: 'LNS',
  lights: 'LGT',
  audio: 'AUD',
  tripods: 'TRP',
  drones: 'DRN',
  accessories: 'ACC',
};

const randomBlock = (): string =>
  crypto
    .randomBytes(3)
    .toString('base64')
    .replace(/[^A-Z0-9]/gi, '')
    .toUpperCase()
    .slice(0, 4);

export const generateUniqueCode = async (category: string): Promise<string> => {
  const prefix = prefixMap[String(category || '').trim().toLowerCase()] ?? 'PRD';

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const uniqueCode = `${prefix}-${randomBlock()}`;
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .eq('unique_code', uniqueCode)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return uniqueCode;
    }
  }

  throw new Error('Unable to generate a unique product code.');
};

export default generateUniqueCode;

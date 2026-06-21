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
 * Generates a unique member ID in the format: CRH-YYYY-XXXXXX
 * Checks the database for collisions and retries up to 10 times.
 * Once assigned during signup, this ID is permanent and never changes.
 */
export const generateMemberId = async (): Promise<string> => {
  const year = new Date().getFullYear();

  for (let attempt = 0; attempt < 10; attempt++) {
    const memberId = `CRH-${year}-${randomBlock()}`;

    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('member_id', memberId)
      .maybeSingle();

    if (error) throw error;

    // No collision — this ID is unique
    if (!data) return memberId;
  }

  throw new Error('Unable to generate a unique member ID after 10 attempts.');
};

export default generateMemberId;

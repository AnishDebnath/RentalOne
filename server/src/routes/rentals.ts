import crypto from 'crypto';
import express, { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import supabase from '../db/supabase.js';

import generateRentalId from '../utils/rentalIdGenerator.js';
import { validate, validateUuid } from '../validations/middleware.js';
import { createRentalSchema } from '../validations/schemas.js';

const router = express.Router();
const DEFAULT_ASSISTANT_CREW_RATE = 0;

router.post('/', validate(createRentalSchema), async (req: Request, res: Response) => {
  console.log('RENTAL REQUEST BODY:', req.body);
  const { pickupDate, eventDate, items = [], userId: targetUserId, assistantCrewCount = 0 } = req.body;

  if (!pickupDate || !eventDate || !Array.isArray(items) || !items.length) {
    throw new BadRequestError('Pickup date, event date, and cart items are required.');
  }

  if (new Date(pickupDate) > new Date(eventDate)) {
    throw new BadRequestError('Pickup date must be on or before the event date.');
  }

  // Allow admins/staff to place order on behalf of another user (like a production house)
  let finalUserId = req.user.id;
  const userRole = (req.user as any)?.role;
  if (targetUserId && (userRole === 'admin' || userRole === 'staff')) {
    finalUserId = targetUserId;
  }

  const rentalId = crypto.randomUUID();
  const rentalNo = await generateRentalId();

  // Calculate total amount
  const productIds = items.map((item: any) => item.productId);
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, unique_code, price_per_day, images')
    .in('id', productIds);

  if (productsError) throw productsError;

  const days = Math.round((new Date(eventDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const crewCost = (Number(assistantCrewCount) || 0) * DEFAULT_ASSISTANT_CREW_RATE * days;
  const totalAmount = (items || []).reduce((sum: number, item: any) => {
    const product = products?.find((p: any) => p.id === item.productId);
    return sum + (product?.price_per_day || 0) * (item.quantity || 1) * days;
  }, 0) + crewCost;

  // Use same products data for snapshots (avoids a second Supabase round-trip)
  const productSnapshots = (items || []).map((item: any) => {
    const p = products?.find((fp: any) => fp.id === item.productId);
    return {
      id: item.productId,
      name: p?.name || 'Unknown',
      unique_code: p?.unique_code || 'N/A',
      price: p?.price_per_day || 0,
      image: p?.images?.[0] || '',
      status: 'pending_pickup'
    };
  });

  // Check if target user has partner role or is_house_owner set to true (is a production house)
  const { data: userData, error: userDataError } = await supabase
    .from('users')
    .select('role, is_house_owner')
    .eq('id', finalUserId)
    .maybeSingle();

  const isHouseBooking = !userDataError && (userData?.is_house_owner === true || userData?.role === 'partner');

  let rental = null;
  let rentalError = null;

  const insertResult = await supabase
    .from('rentals')
    .insert({
      id: rentalId,
      rental_no: rentalNo,
      user_id: finalUserId,
      pickup_date: pickupDate,
      event_date: eventDate,
      status: 'confirmed',
      total_amount: totalAmount,
      products: productSnapshots,
      assistant_crew_count: assistantCrewCount,
      crew_price: assistantCrewCount > 0 ? DEFAULT_ASSISTANT_CREW_RATE : 0
    } as any)
    .select('id, rental_no')
    .maybeSingle();

  if (insertResult.error && insertResult.error.message.includes('assistant_crew_count')) {
    console.warn('[Rentals Create] assistant_crew_count column not found. Falling back to default insert.');
    const fallbackResult = await supabase
      .from('rentals')
      .insert({
        id: rentalId,
        rental_no: rentalNo,
        user_id: finalUserId,
        pickup_date: pickupDate,
        event_date: eventDate,
        status: 'confirmed',
        total_amount: totalAmount,
        products: productSnapshots
      })
      .select('id, rental_no')
      .maybeSingle();
    rental = fallbackResult.data;
    rentalError = fallbackResult.error;
  } else {
    rental = insertResult.data;
    rentalError = insertResult.error;
  }

  if (rentalError) {
    throw rentalError;
  }

  console.log('Rental created successfully:', rentalId);
  return res.status(201).json(rental);
});

router.get('/my', async (req: Request, res: Response) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const offset = Number(req.query.offset) || 0;

  const { data, count: totalCount, error } = await supabase
    .from('rentals')
    .select('id, rental_no, user_id, pickup_date, event_date, total_amount, status, products, handover_proof_url, released_to_representative_name, returned_by_representative_name, assistant_crew_count, received_at, created_at', { count: 'exact' })
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw error;
  }

  return res.json({ data: data || [], totalCount });
});

// Fetch rentals for a specific production house (by house ID)
router.get('/house/:houseId', validateUuid('houseId'), async (req: Request, res: Response) => {
  const { houseId } = req.params;
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const offset = Number(req.query.offset) || 0;

  // 1. Get the user_id for this house
  const { data: house, error: houseError } = await supabase
    .from('production_houses')
    .select('user_id')
    .eq('id', houseId)
    .single();

  if (houseError || !house?.user_id) {
    throw new NotFoundError('House not found or not linked to a user.');
  }

  // 2. Fetch rentals for that user with pagination
  const { data, count: totalCount, error } = await supabase
    .from('rentals')
    .select('id, rental_no, user_id, pickup_date, event_date, total_amount, status, products, handover_proof_url, released_to_representative_name, returned_by_representative_name, assistant_crew_count, received_at, created_at', { count: 'exact' })
    .eq('user_id', house.user_id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return res.json({ data: data || [], totalCount });
});

// Fetch rentals for a specific production house (by slug)
router.get('/house/slug/:slug', async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const name = slug.replace(/-/g, ' ');
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const offset = Number(req.query.offset) || 0;

  // 1. Get the user_id for this house
  const { data: house, error: houseError } = await supabase
    .from('production_houses')
    .select('user_id')
    .ilike('name', name)
    .single();

  if (houseError || !house?.user_id) {
    throw new NotFoundError('House');
  }

  // 2. Fetch rentals for that user with pagination
  const { data, count: totalCount, error } = await supabase
    .from('rentals')
    .select('id, rental_no, user_id, pickup_date, event_date, total_amount, status, products, handover_proof_url, released_to_representative_name, returned_by_representative_name, assistant_crew_count, received_at, created_at', { count: 'exact' })
    .eq('user_id', house.user_id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return res.json({ data: data || [], totalCount });
});

router.patch('/:id', validateUuid('id'), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { total_amount, products, crew_price, discount } = req.body;

  const updates: any = {};
  if (total_amount !== undefined) updates.total_amount = total_amount;
  if (products !== undefined) updates.products = products;
  if (crew_price !== undefined) updates.crew_price = crew_price;
  if (discount !== undefined) updates.discount = discount;

  if (Object.keys(updates).length === 0) {
    throw new BadRequestError('No fields to update.');
  }

  const { data, error } = await supabase
    .from('rentals')
    .update(updates)
    .eq('id', id)
    .select('id, rental_no, status')
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new NotFoundError('Rental');

  return res.json(data);
});

export default router;

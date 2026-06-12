import crypto from 'crypto';
import express, { Request, Response } from 'express';
import supabase from '../db/supabase';

import generateRentalId from '../utils/rentalIdGenerator.js';

const router = express.Router();
const DEFAULT_ASSISTANT_CREW_RATE = 0;

router.post('/', async (req: Request, res: Response) => {
  try {
    console.log('RENTAL REQUEST BODY:', req.body);
    const { pickupDate, eventDate, items = [], userId: targetUserId, assistantCrewCount = 0 } = req.body;

    if (!pickupDate || !eventDate || !Array.isArray(items) || !items.length) {
      return res.status(400).json({
        message: 'Pickup date, event date, and cart items are required.',
      });
    }

    if (new Date(pickupDate) > new Date(eventDate)) {
      return res.status(400).json({
        message: 'Pickup date must be on or before the event date.',
      });
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
      .select('id, price_per_day')
      .in('id', productIds);

    if (productsError) throw productsError;

    const days = Math.round((new Date(eventDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const crewCost = (Number(assistantCrewCount) || 0) * DEFAULT_ASSISTANT_CREW_RATE * days;
    const totalAmount = (items || []).reduce((sum: number, item: any) => {
      const product = products?.find(p => p.id === item.productId);
      return sum + (product?.price_per_day || 0) * (item.quantity || 1) * days;
    }, 0) + crewCost;
    
    // Fetch full product details for snapshot
    const { data: fullProducts } = await supabase
      .from('products')
      .select('id, name, unique_code, price_per_day, images')
      .in('id', productIds);

    const productSnapshots = (items || []).map((item: any) => {
      const p = fullProducts?.find(fp => fp.id === item.productId);
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
    const { data: userData } = await supabase
      .from('users')
      .select('role, is_house_owner')
      .eq('id', finalUserId)
      .maybeSingle();

    const isHouseBooking = userData?.is_house_owner === true || userData?.role === 'partner';

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
      .select('*')
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
        .select('*')
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
  } catch (error: any) {
    console.error('RENTAL CREATION ERROR:', error);
    return res.status(500).json({ message: error.message || 'Unable to create rental.' });
  }
});

router.get('/my', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('rentals')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return res.json(data || []);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch rentals.' });
  }
});

// Fetch rentals for a specific production house (by house ID)
router.get('/house/:houseId', async (req: Request, res: Response) => {
  try {
    const { houseId } = req.params;
    
    // 1. Get the user_id for this house
    const { data: house, error: houseError } = await supabase
      .from('production_houses')
      .select('user_id')
      .eq('id', houseId)
      .single();
      
    if (houseError || !house?.user_id) {
      return res.status(404).json({ message: 'House not found or not linked to a user.' });
    }

    // 2. Fetch all rentals for that user
    const { data, error } = await supabase
      .from('rentals')
      .select('*')
      .eq('user_id', house.user_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json(data || []);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch house rentals.' });
  }
});

// Fetch rentals for a specific production house (by slug)
router.get('/house/slug/:slug', async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const name = slug.replace(/-/g, ' ');

    // 1. Get the user_id for this house
    const { data: house, error: houseError } = await supabase
      .from('production_houses')
      .select('user_id')
      .ilike('name', name)
      .single();

    if (houseError || !house?.user_id) {
      return res.status(404).json({ message: 'House not found.' });
    }

    // 2. Fetch all rentals for that user
    const { data, error } = await supabase
      .from('rentals')
      .select('*')
      .eq('user_id', house.user_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json(data || []);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch house rentals.' });
  }
});

router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { total_amount, products, crew_price, discount } = req.body;

    const updates: any = {};
    if (total_amount !== undefined) updates.total_amount = total_amount;
    if (products !== undefined) updates.products = products;
    if (crew_price !== undefined) updates.crew_price = crew_price;
    if (discount !== undefined) updates.discount = discount;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No fields to update.' });
    }

    const { data, error } = await supabase
      .from('rentals')
      .update(updates)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Rental not found.' });

    return res.json(data);
  } catch (error: any) {
    console.error('Update Rental Error:', error);
    return res.status(500).json({ message: error.message || 'Unable to update rental.' });
  }
});

export default router;

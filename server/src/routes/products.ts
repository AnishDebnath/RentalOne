import express, { Request, Response } from 'express';
import supabase from '../db/supabase';

const router = express.Router();

/**
 * Convert UTC timestamp to local YYYY-MM-DD format (aligns with India Time +05:30)
 */
const toLocalDateString = (isoString: string) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString.slice(0, 10);
  
  // Align with India Standard Time (+05:30)
  const localTime = date.getTime() + (5.5 * 60 * 60 * 1000);
  const localDate = new Date(localTime);
  return localDate.toISOString().slice(0, 10);
};

/**
 * Overlap check: does rental [rStart, rEnd] overlap with [reqStart, reqEnd]?
 * True if rental starts before or on request end AND ends on or after request start.
 */
const datesOverlap = (rStartStr: string, rEndStr: string, reqStart: string, reqEnd: string) => {
  const rStart = toLocalDateString(rStartStr);
  const rEnd = toLocalDateString(rEndStr);
  return rStart <= reqEnd && rEnd >= reqStart;
};

const enrichProduct = async (product: any, pickupDate?: string, dropDate?: string) => {
  try {
    // Admin-marked out of stock: available_quantity column on product row itself is 0
    // (This is separate from date-based booking)
    if (product.available_quantity !== undefined && product.available_quantity === 0) {
      return { ...product, booking_status: 'out_of_stock' };
    }

    const { data, error } = await supabase
      .from('rentals')
      .select('status, products, pickup_date, event_date')
      .in('status', ['confirmed', 'released']);

    if (error) {
      console.warn('Error fetching rentals for enrichment:', error);
      return { ...product, booking_status: 'available' };
    }

    const rentalsForProduct = (data || []).filter((r: any) =>
      (r.products || []).some((p: any) => p.id === product.id)
    );

    const booked_ranges = rentalsForProduct.map((r: any) => ({
      pickup_date: toLocalDateString(r.pickup_date),
      event_date: toLocalDateString(r.event_date)
    }));

    // If date range provided: check only overlapping rentals
    if (pickupDate && dropDate) {
      const overlapping = rentalsForProduct.filter((r: any) =>
        datesOverlap(r.pickup_date, r.event_date, pickupDate, dropDate)
      );
      let booking_status = 'available';
      if (overlapping.length > 0) {
        booking_status = overlapping.some((r: any) => r.status === 'released' || r.status === 'active') ? 'on_rent' : 'booked';
      }

      // If product has any overdue rental, it can't return -> always on_rent
      const hasOverdue = rentalsForProduct.some((r: any) => {
        const isReleased = r.status === 'released' || r.status === 'active';
        const isOverdue = new Date().setHours(0,0,0,0) > new Date(r.event_date).setHours(0,0,0,0);
        return isReleased && isOverdue;
      });
      if (hasOverdue) {
        booking_status = 'on_rent';
      }

      return {
        ...product,
        booking_status,
        booked_ranges,
      };
    }

    // No date range: fallback to old behavior (only released/active/overdue counts as on_rent, not booked)
    let booking_status = 'available';
    if (rentalsForProduct.length > 0) {
      const hasReleased = rentalsForProduct.some((r: any) => r.status === 'released' || r.status === 'active');
      const hasOverdue = rentalsForProduct.some((r: any) => {
        const isReleased = r.status === 'released' || r.status === 'active';
        const isOverdue = new Date().setHours(0,0,0,0) > new Date(r.event_date).setHours(0,0,0,0);
        return isReleased && isOverdue;
      });
      if (hasReleased || hasOverdue) {
        booking_status = 'on_rent';
      }
    }

    return { ...product, booking_status, booked_ranges };
  } catch (err) {
    console.error('Enrichment exception:', err);
    return { ...product, booking_status: 'available', booked_ranges: [] };
  }
};

router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit || 12);
    const offset = Number(req.query.offset || 0);
    const search = String(req.query.search || '').trim();
    const category = String(req.query.category || '').trim();
    const brand = String(req.query.brand || '').trim();
    const status = String(req.query.status || 'all').toLowerCase();
    const pickupDate = req.query.pickup_date ? String(req.query.pickup_date) : undefined;
    const dropDate = req.query.drop_date ? String(req.query.drop_date) : undefined;

    const sort = req.query.sort ? String(req.query.sort).toLowerCase() : undefined;

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });

    if (category && category.toLowerCase() !== 'all') {
      query = query.ilike('category', category);
    }

    if (brand && brand.toLowerCase() !== 'all') {
      query = query.ilike('brand', brand);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,unique_code.ilike.%${search}%`);
    }

    if (sort !== 'most_rented') {
      query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
    }

    const { data, count, error } = await query;

    if (error) {
      throw error;
    }

    let items = await Promise.all((data || []).map((p) => enrichProduct(p, pickupDate, dropDate)));

    if (sort === 'most_rented') {
      // Fetch rentals count to sort by popularity
      const { data: rentals } = await supabase
        .from('rentals')
        .select('products')
        .in('status', ['confirmed', 'released', 'returned']);

      const rentalCounts: Record<string, number> = {};
      (rentals || []).forEach((r: any) => {
        (r.products || []).forEach((p: any) => {
          if (p.id) {
            rentalCounts[p.id] = (rentalCounts[p.id] || 0) + (p.qty || 1);
          }
        });
      });

      // Sort items by count descending
      items.sort((a: any, b: any) => {
        const countA = rentalCounts[a.id] || 0;
        const countB = rentalCounts[b.id] || 0;
        if (countA !== countB) return countB - countA;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // fallback
      });

      // Slice manually for pagination
      items = items.slice(offset, offset + limit);
    }

    let filteredItems = items;
    if (status === 'in_stock') {
      filteredItems = items.filter((item) => item.booking_status === 'available');
    } else if (status === 'on_rent') {
      filteredItems = items.filter((item) => item.booking_status === 'on_rent');
    } else if (status === 'booked') {
      filteredItems = items.filter((item) => item.booking_status === 'booked');
    } else if (status === 'out_of_stock') {
      filteredItems = items.filter((item) => item.booking_status === 'out_of_stock');
    }

    return res.json({
      items: filteredItems,
      pagination: {
        limit,
        offset,
        total: count || 0,
        hasMore: offset + limit < (count || 0),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch products.' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const pickupDate = req.query.pickup_date ? String(req.query.pickup_date) : undefined;
    const dropDate = req.query.drop_date ? String(req.query.drop_date) : undefined;

    return res.json(await enrichProduct(data, pickupDate, dropDate));
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch product.' });
  }
});

router.get('/:id/label', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('name, unique_code, qr_base64')
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).send('Product not found.');
    }

    return res.send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${data.name} Label</title>
    <style>
      body { font-family: Inter, Arial, sans-serif; background: #fff; color: #111; padding: 32px; }
      .wrap { max-width: 480px; margin: 0 auto; text-align: center; }
      .code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 40px; font-weight: 700; color: #0EA5E9; margin: 16px 0; }
      .print { border: none; background: #0EA5E9; color: #fff; border-radius: 999px; padding: 14px 24px; cursor: pointer; }
      img { width: 260px; height: 260px; object-fit: contain; }
      @media print { .print { display: none; } body { padding: 0; } }
    </style>
  </head>
  <body>
    <div class="wrap">
      <h1>${data.name}</h1>
      <div class="code">${data.unique_code}</div>
      <img src="${data.qr_base64}" alt="${data.name} QR Code" />
      <div style="margin-top: 24px;">
        <button class="print" onclick="window.print()">Print</button>
      </div>
    </div>
  </body>
</html>`);
  } catch (error: any) {
    return res.status(500).send(error.message || 'Unable to generate label.');
  }
});

export default router;

import express, { Request, Response } from 'express';
import supabase from '../db/supabase.js';
import { uploadFile, deleteFile } from '../storage/cloudinary.js';
import { processImage } from '../utils/imageProcessor.js';
import { validate } from '../validations/middleware.js';
import { bulkReleaseSchema, bulkReturnSchema } from '../validations/schemas.js';

const extractPublicId = (url: string | null): string | null => {
  if (!url) return null;
  const parts = url.split('/upload/');
  if (parts.length < 2) return null;
  const path = parts[1].replace(/^v\d+\//, '');
  return decodeURIComponent(path.split('.')[0]);
};

const router = express.Router();



router.get('/me', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { data: staff, error } = await supabase
      .from('staff_accounts')
      .select('id, username, full_name, role, avatar_url')
      .eq('id', userId)
      .single();

    if (error || !staff) {
      return res.status(404).json({ message: 'Staff profile not found.' });
    }

    return res.json(staff);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch profile.' });
  }
});

router.post('/bulk-release', validate(bulkReleaseSchema), async (req: Request, res: Response) => {
  try {
    const { rentalId, productIds, proofPhoto, receivedBy, substitutions } = req.body;
    console.log('[Bulk Release] Request received:', { rentalId, productIdsCount: productIds?.length, hasProof: !!proofPhoto, receivedBy, substitutions });

    if (!rentalId || !productIds || !Array.isArray(productIds)) {
      return res.status(400).json({ message: 'Rental ID and array of Product IDs are required.' });
    }

    const staffId = (req.user as any)?.id || null;
    const staffName = (req.user as any)?.fullName || (req.user as any)?.username || null;

    // Fetch current rental to update products array
    const { data: rental, error: fetchError } = await supabase
      .from('rentals')
      .select('*')
      .eq('id', rentalId)
      .single();

    if (fetchError || !rental) throw fetchError || new Error('Rental not found');

    // Handle Proof Photo
    let proofUrl = null;
    if (proofPhoto) {
      try {
        const base64Data = proofPhoto.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        const processed = await processImage(buffer, { maxWidth: 1200, quality: 80 });
        proofUrl = await uploadFile({
          buffer: processed.buffer,
          key: `proof-${rentalId}-${Date.now()}.jpg`,
          mimetype: processed.mimetype,
          folder: 'Camera Rental House/Handover Proof'
        });
      } catch (uploadErr) {
        console.error('Proof upload failed:', uploadErr);
      }
    }

    // Process substitutions if any
    let finalProducts = rental.products || [];
    if (substitutions && typeof substitutions === 'object') {
      for (const [oldId, newId] of Object.entries(substitutions)) {
        const { data: newProd, error: newProdErr } = await supabase
          .from('products')
          .select('*')
          .eq('id', newId)
          .single();

        if (!newProdErr && newProd) {
          finalProducts = finalProducts.map((p: any) => {
            if (p.id === oldId) {
              return {
                ...p,
                id: newProd.id,
                name: newProd.name,
                unique_code: newProd.unique_code,
                image: newProd.image || (newProd.images && newProd.images[0]) || '',
                price_per_day: newProd.price_per_day
              };
            }
            return p;
          });
        }
      }
    }

    const now = new Date().toISOString();
    const updatedProducts = finalProducts.map((p: any) => {
      if (productIds.includes(p.id)) {
        return {
          ...p,
          status: 'released',
          released_to_representative_name: receivedBy || null
        };
      }
      return p;
    });

    const allReleased = updatedProducts.every((p: any) => p.status === 'released');

    let { error: updateError } = await supabase
      .from('rentals')
      .update({
        products: updatedProducts,
        status: allReleased ? 'released' : rental.status,
        released_at: now,
        released_by_staff_name: staffName,
        handover_proof_url: proofUrl || rental.handover_proof_url,
        released_to_representative_name: receivedBy || null
      } as any)
      .eq('id', rentalId);

    if (updateError) throw updateError;

    return res.json({
      message: 'Items released successfully.',
      proofUrl
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to release items.' });
  }
});

router.post('/bulk-return', validate(bulkReturnSchema), async (req: Request, res: Response) => {
  try {
    const { rentalId, productIds, receivedBy } = req.body;
    console.log('[Bulk Return] Request received:', { rentalId, productIdsCount: productIds?.length, receivedBy });
    if (!rentalId || !productIds || !Array.isArray(productIds)) {
      return res.status(400).json({ message: 'Rental ID and array of Product IDs are required.' });
    }

    const staffId = (req.user as any)?.id || null;
    const staffName = (req.user as any)?.fullName || (req.user as any)?.username || null;

    // Fetch current rental to update products array
    const { data: rental, error: fetchError } = await supabase
      .from('rentals')
      .select('*')
      .eq('id', rentalId)
      .single();

    if (fetchError || !rental) throw fetchError || new Error('Rental not found');

    const now = new Date().toISOString();
    const updatedProducts = (rental.products || []).map((p: any) => {
      if (productIds.includes(p.id)) {
        return {
          ...p,
          status: 'returned',
          returned_by_representative_name: receivedBy || null
        };
      }
      return p;
    });

    const allReturned = updatedProducts.every((p: any) => p.status === 'returned');

    // Handle Proof Photo Deletion if all returned
    if (allReturned && rental.handover_proof_url) {
      const publicId = extractPublicId(rental.handover_proof_url);
      if (publicId) {
        console.log(`[Bulk Return] Deleting handover proof: ${publicId}`);
        await deleteFile({ key: publicId }).catch(err => console.error('Cloudinary delete fail:', err));
      }
    }

    let { error: updateError } = await supabase
      .from('rentals')
      .update({
        products: updatedProducts,
        status: allReturned ? 'returned' : rental.status,
        received_at: now,
        received_by_staff_name: staffName,
        handover_proof_url: allReturned ? null : rental.handover_proof_url,
        returned_by_representative_name: receivedBy || null
      } as any)
      .eq('id', rentalId);

    if (updateError) throw updateError;

    return res.json({
      message: `${productIds.length} items returned successfully.`
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to return items.' });
  }
});

router.get('/counts', async (req: Request, res: Response) => {
  try {
    const filterDate = req.query.date as string;

    let upcomingQuery = supabase.from('rentals').select('id', { count: 'exact', head: true }).eq('status', 'confirmed');
    let returningQuery = supabase.from('rentals').select('id', { count: 'exact', head: true }).in('status', ['released']);

    if (filterDate) {
      upcomingQuery = upcomingQuery
        .gte('pickup_date', `${filterDate}T00:00:00`)
        .lt('pickup_date', `${filterDate}T23:59:59.999`);
      returningQuery = returningQuery
        .gte('event_date', `${filterDate}T00:00:00`)
        .lt('event_date', `${filterDate}T23:59:59.999`);
    }

    const [productsCount, activeRentalsCount, activeRentalsData, upcomingCount, returningCount, pendingUsersCount] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('rentals').select('id', { count: 'exact', head: true }).in('status', ['released']),
      supabase.from('rentals').select('products').in('status', ['released']),
      upcomingQuery,
      returningQuery,
      supabase.from('users').select('id', { count: 'exact', head: true }).not('is_verified', 'is', true).not('is_blocked', 'is', true),
    ]);

    const activeItemsCount = (activeRentalsData.data || []).reduce((sum: number, r: any) => {
      return sum + (r.products || []).reduce((itemSum: number, p: any) => itemSum + (p.qty || 1), 0);
    }, 0);

    return res.json({
      totalProducts: productsCount.count || 0,
      totalActiveRentals: activeRentalsCount.count || 0,
      totalActiveItems: activeItemsCount,
      upcoming: upcomingCount.count || 0,
      active: activeRentalsCount.count || 0,
      returning: returningCount.count || 0,
      pendingUsersCount: pendingUsersCount.count || 0,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch counts.' });
  }
});

export default router;

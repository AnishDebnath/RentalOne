import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import express, { Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import supabase from '@camera-rental-house/database';
import { deleteFile, getSignedUrl, uploadFile } from '@camera-rental-house/cloud-storage/cloudinary';
import generateUniqueCode from '../utils/codeGenerator.js';
import generateQrBase64 from '../utils/qrGenerator.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

const extractPublicId = (url: string | null): string | null => {
  if (!url) return null;
  const parts = url.split('/upload/');
  if (parts.length < 2) return null;
  const path = parts[1].replace(/^v\d+\//, '');
  return decodeURIComponent(path.split('.')[0]);
};

router.get('/staff', roleMiddleware(['admin', 'manager']), async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('staff_accounts')
      .select('id, username, full_name, phone, role, avatar_url, is_active, last_login_at, last_logout_at, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json(data || []);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch staff list.' });
  }
});

router.post('/staff', roleMiddleware(['admin', 'manager']), async (req: Request, res: Response) => {
  try {
    const { username, fullName, phone, role, password } = req.body;

    if (!username || !fullName || !phone || !role || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const { data, error } = await supabase
      .from('staff_accounts')
      .insert([
        {
          username: username.toLowerCase(),
          full_name: fullName,
          phone: phone.replace(/\D/g, ''),
          role,
          password_hash: passwordHash,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ message: 'Username or phone already exists.' });
      }
      throw error;
    }

    return res.status(201).json({ message: 'Staff member added successfully.', staff: data });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to add staff member.' });
  }
});

router.get('/dashboard', roleMiddleware(['admin']), async (_req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const monthStart = new Date();
    monthStart.setDate(1);

    let productsCount: any = { count: 0 };
    let usersCount: any = { count: 0 };
    let pendingUsersCount: any = { count: 0 };
    let activeTodayCount: any = { count: 0 };
    let activeRentals: any = { data: [] };
    let recentRentals: any = { data: [] };
    let revenueRentals: any = { data: [] };

    try {
      const results = await Promise.allSettled([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('users').select('id', { count: 'exact', head: true }).not('is_verified', 'is', true).not('is_blocked', 'is', true),
        supabase.from('rentals').select('id', { count: 'exact', head: true }).eq('pickup_date', today),
        supabase.from('rentals').select('products').eq('status', 'released'),
        supabase.from('rentals').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('rentals').select('created_at, products, total_amount').gte('created_at', monthStart.toISOString())
      ]);

      if (results[0].status === 'fulfilled') productsCount = results[0].value;
      if (results[1].status === 'fulfilled') usersCount = results[1].value;
      if (results[2].status === 'fulfilled') pendingUsersCount = results[2].value;
      if (results[3].status === 'fulfilled') activeTodayCount = results[3].value;
      if (results[4].status === 'fulfilled') activeRentals = results[4].value;
      
      if (results[5].status === 'fulfilled' && !results[5].value.error) {
        recentRentals = results[5].value;
      } else {
        const simple = await supabase.from('rentals').select('*').order('created_at', { ascending: false }).limit(10);
        recentRentals = simple;
      }

      if (results[6].status === 'fulfilled') revenueRentals = results[6].value;
    } catch (err) {
      console.error('Dashboard fetch partial failure:', err);
    }

    const activeItemsCount = (activeRentals.data || []).reduce((sum: number, rental: any) => {
      return sum + (rental.products || []).reduce((itemSum: number, p: any) => itemSum + (p.qty || 1), 0);
    }, 0);

    const revenueThisMonth = (revenueRentals.data || []).reduce((sum: number, rental: any) => {
      // Use pre-calculated total_amount if available, else calculate from products
      if (rental.total_amount) return sum + Number(rental.total_amount);
      return (
        sum +
        (rental.products || []).reduce((itemSum: number, item: any) => {
          return itemSum + Number(item.qty || 1) * Number(item.price || 0); // Assuming 1 day for simplicity if no total
        }, 0)
      );
    }, 0);

    return res.json({
      totalProducts: productsCount.count || 0,
      activeRentalsToday: activeTodayCount.count || 0,
      totalActiveRentals: activeRentals.data?.length || 0,
      totalActiveItems: activeItemsCount,
      totalUsers: usersCount.count || 0,
      pendingUsersCount: pendingUsersCount.count || 0,
      revenueThisMonth,
      recentRentals: recentRentals.data || [],
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to load dashboard.' });
  }
});

router.get('/users', roleMiddleware(['admin']), async (req: Request, res: Response) => {
  try {
    const search = String(req.query.search || '').trim();
    let usersQuery: any = supabase
      .from('users')
      .select('*')
      .eq('is_house_owner', false)
      .order('created_at', { ascending: false });

    if (search) {
      usersQuery = usersQuery.or(
        `full_name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`,
      );
    }

    const { data: userData, error: userError } = await usersQuery;
    if (userError) throw userError;

    // Fetch rentals separately — avoids FK ambiguity in PostgREST embed
    const userIds = (userData || []).map((u: any) => u.id);
    let rentalsMap: Record<string, any[]> = {};
    if (userIds.length) {
      const { data: rentalsData } = await supabase
        .from('rentals')
        .select('id, user_id, products, total_amount, status, event_date')
        .in('user_id', userIds);
      (rentalsData || []).forEach((r: any) => {
        if (!rentalsMap[r.user_id]) rentalsMap[r.user_id] = [];
        rentalsMap[r.user_id].push(r);
      });
    }

    const users = (userData || []).map((user: any) => {
      const userRentals = rentalsMap[user.id] || [];
      const completedRentals = userRentals.filter((r: any) => r.status === 'returned');
      const totalSpent = completedRentals.reduce((sum: number, r: any) => {
        if (r.total_amount) return sum + Number(r.total_amount);
        return sum + (r.products || []).reduce((iSum: number, p: any) => iSum + (Number(p.qty || 1) * Number(p.price || 0)), 0);
      }, 0);
      return {
        ...user,
        rentals: userRentals,
        totalRentals: completedRentals.length,
        totalSpent,
      };
    });

    return res.json(users);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch users.' });
  }
});

router.get('/users/:id', roleMiddleware(['admin']), async (req: Request, res: Response) => {
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (userError) throw userError;
    if (!userData) return res.status(404).json({ message: 'User not found.' });

    // Fetch rentals separately — avoids FK ambiguity in PostgREST embed
    const { data: rentals } = await supabase
      .from('rentals')
      .select('*')
      .eq('user_id', req.params.id)
      .order('pickup_date', { ascending: false });

    const allRentals = rentals || [];
    const completedRentals = allRentals.filter((r: any) => r.status === 'returned');
    const totalSpent = completedRentals.reduce((sum: number, r: any) => {
      if (r.total_amount) return sum + Number(r.total_amount);
      return sum + (r.products || []).reduce((iSum: number, p: any) => iSum + (Number(p.qty || 1) * Number(p.price || 0)), 0);
    }, 0);

    return res.json({
      ...userData,
      rentals: allRentals,
      totalRentals: completedRentals.length,
      totalSpent,
      aadhaar_signed_url: userData.aadhaar_doc_url,
      voter_signed_url: userData.voter_doc_url,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch user details.' });
  }
});


router.put('/users/:id/block', roleMiddleware(['admin']), async (req: Request, res: Response) => {
  try {
    const { data: existing, error: existingError } = await supabase
      .from('users')
      .select('id, is_blocked')
      .eq('id', req.params.id)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (!existing) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const { data, error } = await supabase
      .from('users')
      .update({ is_blocked: !existing.is_blocked })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to update user.' });
  }
});

router.put('/users/:id/verify', roleMiddleware(['admin']), async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ is_verified: true, changed_fields: [] })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to verify user.' });
  }
});

router.delete('/users/:id', roleMiddleware(['admin']), async (req: Request, res: Response) => {
  try {
    const { data: rentals, error: rentalFetchError } = await supabase
      .from('rentals')
      .select('id')
      .eq('user_id', req.params.id);

    if (rentalFetchError) {
      throw rentalFetchError;
    }

    const rentalIds = (rentals || []).map((item: any) => item.id);

    if (rentalIds.length) {
      const { error: deleteRentalsError } = await supabase
        .from('rentals')
        .delete()
        .in('id', rentalIds);

      if (deleteRentalsError) {
        throw deleteRentalsError;
      }
    }

    const { error } = await supabase.from('users').delete().eq('id', req.params.id);

    if (error) {
      throw error;
    }

    return res.json({ message: 'User deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to delete user.' });
  }
});

router.post('/products', roleMiddleware(['admin']), upload.array('images', 8), async (req: Request, res: Response) => {
  try {
    const { name, brand, category, description, pricePerDay, price2Days, price5Days, availableQuantity } = req.body;

    if (!name || !category || !pricePerDay || isNaN(Number(pricePerDay))) {
      return res.status(400).json({
        message: 'Name, category, and a valid numeric price are required.',
      });
    }

    const productId = crypto.randomUUID();
    const uniqueCode = await generateUniqueCode(category);
    const qrBase64 = await generateQrBase64({ productId, uniqueCode });

    const productImages = [];
    const files = (req.files as Express.Multer.File[]) || [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const buffer = await sharp(file.buffer)
          .resize({ width: 1800, withoutEnlargement: true })
          .jpeg({ quality: 82 })
          .toBuffer();

        const key = `${productId}/${Date.now()}-${i}.jpg`;
        const imageUrl = await uploadFile({
          buffer,
          key,
          mimetype: 'image/jpeg',
          folder: 'Camera Rental House/Products',
        });
        
        productImages.push(imageUrl);
      } catch (imgError) {
        console.error(`Error processing image ${i}:`, imgError);
        // Continue with other images if one fails
      }
    }

    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        id: productId,
        name,
        brand,
        category,
        description,
        price_per_day: Number(pricePerDay),
        price_2_days: price2Days ? Number(price2Days) : null,
        price_5_days: price5Days ? Number(price5Days) : null,
        available_quantity: availableQuantity !== undefined ? Number(availableQuantity) : 1,
        unique_code: uniqueCode,
        qr_base64: qrBase64,
        images: productImages, // Single table storage
      })
      .select('*')
      .single();

    if (productError) {
      console.error('Supabase Insert Error:', productError);
      return res.status(500).json({ 
        message: 'Database error: ' + (productError.message || 'Unknown error'),
        details: productError.details
      });
    }

    return res.status(201).json(product);
  } catch (error: any) {
    console.error('Create Product Exception:', error);
    return res.status(500).json({ 
      message: error.message || 'Unable to create product.',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

router.put('/products/:id', roleMiddleware(['admin']), upload.array('images', 8), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, brand, category, description, pricePerDay, price2Days, price5Days, availableQuantity, removeImageUrls } = req.body;
    
    const removedUrls = removeImageUrls ? JSON.parse(removeImageUrls) : [];

    // Fetch current product to get existing images array
    const { data: currentProduct, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !currentProduct) {
      throw fetchError || new Error('Product not found.');
    }

    // Deletions from Cloudinary
    if (removedUrls.length) {
      await Promise.all(
        removedUrls.map((url: string) =>
          deleteFile({ key: extractPublicId(url) as string }),
        ),
      );
    }

    // Upload new images
    const newImageUrls = [];
    const files = (req.files as Express.Multer.File[]) || [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const buffer = await sharp(file.buffer)
          .resize({ width: 1800, withoutEnlargement: true })
          .jpeg({ quality: 82 })
          .toBuffer();

        const key = `${id}/${Date.now()}-${i}.jpg`;
        const imageUrl = await uploadFile({
          buffer,
          key,
          mimetype: 'image/jpeg',
          folder: 'Camera Rental House/Products',
        });
        
        newImageUrls.push(imageUrl);
      } catch (imgError) {
        console.error(`Error processing new image ${i}:`, imgError);
      }
    }

    // Merge image lists
    const updatedImages = [
      ...(currentProduct.images || []).filter((url: string) => !removedUrls.includes(url)),
      ...newImageUrls,
    ];

    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update({
        name,
        brand,
        category,
        description,
        price_per_day: Number(pricePerDay),
        price_2_days: price2Days ? Number(price2Days) : null,
        price_5_days: price5Days ? Number(price5Days) : null,
        available_quantity: availableQuantity !== undefined ? Number(availableQuantity) : 1,
        images: updatedImages,
      })
      .eq('id', id)
      .select('*')
      .single();

    if (updateError) {
      throw updateError;
    }

    return res.json(updatedProduct);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to update product.' });
  }
});

router.delete('/products/:id', roleMiddleware(['admin']), async (req: Request, res: Response) => {
  try {
    const { data: currentProduct, error: fetchError } = await supabase
      .from('products')
      .select('images')
      .eq('id', req.params.id)
      .single();

    if (currentProduct?.images?.length) {
      await Promise.all(
        currentProduct.images.map((url: string) => deleteFile({ key: extractPublicId(url) as string })),
      );
    }

    const { error } = await supabase.from('products').delete().eq('id', req.params.id);

    if (error) {
      throw error;
    }

    return res.json({ message: 'Product deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to delete product.' });
  }
});

router.get('/rentals/upcoming', roleMiddleware(['admin', 'manager', 'staff']), async (_req: Request, res: Response) => {
  try {
    const { data: rentals, error } = await supabase
      .from('rentals')
      .select('*')
      .in('status', ['confirmed'])
      .order('pickup_date', { ascending: true });

    if (error) throw error;

    // Manually attach user info
    const userIds = [...new Set((rentals || []).map((r: any) => r.user_id).filter(Boolean))];
    let usersMap: Record<string, any> = {};

    if (userIds.length) {
      const { data: users } = await supabase
        .from('users')
        .select('id, full_name, phone, avatar_url')
        .in('id', userIds);
      
      (users || []).forEach((u: any) => { usersMap[u.id] = u; });
    }

    const result = (rentals || []).map((r: any) => ({
      ...r,
      users: usersMap[r.user_id] || null,
    }));

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch upcoming rentals.' });
  }
});

router.get('/rentals/active', roleMiddleware(['admin', 'manager', 'staff']), async (_req: Request, res: Response) => {
  try {
    const { data: rentals, error } = await supabase
      .from('rentals')
      .select('*')
      .eq('status', 'released')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Attach user info manually
    const userIds = [...new Set((rentals || []).map((r: any) => r.user_id).filter(Boolean))];
    let usersMap: Record<string, any> = {};
    if (userIds.length) {
      const { data: users } = await supabase.from('users').select('id, full_name, phone, avatar_url').in('id', userIds);
      (users || []).forEach((u: any) => { usersMap[u.id] = u; });
    }

    const result = (rentals || []).map((r: any) => ({
      ...r,
      users: usersMap[r.user_id] || null,
    }));

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch active rentals.' });
  }
});

router.get('/rentals/past', roleMiddleware(['admin', 'manager', 'staff']), async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit || 20);
    const offset = Number(req.query.offset || 0);

    const { data: rentals, count, error } = await supabase
      .from('rentals')
      .select('*', { count: 'exact' })
      .in('status', ['returned', 'cancelled', 'failed'])
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Attach user info manually — avoids FK ambiguity in PostgREST embed
    const userIds = [...new Set((rentals || []).map((r: any) => r.user_id).filter(Boolean))];
    let usersMap: Record<string, any> = {};
    if (userIds.length) {
      const { data: users } = await supabase.from('users').select('id, full_name, phone, avatar_url').in('id', userIds);
      (users || []).forEach((u: any) => { usersMap[u.id] = u; });
    }

    const result = (rentals || []).map((r: any) => ({
      ...r,
      users: usersMap[r.user_id] || null,
    }));

    return res.json({
      items: result,
      pagination: { limit, offset, total: count || 0, hasMore: offset + limit < (count || 0) },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch past rentals.' });
  }
});

router.get('/rentals/:id', roleMiddleware(['admin', 'manager', 'staff']), async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    console.log(`Rental lookup: id=${id} isUuid=${isUuid}`);

    let rentalQuery = supabase.from('rentals').select('*');
    rentalQuery = isUuid ? rentalQuery.eq('id', id) : rentalQuery.eq('rental_no', id);

    const { data: rental, error } = await rentalQuery.maybeSingle();

    if (error) throw error;
    if (!rental) return res.status(404).json({ message: 'Rental not found.' });

    // Attach user info manually — avoids FK ambiguity in PostgREST embed
    let userInfo = null;
    let houseName = null;
    if (rental.user_id) {
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', rental.user_id)
        .maybeSingle();
      userInfo = user || null;

      if (userInfo && (userInfo.is_house_owner === true || userInfo.role === 'partner')) {
        const { data: house } = await supabase
          .from('production_houses')
          .select('name')
          .eq('user_id', rental.user_id)
          .maybeSingle();
        houseName = house?.name || null;
      }
    }

    return res.json({ ...rental, users: userInfo, houseName });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch rental details.' });
  }
});

export default router;

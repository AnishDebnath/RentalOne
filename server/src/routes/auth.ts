import { AppError, UnauthorizedError, BadRequestError, ForbiddenError, ConflictError, NotFoundError } from '../utils/errors.js';
import crypto from 'crypto';
import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import supabase from '../db/supabase.js';
import { uploadFile as uploadToCloudinary } from '../storage/cloudinary.js';
import { uploadToSupabase } from '../storage/supabaseStorage.js';
import { processImage } from '../utils/imageProcessor.js';
import generateQrBase64 from '../utils/qrGenerator.js';
import generateMemberId from '../utils/memberIdGenerator.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validate, validateUuid } from '../validations/middleware.js';
import {
  signupSchema,
  loginSchema,
  checkExistsSchema,
  createStaffSchema,
  updateStaffSchema,
  adminPaginationQuery,
} from '../validations/schemas.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

const checkExistsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  message: (req: any, res: Response) => {
    const retryAfter = req.rateLimit?.resetTime
      ? Math.ceil((req.rateLimit.resetTime.getTime() - Date.now()) / 1000)
      : 900;
    return {
      message: 'Too many requests — please try again later.',
      retryAfter,
      retryAfterHuman: retryAfter >= 60
        ? `${Math.ceil(retryAfter / 60)} min`
        : `${retryAfter} sec`,
    };
  },
});

// Use sameSite: 'none' so the refresh cookie is sent on cross-origin requests
// (admin app on :5174 requests refresh from server on :5000).
// The secure flag is required for SameSite=None; on localhost (Chrome) secure cookies
// are accepted over HTTP because it's treated as a secure context.
const refreshCookieOptions: any = {
  httpOnly: true,
  sameSite: 'none',
  secure: true,
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

const createAccessToken = (payload: any) =>
  jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });

const createRefreshToken = (payload: any) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });

const issueTokens = (res: Response, payload: any) => {
  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);
  res.cookie('refreshToken', refreshToken, refreshCookieOptions);
  return { accessToken, refreshToken };
};

const validateSignupPayload = (body: any, files: any) => {
  const errors: string[] = [];
  const requiredFields = [
    'fullName',
    'phone',
    'email',
    'password',
    'aadhaarNo',
    'voterNo',
  ];

  requiredFields.forEach((field) => {
    if (!body[field]) {
      errors.push(`${field} is required.`);
    }
  });

  if (!/^\d{10}$/.test(String(body.phone || '').replace(/\D/g, ''))) {
    errors.push('Phone number must be 10 digits.');
  }

  if (!/^\d{12}$/.test(String(body.aadhaarNo || '').replace(/\D/g, ''))) {
    errors.push('Aadhaar number must be 12 digits.');
  }

  if (String(body.password || '').length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  if (!files?.selfie?.[0]) {
    errors.push('Profile capture is required.');
  }

  if (!files?.aadhaarDoc?.[0]) {
    errors.push('Aadhaar photocopy is required.');
  }

  if (!files?.voterDoc?.[0]) {
    errors.push('Voter ID photocopy is required.');
  }

  return errors;
};

router.post('/check-exists', checkExistsLimiter, validate(checkExistsSchema), async (req: Request, res: Response) => {
  const { email, phone, aadhaarNo, voterNo } = req.body;
  let query = supabase.from('users').select('email, phone, aadhaar_no, voter_no');

  const conditions: string[] = [];
  if (email) conditions.push(`email.eq.${email.toLowerCase()}`);
  if (phone) conditions.push(`phone.eq.${phone.replace(/\D/g, '')}`);
  if (aadhaarNo) conditions.push(`aadhaar_no.eq.${aadhaarNo.replace(/\D/g, '')}`);
  if (voterNo) conditions.push(`voter_no.eq.${voterNo.trim().toUpperCase()}`);

  if (conditions.length === 0) return res.json({ exists: false });

  const { data: users, error } = await query.or(conditions.join(','));

  if (error) throw error;

  if (users && users.length > 0) {
    const fieldErrors: Record<string, string> = {};
    const fields: string[] = [];

    for (const data of users) {
      if (email && data.email === email.toLowerCase() && !fields.includes('Email')) {
        fieldErrors.email = 'error';
        fields.push('Email');
      }
      if (phone && data.phone === phone.replace(/\D/g, '') && !fields.includes('Phone Number')) {
        fieldErrors.phone = 'error';
        fields.push('Phone Number');
      }
      if (aadhaarNo && data.aadhaar_no === aadhaarNo.replace(/\D/g, '') && !fields.includes('Aadhaar Number')) {
        fieldErrors.aadhaarNo = 'error';
        fields.push('Aadhaar Number');
      }
      if (voterNo && data.voter_no === voterNo.trim().toUpperCase() && !fields.includes('Voter ID')) {
        fieldErrors.voterNo = 'error';
        fields.push('Voter ID');
      }
    }

    let message = 'User is already registered.';
    if (fields.length === 1) message = `This ${fields[0]} is already registered.`;
    else if (fields.length === 2) message = `These ${fields[0]} and ${fields[1]} are already registered.`;
    else if (fields.length > 2) {
      const last = fields.pop();
      message = `These ${fields.join(', ')}, and ${last} are already registered.`;
    }

    const conflictErr = new ConflictError(message);
    (conflictErr as any).fieldErrors = fieldErrors;
    (conflictErr as any).exists = true;
    throw conflictErr;
  }

  return res.json({ exists: false });
});

router.post(
  '/signup',
  validate(signupSchema),
  upload.fields([
    { name: 'aadhaarDoc', maxCount: 1 },
    { name: 'voterDoc', maxCount: 1 },
    { name: 'selfie', maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    console.log('Signup request received for:', req.body.email);

    const errors = validateSignupPayload(req.body, files);
    if (errors.length) {
      const err = new BadRequestError('Validation failed.');
      (err as any).errors = errors;
      throw err;
    }

    const phone = String(req.body.phone).replace(/\D/g, '');
    const email = String(req.body.email).toLowerCase();
    const aadhaarNo = String(req.body.aadhaarNo).replace(/\D/g, '');
    const voterNo = String(req.body.voterNo).trim().toUpperCase();

    // Check for existing user (Email, Phone, Aadhaar, or Voter ID)
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('id, email, phone, aadhaar_no, voter_no')
      .or(`email.eq.${email},phone.eq.${phone},aadhaar_no.eq.${aadhaarNo},voter_no.eq.${voterNo}`);

    if (checkError) throw checkError;

    if (existingUsers && existingUsers.length > 0) {
      const fieldErrors: Record<string, string> = {};
      const fields: string[] = [];

      for (const existingUser of existingUsers) {
        if (existingUser.email === email && !fields.includes('Email')) {
          fieldErrors.email = 'error';
          fields.push('Email');
        }
        if (existingUser.phone === phone && !fields.includes('Phone number')) {
          fieldErrors.phone = 'error';
          fields.push('Phone number');
        }
        if (existingUser.aadhaar_no === aadhaarNo && !fields.includes('Aadhaar number')) {
          fieldErrors.aadhaarNo = 'error';
          fields.push('Aadhaar number');
        }
        if (existingUser.voter_no === voterNo && !fields.includes('Voter ID')) {
          fieldErrors.voterNo = 'error';
          fields.push('Voter ID');
        }
      }

      let message = 'User is already registered. Please check your details.';
      if (fields.length === 1) message = `${fields[0]} is already registered.`;
      else if (fields.length === 2) message = `${fields[0]} and ${fields[1]} are already registered.`;
      else if (fields.length > 2) {
        const last = fields.pop();
        message = `${fields.join(', ')}, and ${last} are already registered.`;
      }

      const conflictErr = new ConflictError(message);
      (conflictErr as any).fieldErrors = fieldErrors;
      throw conflictErr;
    }

    const userId = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(req.body.password, 12);

    console.log('Processing images for userId:', userId);

    // 1. Process and Upload Selfie to Cloudinary
    let avatarUrl = null;
    if (files.selfie?.[0]) {
      console.log('Uploading profile picture to Cloudinary...');
      const { buffer, mimetype } = await processImage(files.selfie[0].buffer, { maxWidth: 800, maxHeight: 800, quality: 85 });
      avatarUrl = await uploadToCloudinary({
        buffer,
        key: `avatar-${userId}-${Date.now()}`,
        mimetype,
        folder: 'Camera Rental House/Profile Picture',
      });
      console.log('Profile picture uploaded successfully.');
    }

    // 2. Process and Upload Aadhaar to Supabase Storage
    console.log('Uploading Aadhaar to Supabase Storage...');
    const { buffer: aadhaarBuf, mimetype: aadhaarMim } = await processImage(files.aadhaarDoc[0].buffer, { maxWidth: 1500, quality: 90 });
    const aadhaarDocUrl = await uploadToSupabase({
      buffer: aadhaarBuf,
      key: `users/${userId}/aadhaar-${Date.now()}.${aadhaarMim.split('/')[1]}`,
      mimetype: aadhaarMim,
    });
    console.log('Aadhaar uploaded successfully.');

    // 3. Process and Upload Voter Card to Supabase Storage
    console.log('Uploading Voter Card to Supabase Storage...');
    const { buffer: voterBuf, mimetype: voterMim } = await processImage(files.voterDoc[0].buffer, { maxWidth: 1500, quality: 90 });
    const voterDocUrl = await uploadToSupabase({
      buffer: voterBuf,
      key: `users/${userId}/voter-${Date.now()}.${voterMim.split('/')[1]}`,
      mimetype: voterMim,
    });
    console.log('Voter Card uploaded successfully.');

    console.log('Inserting user into Supabase database...');

    // Generate a unique, permanent member ID for this user
    const memberId = await generateMemberId();

    // QR encodes the memberId in a structured JSON object (Long format)
    const userQrBase64 = await generateQrBase64({ memberId });

    const { data, error } = await supabase
      .from('users')
      .insert({
        id: userId,
        member_id: memberId,
        full_name: req.body.fullName,
        phone,
        email,
        password_hash: passwordHash,
        aadhaar_no: aadhaarNo,
        aadhaar_doc_url: aadhaarDocUrl,
        voter_no: voterNo,
        voter_doc_url: voterDocUrl,
        avatar_url: avatarUrl,
        facebook: req.body.facebook || null,
        instagram: req.body.instagram || null,
        youtube: req.body.youtube || null,
        user_qr_base64: userQrBase64,
        is_verified: false,
      })
      .select('id, member_id, full_name, phone, email, avatar_url, user_qr_base64, aadhaar_no, aadhaar_doc_url, voter_no, voter_doc_url, is_verified, created_at, is_house_owner')
      .single();

    if (error) {
      throw error;
    }

    const tokens = issueTokens(res, { id: userId, email, role: 'user' });

    return res.status(201).json({
      message: 'Signup successful.',
      user: {
        id: data.id,
        memberId: data.member_id,
        fullName: data.full_name,
        phone: data.phone,
        email: data.email,
        role: 'user',
        isHouseOwner: data.is_house_owner === true,
        avatarUrl: data.avatar_url,
        userQrBase64: data.user_qr_base64,
        aadhaarNo: data.aadhaar_no,
        aadhaarDocUrl: data.aadhaar_doc_url,
        voterNo: data.voter_no,
        voterDocUrl: data.voter_doc_url,
        isVerified: data.is_verified,
        createdAt: data.created_at,
      },
      accessToken: tokens.accessToken,
    });
  },
);

router.post('/login', validate(loginSchema), async (req: Request, res: Response) => {
  console.log('Login route hit with identifier:', req.body.identifier);
  const { identifier, password } = req.body;

  const rawIdentifier = String(identifier).trim();
  const cleanIdentifier = rawIdentifier.toLowerCase();
  const upperIdentifier = rawIdentifier.toUpperCase();
  const normalizedPhone = rawIdentifier.replace(/\D/g, '');
  const isPhoneIdentifier = /^\d{10}$/.test(normalizedPhone);
  const isMemberIdentifier = /^(CRH|HSE)-\d{4}-[A-Z0-9]{4,}$/.test(upperIdentifier);

  // 1. Try to find in staff_accounts (by username or phone)
  let staffQuery = supabase.from('staff_accounts').select('id, username, full_name, phone, role, is_active, avatar_url, password_hash');
  if (isPhoneIdentifier) {
    staffQuery = staffQuery.or(`username.eq.${cleanIdentifier},phone.eq.${normalizedPhone}`);
  } else {
    staffQuery = staffQuery.eq('username', cleanIdentifier);
  }

  const { data: staff, error: staffError } = await staffQuery.maybeSingle();

  if (staffError) {
    console.error('Staff query error (non-fatal):', staffError);
  }

  if (staff && staff.is_active) {
    const isValid = await bcrypt.compare(password, staff.password_hash);
    if (isValid) {
      // Stamp last login
      await supabase
        .from('staff_accounts')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', staff.id);

      const tokens = issueTokens(res, {
        id: staff.id,
        username: staff.username,
        fullName: staff.full_name,
        avatarUrl: staff.avatar_url,
        role: staff.role,
      });

      return res.json({
        message: 'Staff login successful.',
        user: {
          id: staff.id,
          fullName: staff.full_name,
          username: staff.username,
          avatarUrl: staff.avatar_url,
          role: staff.role,
        },
        accessToken: tokens.accessToken,
        redirectTo: '/admin', // Frontend handles sub-routes like /admin/rentals for staff
      });
    }
  }

  // 2. Try to find in users (by phone, email, or public member/house ID)
  let userQuery = supabase.from('users').select('id, email, phone, member_id, full_name, role, is_blocked, password_hash, is_house_owner, avatar_url, user_qr_base64, created_at');
  if (isPhoneIdentifier) {
    userQuery = userQuery.eq('phone', normalizedPhone);
  } else if (isMemberIdentifier) {
    userQuery = userQuery.eq('member_id', upperIdentifier);
  } else {
    userQuery = userQuery.or(`email.eq.${cleanIdentifier},member_id.eq.${upperIdentifier}`);
  }

  const { data: user, error: userError } = await userQuery.maybeSingle();

  if (userError) {
    console.error('Supabase user query error:', userError);
    throw new AppError(500, 'Unable to login. Please try again.');
  }

  if (!user) {
    throw new UnauthorizedError('Invalid credentials. User not found.');
  }

  // Check for block before password compare to avoid bcrypt crash on bad hash
  if (user.is_blocked) {
    throw new ForbiddenError('This account has been blocked.');
  }

  let isValidUser = false;
  try {
    isValidUser = await bcrypt.compare(password, user.password_hash);
  } catch {
    console.error('bcrypt compare failed for user:', user.id);
    throw new UnauthorizedError('Invalid credentials.');
  }
  if (!isValidUser) {
    throw new UnauthorizedError('Invalid credentials. Incorrect password.');
  }

  const tokens = issueTokens(res, {
    id: user.id,
    email: user.email,
    role: 'user',
  });

  return res.json({
    message: 'Login successful.',
    accessToken: tokens.accessToken,
    user: {
      id: user.id,
      memberId: user.member_id,
      fullName: user.full_name,
      phone: user.phone,
      email: user.email,
      role: user.role || 'user',
      isHouseOwner: user.is_house_owner === true,
      avatarUrl: user.avatar_url,
      userQrBase64: user.user_qr_base64,
      createdAt: user.created_at,
    },
    redirectTo: '/',
  });
});



// --- Staff Management Routes (admin only) ---

router.get('/admin/staff', validate(adminPaginationQuery, 'query'), async (req: Request, res: Response) => {
  const requesterRole = (req.user as any)?.role;
  if (requesterRole !== 'admin') {
    throw new ForbiddenError('Admin access required.');
  }

  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const offset = Number(req.query.offset) || 0;

  const { data, error } = await supabase
    .from('staff_accounts')
    .select('id, username, phone, full_name, role, is_active, created_at, last_login_at, last_logout_at')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return res.json(data || []);
});

router.post('/admin/staff', validate(createStaffSchema), async (req: Request, res: Response) => {
  const requesterRole = (req.user as any)?.role;
  if (requesterRole !== 'admin') {
    throw new ForbiddenError('Admin access required.');
  }

  const { username, password, phone, fullName, role } = req.body;

  const cleanUsername = username.trim().toLowerCase();
  const cleanPhone = phone ? phone.replace(/\D/g, '') : null;

  const { data: existing, error: existingError } = await supabase
    .from('staff_accounts')
    .select('id')
    .or(`username.eq.${cleanUsername}${cleanPhone ? `,phone.eq.${cleanPhone}` : ''}`)
    .maybeSingle();

  if (existingError) throw existingError;

  if (existing) {
    throw new ConflictError('Username or Phone already taken.');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const { data, error } = await supabase
    .from('staff_accounts')
    .insert({
      username: cleanUsername,
      phone: cleanPhone,
      password_hash: passwordHash,
      full_name: fullName,
      role,
      is_active: true,
    })
    .select('id, username, phone, full_name, role, is_active, created_at')
    .single();

  if (error) throw error;
  return res.status(201).json(data);
});

router.patch('/admin/staff/:id', validateUuid('id'), validate(updateStaffSchema), async (req: Request, res: Response) => {
  const requesterRole = (req.user as any)?.role;
  if (requesterRole !== 'admin') {
    throw new ForbiddenError('Admin access required.');
  }

  const updates: any = {};
  if (req.body.fullName) updates.full_name = req.body.fullName;
  if (req.body.role && ['admin', 'staff'].includes(req.body.role)) updates.role = req.body.role;
  if (typeof req.body.isActive === 'boolean') updates.is_active = req.body.isActive;
  if (req.body.password) updates.password_hash = await bcrypt.hash(req.body.password, 12);

  const { data, error } = await supabase
    .from('staff_accounts')
    .update(updates)
    .eq('id', req.params.id)
    .select('id, username, full_name, role, is_active, created_at')
    .single();

  if (error) throw error;
  return res.json(data);
});

router.delete('/admin/staff/:id', validateUuid('id'), async (req: Request, res: Response) => {
  const requesterRole = (req.user as any)?.role;
  if (requesterRole !== 'admin') {
    throw new ForbiddenError('Admin access required.');
  }
  const requesterId = (req.user as any)?.id;
  if (requesterId === req.params.id) {
    throw new BadRequestError('You cannot delete your own account.');
  }

  const { error } = await supabase
    .from('staff_accounts')
    .update({ is_active: false })
    .eq('id', req.params.id);

  if (error) throw error;
  return res.json({ message: 'Staff account deactivated.' });
});


router.post('/refresh', async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw new UnauthorizedError('Refresh token is missing.');
  }

  const decoded: any = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
  const accessToken = createAccessToken({
    id: decoded.id,
    email: decoded.email,
    username: decoded.username,
    role: decoded.role,
  });

  return res.json({ accessToken });
});

router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const { data: user, error } = await supabase
    .from('users')
    .select('id, member_id, full_name, phone, email, role, is_house_owner, aadhaar_no, aadhaar_doc_url, voter_no, voter_doc_url, facebook, instagram, youtube, avatar_url, user_qr_base64, is_verified, created_at')
    .eq('id', userId)
    .single();

  if (error || !user) {
    throw new NotFoundError('User');
  }

  return res.json({
    user: {
      id: user.id,
      memberId: user.member_id,
      fullName: user.full_name,
      phone: user.phone,
      email: user.email,
      role: user.role || 'user',
      isHouseOwner: user.is_house_owner === true,
      aadhaarNo: user.aadhaar_no,
      aadhaarDocUrl: user.aadhaar_doc_url,
      voterNo: user.voter_no,
      voterDocUrl: user.voter_doc_url,
      facebook: user.facebook,
      instagram: user.instagram,
      youtube: user.youtube,
      avatarUrl: user.avatar_url,
      userQrBase64: user.user_qr_base64,
      isVerified: user.is_verified,
      createdAt: user.created_at,
    },
  });
});

router.patch(
  '/update-profile',
  authMiddleware,
  upload.fields([
    { name: 'aadhaarDoc', maxCount: 1 },
    { name: 'voterDoc', maxCount: 1 },
    { name: 'selfie', maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    const userId = (req.user as any).id;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const body = req.body;

    // 1. Fetch current user
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id, member_id, full_name, phone, email, role, is_house_owner, aadhaar_no, aadhaar_doc_url, voter_no, voter_doc_url, facebook, instagram, youtube, avatar_url, user_qr_base64, is_verified, created_at, is_blocked, changed_fields')
      .eq('id', userId)
      .single();

    if (fetchError || !user) {
      throw new NotFoundError('User');
    }

    const updates: any = {};
    const errors: string[] = [];

    // Validation & Formatting
    if (body.fullName) updates.full_name = body.fullName;

    if (body.phone) {
      const phone = body.phone.replace(/\D/g, '');
      if (!/^\d{10}$/.test(phone)) errors.push('Phone number must be 10 digits.');
      updates.phone = phone;
    }

    if (body.email) {
      const email = body.email.toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Invalid email format.');
      updates.email = email;
    }

    if (body.aadhaarNo) {
      const aadhaar = body.aadhaarNo.replace(/\D/g, '');
      if (!/^\d{12}$/.test(aadhaar)) errors.push('Aadhaar number must be 12 digits.');
      updates.aadhaar_no = aadhaar;
    }

    if (body.voterNo) {
      const voter = body.voterNo.trim().toUpperCase();
      if (voter.length < 5) errors.push('Voter ID is too short.');
      updates.voter_no = voter;
    }

    if (errors.length > 0) {
      const err = new BadRequestError('Validation failed.');
      (err as any).errors = errors;
      throw err;
    }

    // Check for uniqueness
    const conditions: string[] = [];
    if (updates.email && updates.email !== user.email) conditions.push(`email.eq.${updates.email}`);
    if (updates.phone && updates.phone !== user.phone) conditions.push(`phone.eq.${updates.phone}`);
    if (updates.aadhaar_no && updates.aadhaar_no !== user.aadhaar_no) conditions.push(`aadhaar_no.eq.${updates.aadhaar_no}`);
    if (updates.voter_no && updates.voter_no !== user.voter_no) conditions.push(`voter_no.eq.${updates.voter_no}`);

    if (conditions.length > 0) {
      const { data: existing, error: checkError } = await supabase
        .from('users')
        .select('email, phone, aadhaar_no, voter_no')
        .neq('id', userId)
        .or(conditions.join(','));

      if (checkError) throw checkError;

      if (existing && existing.length > 0) {
        const conflictFields: string[] = [];
        const fieldErrors: Record<string, string> = {};

        if (existing.some(u => u.phone === updates.phone)) {
          conflictFields.push('Phone Number');
          fieldErrors.phone = 'Phone number already registered';
        }
        if (existing.some(u => u.email === updates.email)) {
          conflictFields.push('Email');
          fieldErrors.email = 'Email already registered';
        }
        if (existing.some(u => u.aadhaar_no === updates.aadhaar_no)) {
          conflictFields.push('Aadhaar Number');
          fieldErrors.aadhaarNo = 'Aadhaar number already registered';
        }
        if (existing.some(u => u.voter_no === updates.voter_no)) {
          conflictFields.push('Voter ID');
          fieldErrors.voterNo = 'Voter ID already registered';
        }

        const conflictErr = new ConflictError(`${conflictFields.join(' and ')} already registered.`);
        (conflictErr as any).fieldErrors = fieldErrors;
        throw conflictErr;
      }
    }

    if (body.facebook !== undefined) updates.facebook = body.facebook || null;
    if (body.instagram !== undefined) updates.instagram = body.instagram || null;
    if (body.youtube !== undefined) updates.youtube = body.youtube || null;

    // 2. Handle File Updates

    // Profile Picture
    if (files?.selfie?.[0]) {
      console.log('Updating profile picture...');
      const { buffer, mimetype } = await processImage(files.selfie[0].buffer, { maxWidth: 800, maxHeight: 800, quality: 85 });
      updates.avatar_url = await uploadToCloudinary({
        buffer,
        key: `avatar-${userId}-${Date.now()}`,
        mimetype,
        folder: 'Camera Rental House/Profile Picture',
      });
    }

    // Aadhaar Doc
    if (files?.aadhaarDoc?.[0]) {
      console.log('Updating Aadhaar Doc...');
      const { buffer, mimetype } = await processImage(files.aadhaarDoc[0].buffer, { maxWidth: 1500, quality: 90 });
      updates.aadhaar_doc_url = await uploadToSupabase({
        buffer,
        key: `users/${userId}/aadhaar-${Date.now()}.${mimetype.split('/')[1]}`,
        mimetype,
      });
    }

    // Voter Doc
    if (files?.voterDoc?.[0]) {
      console.log('Updating Voter Doc...');
      const { buffer, mimetype } = await processImage(files.voterDoc[0].buffer, { maxWidth: 1500, quality: 90 });
      updates.voter_doc_url = await uploadToSupabase({
        buffer,
        key: `users/${userId}/voter-${Date.now()}.${mimetype.split('/')[1]}`,
        mimetype,
      });
    }

    // Reset verification only if sensitive fields actually changed value
    const sensitiveFields = ['full_name', 'phone', 'email', 'aadhaar_no', 'voter_no', 'aadhaar_doc_url', 'voter_doc_url', 'avatar_url'];

    // Normalize function — applies same transformation to both stored and new values
    const normalize = (val: any, key: string): string => {
      const str = String(val ?? '').trim();
      if (key === 'phone' || key === 'aadhaar_no') return str.replace(/\D/g, '');
      if (key === 'email') return str.toLowerCase();
      if (key === 'voter_no') return str.toUpperCase();
      return str;
    };

    const changedSensitiveFields = Object.keys(updates).filter(key => {
      if (!sensitiveFields.includes(key)) return false;
      // Doc URLs are new uploads — always count as changed
      if (key === 'aadhaar_doc_url' || key === 'voter_doc_url' || key === 'avatar_url') return true;
      // Normalize both sides before comparing
      return normalize(updates[key], key) !== normalize(user[key as keyof typeof user], key);
    });
    if (changedSensitiveFields.length > 0) {
      updates.is_verified = false;
      updates.changed_fields = changedSensitiveFields;
    }

    // 4. Update Database if there are changes
    if (Object.keys(updates).length > 0) {
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select('id, member_id, full_name, phone, email, role, is_house_owner, aadhaar_no, aadhaar_doc_url, voter_no, voter_doc_url, facebook, instagram, youtube, avatar_url, user_qr_base64, is_verified, created_at')
        .single();

      if (updateError) throw updateError;

      return res.json({
        message: 'Profile updated successfully.',
        user: {
          id: updatedUser.id,
          memberId: updatedUser.member_id,
          fullName: updatedUser.full_name,
          phone: updatedUser.phone,
          email: updatedUser.email,
          role: updatedUser.role || 'user',
          isHouseOwner: updatedUser.is_house_owner === true,
          aadhaarNo: updatedUser.aadhaar_no,
          aadhaarDocUrl: updatedUser.aadhaar_doc_url,
          voterNo: updatedUser.voter_no,
          voterDocUrl: updatedUser.voter_doc_url,
          facebook: updatedUser.facebook,
          instagram: updatedUser.instagram,
          youtube: updatedUser.youtube,
          avatarUrl: updatedUser.avatar_url,
          userQrBase64: updatedUser.user_qr_base64,
          isVerified: updatedUser.is_verified,
          createdAt: updatedUser.created_at,
        },
      });
    }

    // No changes detected
    return res.json({
      message: 'No changes detected.',
      user: {
        id: user.id,
        memberId: user.member_id,
        fullName: user.full_name,
        phone: user.phone,
        email: user.email,
        role: user.role || 'user',
        isHouseOwner: user.is_house_owner === true,
        aadhaarNo: user.aadhaar_no,
        aadhaarDocUrl: user.aadhaar_doc_url,
        voterNo: user.voter_no,
        voterDocUrl: user.voter_doc_url,
        facebook: user.facebook,
        instagram: user.instagram,
        youtube: user.youtube,
        avatarUrl: user.avatar_url,
        userQrBase64: user.user_qr_base64,
        isVerified: user.is_verified,
        createdAt: user.created_at,
      },
    });
  }
);

router.post('/logout', authMiddleware, async (req: Request, res: Response) => {
  const user = req.user as any;
  if (user && (user.role === 'admin' || user.role === 'staff')) {
    await supabase
      .from('staff_accounts')
      .update({ last_logout_at: new Date().toISOString() })
      .eq('id', user.id);
  }
  res.clearCookie('refreshToken', refreshCookieOptions);
  return res.json({ message: 'Logged out successfully.' });
});

export default router;

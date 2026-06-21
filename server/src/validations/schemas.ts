import { z } from 'zod';

// ── Helpers ────────────────────────────────────────────────────────────────

export const uuidParam = z.string().uuid('Invalid UUID format.');

export const paginationQuery = z.object({
    limit: z
        .string()
        .optional()
        .transform((v) => Number(v || 12))
        .pipe(z.number().int().min(1).max(100)),
    offset: z
        .string()
        .optional()
        .transform((v) => Number(v || 0))
        .pipe(z.number().int().min(0)),
    search: z.string().optional().default(''),
    category: z.string().optional().default(''),
    brand: z.string().optional().default(''),
    status: z.enum(['all', 'in_stock', 'on_rent', 'booked', 'out_of_stock']).optional().default('all'),
    sort: z.enum(['newest', 'oldest', 'most_rented']).optional(),
    pickup_date: z.string().optional(),
    drop_date: z.string().optional(),
});

// ── Auth ────────────────────────────────────────────────────────────────────

export const signupSchema = z.object({
    fullName: z.string().min(1, 'Full name is required.'),
    phone: z
        .string()
        .min(1, 'Phone is required.')
        .transform((v) => v.replace(/\D/g, ''))
        .pipe(z.string().length(10, 'Phone must be 10 digits.')),
    email: z.string().email('Invalid email format.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    aadhaarNo: z
        .string()
        .min(1, 'Aadhaar number is required.')
        .transform((v) => v.replace(/\D/g, ''))
        .pipe(z.string().length(12, 'Aadhaar must be 12 digits.')),
    voterNo: z.string().min(1, 'Voter ID is required.'),
});

export const checkExistsSchema = z.object({
    email: z.string().email().optional(),
    phone: z
        .string()
        .optional()
        .transform((v) => v?.replace(/\D/g, ''))
        .pipe(z.string().length(10).optional()),
    aadhaarNo: z
        .string()
        .optional()
        .transform((v) => v?.replace(/\D/g, ''))
        .pipe(z.string().length(12).optional()),
    voterNo: z.string().optional(),
});

export const loginSchema = z.object({
    identifier: z.string().min(1, 'Identifier is required.'),
    password: z.string().min(1, 'Password is required.'),
});

// ── Rentals ─────────────────────────────────────────────────────────────────

const cartItemSchema = z.object({
    productId: z.string().uuid('Invalid product ID.'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1.'),
});

export const createRentalSchema = z.object({
    pickupDate: z.string().min(1, 'Pickup date is required.'),
    eventDate: z.string().min(1, 'Event date is required.'),
    items: z.array(cartItemSchema).min(1, 'At least one item is required.'),
    userId: z.string().uuid().optional(),
    assistantCrewCount: z.number().int().min(0).optional().default(0),
    // Allow additional context fields, but they're not validated
}).refine(
    (data) => new Date(data.pickupDate) <= new Date(data.eventDate),
    { message: 'Pickup date must be on or before the event date.', path: ['pickupDate'] },
);

// ── Products ────────────────────────────────────────────────────────────────

export const createProductSchema = z.object({
    name: z.string().min(1, 'Product name is required.'),
    brand: z.string().optional().default(''),
    category: z.string().min(1, 'Category is required.'),
    description: z.string().optional().default(''),
    pricePerDay: z
        .union([z.string(), z.number()])
        .transform((v) => Number(v))
        .pipe(z.number().positive('Price must be a positive number.')),
    price2Days: z
        .union([z.string(), z.number()])
        .optional()
        .transform((v) => (v !== undefined && v !== '' ? Number(v) : undefined))
        .pipe(z.union([z.number().positive('Price must be positive.'), z.undefined()])),
    price5Days: z
        .union([z.string(), z.number()])
        .optional()
        .transform((v) => (v !== undefined && v !== '' ? Number(v) : undefined))
        .pipe(z.union([z.number().positive('Price must be positive.'), z.undefined()])),
    availableQuantity: z
        .union([z.string(), z.number()])
        .optional()
        .transform((v) => (v !== undefined ? Number(v) : 1))
        .refine((v) => Number.isInteger(v) && v >= 0, 'Available quantity must be a non-negative integer.'),
});

export const updateProductSchema = createProductSchema.partial();

// ── Production Houses ───────────────────────────────────────────────────────

export const createHouseSchema = z.object({
    name: z.string().min(1, 'House name is required.'),
    ownerName: z.string().min(1, 'Owner name is required.'),
    phone: z
        .string()
        .min(1, 'Phone is required.')
        .transform((v) => v.replace(/\D/g, ''))
        .pipe(z.string().length(10, 'Phone must be 10 digits.')),
    email: z.string().email().optional().nullable().default(null),
    address: z.string().optional().nullable().default(null),
});

// ── Manage (Staff Operations) ──────────────────────────────────────────────

const substitutionSchema = z.record(z.string().uuid(), z.string().uuid());

export const bulkReleaseSchema = z.object({
    rentalId: z.string().uuid('Invalid rental ID.'),
    productIds: z.array(z.string().uuid('Invalid product ID.')).min(1, 'At least one product is required.'),
    proofPhoto: z.string().optional(),
    receivedBy: z.string().optional(),
    substitutions: substitutionSchema.optional(),
});

export const bulkReturnSchema = z.object({
    rentalId: z.string().uuid('Invalid rental ID.'),
    productIds: z.array(z.string().uuid('Invalid product ID.')).min(1, 'At least one product is required.'),
    receivedBy: z.string().optional(),
});

// ── Staff Accounts ──────────────────────────────────────────────────────────

export const createStaffSchema = z.object({
    username: z.string().min(1, 'Username is required.'),
    fullName: z.string().min(1, 'Full name is required.'),
    phone: z
        .string()
        .min(1, 'Phone is required.')
        .transform((v) => v.replace(/\D/g, ''))
        .pipe(z.string().length(10, 'Phone must be 10 digits.')),
    role: z.enum(['admin', 'manager', 'staff'], { message: 'Invalid role.' }),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
});

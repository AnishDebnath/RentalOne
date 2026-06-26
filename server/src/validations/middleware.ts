import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { BadRequestError } from '../utils/errors.js';

/**
 * Express middleware that validates a request property against a Zod schema.
 *
 * @param schema     - The Zod schema to validate against.
 * @param source     - Which part of the request to validate (default: 'body').
 *                      Use 'query' or 'params' for those sources.
 *
 * On success, the parsed (and transformed) value replaces the original.
 * On failure, throws BadRequestError with Zod issues attached.
 */
export const validate = (
    schema: ZodSchema,
    source: 'body' | 'query' | 'params' = 'body',
) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
            const firstIssue = (result.error as any).issues?.[0];
            const message = firstIssue?.message || 'Validation failed.';
            const err = new BadRequestError(message);
            (err as any).issues = (result.error as any).issues;
            throw err;
        }

        // Replace with parsed (and transformed) data
        (req as any)[source] = result.data;
        next();
    };
};

/**
 * Middleware that validates a route parameter (e.g. :id) as a UUID.
 * Usage: router.get('/:id', validateUuid('id'), handler)
 */
export const validateUuid = (paramName: string) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = z.string().uuid(`Invalid ${paramName} — expected a UUID.`).safeParse(req.params[paramName]);

        if (!result.success) {
            throw new BadRequestError((result.error as any).issues?.[0]?.message || 'Invalid UUID.');
        }

        next();
    };
};

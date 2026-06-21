import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

/**
 * Express middleware that validates a request property against a Zod schema.
 *
 * @param schema     - The Zod schema to validate against.
 * @param source     - Which part of the request to validate (default: 'body').
 *                      Use 'query' or 'params' for those sources.
 *
 * On success, the parsed (and transformed) value replaces the original.
 * On failure, responds with 400 and the first validation error message.
 */
export const validate = (
    schema: ZodSchema,
    source: 'body' | 'query' | 'params' = 'body',
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
            const firstIssue = (result.error as any).issues?.[0];
            const message = firstIssue?.message || 'Validation failed.';
            return res.status(400).json({ message, issues: (result.error as any).issues });
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
    return (req: Request, res: Response, next: NextFunction) => {
        const result = z.string().uuid(`Invalid ${paramName} — expected a UUID.`).safeParse(req.params[paramName]);

        if (!result.success) {
            return res.status(400).json({ message: (result.error as any).issues?.[0]?.message || 'Invalid UUID.' });
        }

        next();
    };
};

import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../utils/errors.js';

const roleMiddleware = (allowedRoles: string[] = []) => (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
    throw new ForbiddenError('You do not have permission to access this resource.');
  }

  return next();
};

export default roleMiddleware;

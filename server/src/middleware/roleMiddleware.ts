import { Request, Response, NextFunction } from 'express';

const roleMiddleware = (allowedRoles: string[] = []) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: 'You do not have permission to access this resource.' });
  }

  return next();
};

export default roleMiddleware;

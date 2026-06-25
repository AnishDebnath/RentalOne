import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors.js';

dotenv.config();

const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    throw new UnauthorizedError('Authorization token is required.');
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET as string);
    return next();
  } catch {
    throw new UnauthorizedError('Invalid or expired token.');
  }
};

export default authMiddleware;

import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';

export type TAuthUser = {
  id: string;
  role: TUserRole;
  email: string;
};

export type AuthenticatedRequest = Request & { user?: TAuthUser };

const unauthenticated = (res: Response) => {
  res.status(httpStatus.UNAUTHORIZED).json({
    success: false,
    message: 'Unauthorized',
  });
};

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!config.jwt_secret) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server misconfiguration: missing JWT secret',
    });
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    unauthenticated(res);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt_secret as string) as TAuthUser;
    req.user = decoded;
    next();
  } catch {
    unauthenticated(res);
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== 'admin') {
    res.status(httpStatus.FORBIDDEN).json({
      success: false,
      message: 'Forbidden: admin access required',
    });
    return;
  }
  next();
};

export const requireSelfOrAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role === 'admin' || req.user?.id === req.params.id) {
    return next();
  }

  res.status(httpStatus.FORBIDDEN).json({
    success: false,
    message: 'Forbidden',
  });
};

import jwt from 'jsonwebtoken';

import { AppError } from '../middlewares/error.middleware.js';
import type { AuthenticatedUser } from '../domains/auth/auth.types.js';

type JwtPayload = {
  sub: string;
  email: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError(500, 'JWT secret is not configured');
  }

  return secret;
}

function getJwtExpiresIn() {
  return (process.env.JWT_EXPIRES_IN ??
    '1h') as jwt.SignOptions['expiresIn'];
}

export function signAccessToken(user: AuthenticatedUser) {
  return jwt.sign(
    {
      email: user.email,
    },
    getJwtSecret(),
    {
      expiresIn: getJwtExpiresIn(),
      subject: user.id,
    },
  );
}

export function verifyAccessToken(token: string): AuthenticatedUser {
  try {
    const payload = jwt.verify(token, getJwtSecret()) as JwtPayload;

    if (!payload.sub || !payload.email) {
      throw new AppError(401, 'Invalid access token');
    }

    return {
      id: payload.sub,
      email: payload.email,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(401, 'Invalid access token');
  }
}

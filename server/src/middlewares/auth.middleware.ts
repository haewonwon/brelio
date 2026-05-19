import type { RequestHandler } from 'express';

import { AppError } from './error.middleware.js';
import { verifyAccessToken } from '../utils/jwt.js';

export const authMiddleware: RequestHandler = (request, _response, next) => {
  try {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader?.startsWith('Bearer ')) {
      next(new AppError(401, 'Authorization token is required'));
      return;
    }

    const accessToken = authorizationHeader.replace('Bearer ', '').trim();

    if (!accessToken) {
      next(new AppError(401, 'Authorization token is required'));
      return;
    }

    request.user = verifyAccessToken(accessToken);
    next();
  } catch (error) {
    next(error);
  }
};

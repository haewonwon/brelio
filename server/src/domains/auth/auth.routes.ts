import { Router } from 'express';

import { handleGoogleAuth } from './auth.controller.js';
import { googleAuthBodySchema } from './auth.schema.js';
import { validateRequest } from '../../lib/zod.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const authRoutes = Router();

authRoutes.post(
  '/google',
  validateRequest({
    body: googleAuthBodySchema,
  }),
  asyncHandler(handleGoogleAuth),
);

import { Router } from 'express';

import {
  handleGetDailyLogs,
  handleGetDailyLogStreak,
  handleGetTodayDailyLog,
} from './dailyLog.controller.js';
import { dailyLogQuerySchema } from './dailyLog.schema.js';
import { validateRequest } from '../../lib/zod.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const dailyLogRoutes = Router();

dailyLogRoutes.get(
  '/',
  authMiddleware,
  validateRequest({
    query: dailyLogQuerySchema,
  }),
  asyncHandler(handleGetDailyLogs),
);

dailyLogRoutes.get(
  '/today',
  authMiddleware,
  validateRequest({
    query: dailyLogQuerySchema,
  }),
  asyncHandler(handleGetTodayDailyLog),
);

dailyLogRoutes.get(
  '/streak',
  authMiddleware,
  validateRequest({
    query: dailyLogQuerySchema,
  }),
  asyncHandler(handleGetDailyLogStreak),
);

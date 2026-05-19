import { Router } from 'express';

import {
  handleGetDailyLogs,
  handleGetDailyLogStreak,
  handleGetTodayDailyLog,
} from './dailyLog.controller.js';
import { dailyLogQuerySchema } from './dailyLog.schema.js';
import { validateRequest } from '../../lib/zod.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const dailyLogRoutes = Router();

dailyLogRoutes.get(
  '/',
  validateRequest({
    query: dailyLogQuerySchema,
  }),
  asyncHandler(handleGetDailyLogs),
);

dailyLogRoutes.get(
  '/today',
  validateRequest({
    query: dailyLogQuerySchema,
  }),
  asyncHandler(handleGetTodayDailyLog),
);

dailyLogRoutes.get(
  '/streak',
  validateRequest({
    query: dailyLogQuerySchema,
  }),
  asyncHandler(handleGetDailyLogStreak),
);

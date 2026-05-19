import type { Request, Response } from 'express';

import {
  getDailyLogs,
  getDailyLogStreak,
  getTodayDailyLog,
} from './dailyLog.service.js';
import type {
  DailyLogResponse,
  StreakResponse,
  TodayDailyLogResponse,
} from './dailyLog.types.js';
import type { SuccessResponse } from '../articles/article.types.js';
import { AppError } from '../../middlewares/error.middleware.js';

function getAuthenticatedUserId(request: Request) {
  if (!request.user) {
    throw new AppError(401, 'Authentication is required');
  }

  return request.user.id;
}

export async function handleGetDailyLogs(
  request: Request,
  response: Response<SuccessResponse<DailyLogResponse[]>>,
) {
  const dailyLogs = await getDailyLogs(getAuthenticatedUserId(request));

  response.status(200).json({
    success: true,
    data: dailyLogs,
  });
}

export async function handleGetTodayDailyLog(
  request: Request,
  response: Response<SuccessResponse<TodayDailyLogResponse>>,
) {
  const dailyLog = await getTodayDailyLog(getAuthenticatedUserId(request));

  response.status(200).json({
    success: true,
    data: dailyLog,
  });
}

export async function handleGetDailyLogStreak(
  request: Request,
  response: Response<SuccessResponse<StreakResponse>>,
) {
  const streak = await getDailyLogStreak(getAuthenticatedUserId(request));

  response.status(200).json({
    success: true,
    data: streak,
  });
}

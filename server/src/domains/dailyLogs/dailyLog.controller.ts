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

export async function handleGetDailyLogs(
  _request: Request,
  response: Response<SuccessResponse<DailyLogResponse[]>>,
) {
  const dailyLogs = await getDailyLogs();

  response.status(200).json({
    success: true,
    data: dailyLogs,
  });
}

export async function handleGetTodayDailyLog(
  _request: Request,
  response: Response<SuccessResponse<TodayDailyLogResponse>>,
) {
  const dailyLog = await getTodayDailyLog();

  response.status(200).json({
    success: true,
    data: dailyLog,
  });
}

export async function handleGetDailyLogStreak(
  _request: Request,
  response: Response<SuccessResponse<StreakResponse>>,
) {
  const streak = await getDailyLogStreak();

  response.status(200).json({
    success: true,
    data: streak,
  });
}

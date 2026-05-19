import { prisma } from '../../lib/prisma.js';
import type {
  DailyLogResponse,
  StreakResponse,
  TodayDailyLogResponse,
} from './dailyLog.types.js';

const dailyLogSelect = {
  id: true,
  date: true,
  completed: true,
  completedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

function getLocalDateStart(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

async function getCompletedNoteDateKeys(userId: string) {
  const notes = await prisma.articleNote.findMany({
    where: {
      userId,
    },
    select: {
      createdAt: true,
      updatedAt: true,
    },
  });

  const dateKeys = new Set<string>();

  for (const note of notes) {
    dateKeys.add(getLocalDateKey(note.createdAt));
    dateKeys.add(getLocalDateKey(note.updatedAt));
  }

  return dateKeys;
}

async function syncDailyLogsFromNotes(userId: string) {
  const dateKeys = await getCompletedNoteDateKeys(userId);

  if (dateKeys.size === 0) {
    return;
  }

  for (const dateKey of dateKeys) {
    const date = getLocalDateStart(new Date(`${dateKey}T00:00:00`));
    const existingDailyLog = await prisma.dailyLog.findUnique({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
      select: {
        completed: true,
      },
    });

    if (!existingDailyLog) {
      await prisma.dailyLog.create({
        data: {
          userId,
          date,
          completed: true,
          completedAt: new Date(),
        },
      });
      continue;
    }

    if (!existingDailyLog.completed) {
      await prisma.dailyLog.update({
        where: {
          userId_date: {
            userId,
            date,
          },
        },
        data: {
          completed: true,
          completedAt: new Date(),
        },
      });
    }
  }
}

export async function completeTodayDailyLog(
  userId: string,
): Promise<TodayDailyLogResponse> {
  const today = getLocalDateStart();
  const completedAt = new Date();
  const dailyLog = await prisma.dailyLog.upsert({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
    update: {
      completed: true,
      completedAt,
    },
    create: {
      userId,
      date: today,
      completed: true,
      completedAt,
    },
    select: {
      date: true,
      completed: true,
      completedAt: true,
    },
  });

  return dailyLog;
}

export async function getDailyLogs(userId: string): Promise<DailyLogResponse[]> {
  await syncDailyLogsFromNotes(userId);

  return prisma.dailyLog.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: 'desc',
    },
    select: dailyLogSelect,
  });
}

export async function getTodayDailyLog(
  userId: string,
): Promise<TodayDailyLogResponse> {
  await syncDailyLogsFromNotes(userId);

  const today = getLocalDateStart();
  const dailyLog = await prisma.dailyLog.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
    select: {
      date: true,
      completed: true,
      completedAt: true,
    },
  });

  if (dailyLog) {
    return dailyLog;
  }

  return {
    date: today,
    completed: false,
    completedAt: null,
  };
}

export async function getDailyLogStreak(
  userId: string,
): Promise<StreakResponse> {
  await syncDailyLogsFromNotes(userId);

  const completedLogs = await prisma.dailyLog.findMany({
    where: {
      userId,
      completed: true,
    },
    orderBy: {
      date: 'desc',
    },
    select: {
      date: true,
    },
  });

  const completedDateKeys = new Set(
    completedLogs.map((dailyLog) => getLocalDateKey(dailyLog.date)),
  );

  let streak = 0;
  let currentDate = getLocalDateStart();

  while (completedDateKeys.has(getLocalDateKey(currentDate))) {
    streak += 1;
    currentDate = addDays(currentDate, -1);
  }

  return {
    streak,
  };
}

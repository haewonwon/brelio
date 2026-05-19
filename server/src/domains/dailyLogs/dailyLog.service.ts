import { prisma } from '../../lib/prisma.js';
import { ensureTemporaryUser, TEMP_USER_ID } from '../../lib/tempUser.js';
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

async function getCompletedNoteDateKeys() {
  const notes = await prisma.articleNote.findMany({
    where: {
      userId: TEMP_USER_ID,
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

async function syncDailyLogsFromNotes() {
  const dateKeys = await getCompletedNoteDateKeys();

  if (dateKeys.size === 0) {
    return;
  }

  await ensureTemporaryUser();

  for (const dateKey of dateKeys) {
    const date = getLocalDateStart(new Date(`${dateKey}T00:00:00`));
    const existingDailyLog = await prisma.dailyLog.findUnique({
      where: {
        userId_date: {
          userId: TEMP_USER_ID,
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
          userId: TEMP_USER_ID,
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
            userId: TEMP_USER_ID,
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

export async function completeTodayDailyLog(): Promise<TodayDailyLogResponse> {
  await ensureTemporaryUser();

  const today = getLocalDateStart();
  const completedAt = new Date();
  const dailyLog = await prisma.dailyLog.upsert({
    where: {
      userId_date: {
        userId: TEMP_USER_ID,
        date: today,
      },
    },
    update: {
      completed: true,
      completedAt,
    },
    create: {
      userId: TEMP_USER_ID,
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

export async function getDailyLogs(): Promise<DailyLogResponse[]> {
  await syncDailyLogsFromNotes();

  return prisma.dailyLog.findMany({
    where: {
      userId: TEMP_USER_ID,
    },
    orderBy: {
      date: 'desc',
    },
    select: dailyLogSelect,
  });
}

export async function getTodayDailyLog(): Promise<TodayDailyLogResponse> {
  await syncDailyLogsFromNotes();

  const today = getLocalDateStart();
  const dailyLog = await prisma.dailyLog.findUnique({
    where: {
      userId_date: {
        userId: TEMP_USER_ID,
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

export async function getDailyLogStreak(): Promise<StreakResponse> {
  await syncDailyLogsFromNotes();

  const completedLogs = await prisma.dailyLog.findMany({
    where: {
      userId: TEMP_USER_ID,
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

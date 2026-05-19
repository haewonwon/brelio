export type DailyLogResponse = {
  id: string;
  date: Date;
  completed: boolean;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TodayDailyLogResponse = {
  date: Date;
  completed: boolean;
  completedAt: Date | null;
};

export type StreakResponse = {
  streak: number;
};

import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { completeTodayDailyLog } from '../dailyLogs/dailyLog.service.js';
import type {
  NoteResponse,
  UpdateNoteInput,
  UpsertArticleNoteInput,
} from './note.types.js';

const noteSelect = {
  id: true,
  articleId: true,
  content: true,
  createdAt: true,
  updatedAt: true,
} as const;

async function ensureArticleExists(articleId: string) {
  const article = await prisma.article.findUnique({
    where: {
      id: articleId,
    },
    select: {
      id: true,
    },
  });

  if (!article) {
    throw new AppError(404, 'Article not found');
  }
}

export async function getArticleNote(
  userId: string,
  articleId: string,
): Promise<NoteResponse> {
  await ensureArticleExists(articleId);

  const note = await prisma.articleNote.findUnique({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
    select: noteSelect,
  });

  if (!note) {
    throw new AppError(404, 'Note not found');
  }

  return note;
}

export async function upsertArticleNote({
  userId,
  articleId,
  content,
}: UpsertArticleNoteInput): Promise<NoteResponse> {
  await ensureArticleExists(articleId);

  const note = await prisma.articleNote.upsert({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
    update: {
      content,
    },
    create: {
      userId,
      articleId,
      content,
    },
    select: noteSelect,
  });

  await completeTodayDailyLog(userId);

  return note;
}

export async function updateNote({
  userId,
  noteId,
  content,
}: UpdateNoteInput): Promise<NoteResponse> {
  const note = await prisma.articleNote.findFirst({
    where: {
      id: noteId,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!note) {
    throw new AppError(404, 'Note not found');
  }

  const updatedNote = await prisma.articleNote.update({
    where: {
      id: noteId,
    },
    data: {
      content,
    },
    select: noteSelect,
  });

  await completeTodayDailyLog(userId);

  return updatedNote;
}

export async function deleteNote(userId: string, noteId: string): Promise<void> {
  const note = await prisma.articleNote.findFirst({
    where: {
      id: noteId,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!note) {
    throw new AppError(404, 'Note not found');
  }

  await prisma.articleNote.delete({
    where: {
      id: noteId,
    },
  });
}

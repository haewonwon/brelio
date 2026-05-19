import { prisma } from '../../lib/prisma.js';
import { ensureTemporaryUser, TEMP_USER_ID } from '../../lib/tempUser.js';
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
  articleId: string,
): Promise<NoteResponse> {
  await ensureArticleExists(articleId);

  const note = await prisma.articleNote.findUnique({
    where: {
      userId_articleId: {
        userId: TEMP_USER_ID,
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
  articleId,
  content,
}: UpsertArticleNoteInput): Promise<NoteResponse> {
  await ensureArticleExists(articleId);
  await ensureTemporaryUser();

  const note = await prisma.articleNote.upsert({
    where: {
      userId_articleId: {
        userId: TEMP_USER_ID,
        articleId,
      },
    },
    update: {
      content,
    },
    create: {
      userId: TEMP_USER_ID,
      articleId,
      content,
    },
    select: noteSelect,
  });

  await completeTodayDailyLog();

  return note;
}

export async function updateNote({
  noteId,
  content,
}: UpdateNoteInput): Promise<NoteResponse> {
  const note = await prisma.articleNote.findFirst({
    where: {
      id: noteId,
      userId: TEMP_USER_ID,
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

  await completeTodayDailyLog();

  return updatedNote;
}

export async function deleteNote(noteId: string): Promise<void> {
  const note = await prisma.articleNote.findFirst({
    where: {
      id: noteId,
      userId: TEMP_USER_ID,
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

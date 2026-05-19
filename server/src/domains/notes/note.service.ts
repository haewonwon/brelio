import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middlewares/error.middleware.js';
import type {
  NoteResponse,
  UpdateNoteInput,
  UpsertArticleNoteInput,
} from './note.types.js';

const TEMP_USER_ID = 'temp-user';

const noteSelect = {
  id: true,
  articleId: true,
  content: true,
  createdAt: true,
  updatedAt: true,
} as const;

async function ensureTemporaryUser() {
  await prisma.user.upsert({
    where: {
      id: TEMP_USER_ID,
    },
    update: {},
    create: {
      id: TEMP_USER_ID,
      email: 'temp-user@brelio.local',
      passwordHash: 'temporary-password-hash',
      name: 'Temporary User',
    },
  });
}

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

  return prisma.articleNote.upsert({
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

  return prisma.articleNote.update({
    where: {
      id: noteId,
    },
    data: {
      content,
    },
    select: noteSelect,
  });
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

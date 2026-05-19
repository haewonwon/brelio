import { z } from '../../lib/zod.js';

export const articleNoteParamsSchema = z.object({
  articleId: z.string().trim().min(1, 'Article id is required'),
});

export const noteParamsSchema = z.object({
  noteId: z.string().trim().min(1, 'Note id is required'),
});

export const noteBodySchema = z.object({
  content: z.string().trim().min(1, 'Note content is required'),
});

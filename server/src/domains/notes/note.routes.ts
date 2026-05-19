import { Router } from 'express';

import {
  handleDeleteNote,
  handleGetArticleNote,
  handleUpdateNote,
  handleUpsertArticleNote,
} from './note.controller.js';
import {
  articleNoteParamsSchema,
  noteBodySchema,
  noteParamsSchema,
} from './note.schema.js';
import { validateRequest } from '../../lib/zod.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const articleNoteRoutes = Router({
  mergeParams: true,
});

export const noteRoutes = Router();

articleNoteRoutes.get(
  '/',
  authMiddleware,
  validateRequest({
    params: articleNoteParamsSchema,
  }),
  asyncHandler(handleGetArticleNote),
);

articleNoteRoutes.post(
  '/',
  authMiddleware,
  validateRequest({
    params: articleNoteParamsSchema,
    body: noteBodySchema,
  }),
  asyncHandler(handleUpsertArticleNote),
);

noteRoutes.patch(
  '/:noteId',
  authMiddleware,
  validateRequest({
    params: noteParamsSchema,
    body: noteBodySchema,
  }),
  asyncHandler(handleUpdateNote),
);

noteRoutes.delete(
  '/:noteId',
  authMiddleware,
  validateRequest({
    params: noteParamsSchema,
  }),
  asyncHandler(handleDeleteNote),
);

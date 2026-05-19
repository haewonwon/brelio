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
import { asyncHandler } from '../../utils/asyncHandler.js';

export const articleNoteRoutes = Router({
  mergeParams: true,
});

export const noteRoutes = Router();

articleNoteRoutes.get(
  '/',
  validateRequest({
    params: articleNoteParamsSchema,
  }),
  asyncHandler(handleGetArticleNote),
);

articleNoteRoutes.post(
  '/',
  validateRequest({
    params: articleNoteParamsSchema,
    body: noteBodySchema,
  }),
  asyncHandler(handleUpsertArticleNote),
);

noteRoutes.patch(
  '/:noteId',
  validateRequest({
    params: noteParamsSchema,
    body: noteBodySchema,
  }),
  asyncHandler(handleUpdateNote),
);

noteRoutes.delete(
  '/:noteId',
  validateRequest({
    params: noteParamsSchema,
  }),
  asyncHandler(handleDeleteNote),
);

import { Router } from 'express';

import {
  handleGetArticleById,
  handleGetArticles,
} from './article.controller.js';
import { validateRequest, z } from '../../lib/zod.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const articleRoutes = Router();

const articleIdParamsSchema = z.object({
  id: z.string().trim().min(1, 'Article id is required'),
});

articleRoutes.get('/', asyncHandler(handleGetArticles));
articleRoutes.get(
  '/:id',
  validateRequest({
    params: articleIdParamsSchema,
  }),
  asyncHandler(handleGetArticleById),
);

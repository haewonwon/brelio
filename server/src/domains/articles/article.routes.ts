import { Router } from 'express';

import {
  handleGetArticleById,
  handleGetArticles,
} from './article.controller.js';
import { articleParamsSchema } from './article.schema.js';
import { validateRequest } from '../../lib/zod.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const articleRoutes = Router();

articleRoutes.get('/', asyncHandler(handleGetArticles));
articleRoutes.get(
  '/:id',
  validateRequest({
    params: articleParamsSchema,
  }),
  asyncHandler(handleGetArticleById),
);

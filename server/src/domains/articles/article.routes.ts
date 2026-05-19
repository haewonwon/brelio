import { Router } from 'express';

import {
  handleGetArticleById,
  handleGetArticles,
} from './article.controller.js';

export const articleRoutes = Router();

articleRoutes.get('/', handleGetArticles);
articleRoutes.get('/:id', handleGetArticleById);

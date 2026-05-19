import { Router } from 'express';

import { handleCrawlArticles } from './crawling.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const crawlingRoutes = Router();

crawlingRoutes.post('/articles', asyncHandler(handleCrawlArticles));

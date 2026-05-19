import type { Request, Response } from 'express';

import { crawlArticles } from './crawling.service.js';
import type { CrawlArticlesResponse } from './crawling.types.js';
import type { SuccessResponse } from '../articles/article.types.js';

export async function handleCrawlArticles(
  _request: Request,
  response: Response<SuccessResponse<CrawlArticlesResponse>>,
) {
  const result = await crawlArticles();

  response.status(200).json({
    success: true,
    data: result,
  });
}

import type { Request, Response } from 'express';

import { getArticleById, getArticles } from './article.service.js';
import type {
  ArticleResponse,
  SuccessResponse,
} from './article.types.js';
import { AppError } from '../../middlewares/error.middleware.js';

export async function handleGetArticles(
  _request: Request,
  response: Response<SuccessResponse<ArticleResponse[]>>,
) {
  const articles = await getArticles();

  response.status(200).json({
    success: true,
    data: articles,
  });
}

export async function handleGetArticleById(
  request: Request<{ id: string }>,
  response: Response<SuccessResponse<ArticleResponse>>,
) {
  const article = await getArticleById(request.params.id);

  if (!article) {
    throw new AppError(404, 'Article not found');
  }

  response.status(200).json({
    success: true,
    data: article,
  });
}

import type { Request, Response } from 'express';

import { getArticleById, getArticles } from './article.service.js';
import type {
  ArticleResponse,
  ErrorResponse,
  SuccessResponse,
} from './article.types.js';

export async function handleGetArticles(
  _request: Request,
  response: Response<SuccessResponse<ArticleResponse[]> | ErrorResponse>,
) {
  try {
    const articles = await getArticles();

    response.status(200).json({
      success: true,
      data: articles,
    });
  } catch {
    response.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch articles',
      },
    });
  }
}

export async function handleGetArticleById(
  request: Request<{ id: string }>,
  response: Response<SuccessResponse<ArticleResponse> | ErrorResponse>,
) {
  try {
    const article = await getArticleById(request.params.id);

    if (!article) {
      response.status(404).json({
        success: false,
        error: {
          message: 'Article not found',
        },
      });
      return;
    }

    response.status(200).json({
      success: true,
      data: article,
    });
  } catch {
    response.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch article',
      },
    });
  }
}

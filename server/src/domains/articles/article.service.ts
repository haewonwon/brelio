import { prisma } from '../../lib/prisma.js';
import type { ArticleResponse } from './article.types.js';

const articleSelect = {
  id: true,
  title: true,
  source: true,
  summary: true,
  url: true,
  publishedAt: true,
  createdAt: true,
} as const;

export async function getArticles(): Promise<ArticleResponse[]> {
  const articlesWithPublishedAt = await prisma.article.findMany({
    select: articleSelect,
    where: {
      publishedAt: {
        not: null,
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
  });

  const articlesWithoutPublishedAt = await prisma.article.findMany({
    select: articleSelect,
    where: {
      publishedAt: null,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return [...articlesWithPublishedAt, ...articlesWithoutPublishedAt];
}

export async function getArticleById(
  articleId: string,
): Promise<ArticleResponse | null> {
  return prisma.article.findUnique({
    where: {
      id: articleId,
    },
    select: articleSelect,
  });
}

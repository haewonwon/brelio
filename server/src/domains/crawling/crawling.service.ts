import axios from 'axios';
import * as cheerio from 'cheerio';

import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middlewares/error.middleware.js';
import type { CrawledArticle, CrawlArticlesResponse } from './crawling.types.js';

const DEFAULT_CRAWLING_URL = 'https://www.marketwatch.com/economy-politics';
const DEFAULT_SOURCE = 'MarketWatch';
const MIN_TITLE_LENGTH = 20;
const MAX_ARTICLES = 10;

function getCrawlingUrl() {
  return process.env.CRAWLING_ARTICLE_URL ?? DEFAULT_CRAWLING_URL;
}

function normalizeUrl(url: string) {
  return new URL(url, getCrawlingUrl()).toString();
}

function normalizeTitle(title: string) {
  return title.replace(/\s+/g, ' ').trim();
}

function getTemporarySummary(title: string) {
  return `${title} 기사 요약은 아직 준비 중입니다.`;
}

function parseArticlesFromHtml(html: string): CrawledArticle[] {
  const $ = cheerio.load(html);
  const articlesByUrl = new Map<string, CrawledArticle>();
  const collectedAt = new Date();
  const linkElements = $('a[href]').toArray() as unknown[];

  for (const element of linkElements) {
    const linkElement = $(element as never);
    const title = normalizeTitle(linkElement.text());
    const href = linkElement.attr('href');

    if (!href || title.length < MIN_TITLE_LENGTH) {
      continue;
    }

    let url: string;

    try {
      url = normalizeUrl(href);
    } catch {
      continue;
    }

    if (!url.startsWith('http') || articlesByUrl.has(url)) {
      continue;
    }

    articlesByUrl.set(url, {
      title,
      source: DEFAULT_SOURCE,
      url,
      summary: getTemporarySummary(title),
      publishedAt: collectedAt,
    });
  }

  return Array.from(articlesByUrl.values()).slice(0, MAX_ARTICLES);
}

async function fetchArticleHtml() {
  const response = await axios.get<string>(getCrawlingUrl(), {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; BrelioCrawler/0.1; +https://brelio.local)',
    },
    timeout: 10000,
  });

  return response.data;
}

export async function crawlArticles(): Promise<CrawlArticlesResponse> {
  try {
    const html = await fetchArticleHtml();
    const crawledArticles = parseArticlesFromHtml(html);

    let savedCount = 0;
    let skippedCount = 0;

    for (const article of crawledArticles) {
      const existingArticle = await prisma.article.findUnique({
        where: {
          url: article.url,
        },
        select: {
          id: true,
        },
      });

      if (existingArticle) {
        skippedCount += 1;
        continue;
      }

      await prisma.article.create({
        data: article,
      });

      savedCount += 1;
    }

    return {
      totalCount: crawledArticles.length,
      savedCount,
      skippedCount,
    };
  } catch {
    throw new AppError(500, 'Failed to crawl articles');
  }
}

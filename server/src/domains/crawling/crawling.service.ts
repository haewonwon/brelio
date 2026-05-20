import axios from 'axios';
import * as cheerio from 'cheerio';

import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middlewares/error.middleware.js';
import type {
  CrawledArticle,
  CrawlArticlesResponse,
  ParsedCrawledArticles,
} from './crawling.types.js';

const DEFAULT_CRAWLING_URL = 'https://www.hankyung.com/feed/economy';
const DEFAULT_LANGUAGE = 'ko';
const DEFAULT_REGION = 'KR';
const DEFAULT_SOURCE = '한국경제';
const MIN_TITLE_LENGTH = 5;
const MAX_ARTICLES = 10;

function getCrawlingUrl() {
  return process.env.CRAWLING_ARTICLE_URL ?? DEFAULT_CRAWLING_URL;
}

function getCrawlingLanguage() {
  return process.env.CRAWLING_LANGUAGE ?? DEFAULT_LANGUAGE;
}

function getCrawlingRegion() {
  return process.env.CRAWLING_REGION ?? DEFAULT_REGION;
}

function getCrawlingKeywords() {
  const keywords = process.env.CRAWLING_KEYWORDS;

  if (!keywords) {
    return [];
  }

  return keywords
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean);
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

function hasKoreanText(text: string) {
  return /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(text);
}

function matchesKeywords(article: CrawledArticle) {
  const keywords = getCrawlingKeywords();

  if (keywords.length === 0) {
    return true;
  }

  return keywords.some((keyword) => {
    return article.title.includes(keyword) || article.summary.includes(keyword);
  });
}

function shouldKeepArticle(article: CrawledArticle) {
  const language = getCrawlingLanguage();
  const region = getCrawlingRegion();

  if (language !== 'ko' || region !== 'KR') {
    return false;
  }

  return hasKoreanText(article.title) && matchesKeywords(article);
}

function parsePublishedAt(value: string | undefined, fallback: Date) {
  if (!value) {
    return fallback;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return fallback;
  }

  return parsedDate;
}

function parseArticlesFromRss(html: string): ParsedCrawledArticles {
  const $ = cheerio.load(html);
  const articlesByUrl = new Map<string, CrawledArticle>();
  const collectedAt = new Date();
  let totalCount = 0;
  let filteredCount = 0;

  $('item').each((_index, element) => {
    const item = $(element);
    const title = normalizeTitle(item.find('title').first().text());
    const href = item.find('link').first().text().trim();
    const summary = normalizeTitle(
      item.find('description').first().text() || getTemporarySummary(title),
    );

    if (!href || title.length < MIN_TITLE_LENGTH) {
      return;
    }

    let url: string;

    try {
      url = normalizeUrl(href);
    } catch {
      return;
    }

    if (!url.startsWith('http') || articlesByUrl.has(url)) {
      return;
    }

    totalCount += 1;

    const article = {
      title,
      source: DEFAULT_SOURCE,
      url,
      summary,
      publishedAt: parsePublishedAt(
        item.find('pubDate').first().text(),
        collectedAt,
      ),
    };

    if (!shouldKeepArticle(article)) {
      filteredCount += 1;
      return;
    }

    articlesByUrl.set(url, article);
  });

  return {
    articles: Array.from(articlesByUrl.values()).slice(0, MAX_ARTICLES),
    totalCount,
    filteredCount,
  };
}

async function fetchArticleFeed() {
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
    const feed = await fetchArticleFeed();
    const { articles, filteredCount, totalCount } = parseArticlesFromRss(feed);

    let savedCount = 0;
    let skippedCount = 0;

    for (const article of articles) {
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
      totalCount,
      savedCount,
      skippedCount,
      filteredCount,
    };
  } catch {
    throw new AppError(500, 'Failed to crawl articles');
  }
}

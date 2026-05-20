export type CrawledArticle = {
  title: string;
  source: string;
  url: string;
  summary: string;
  publishedAt: Date;
};

export type CrawlArticlesResponse = {
  totalCount: number;
  savedCount: number;
  skippedCount: number;
  filteredCount: number;
};

export type ParsedCrawledArticles = {
  articles: CrawledArticle[];
  totalCount: number;
  filteredCount: number;
};

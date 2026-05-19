export type ArticleResponse = {
  id: string;
  title: string;
  source: string | null;
  summary: string | null;
  url: string;
  publishedAt: Date | null;
  createdAt: Date;
};

export type SuccessResponse<T> = {
  success: true;
  data: T;
};

export type ErrorResponse = {
  success: false;
  error: {
    message: string;
  };
};

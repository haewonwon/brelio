import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';

type ErrorResponseBody = {
  success: false;
  error: {
    message: string;
    stack?: string;
  };
};

export class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

function getErrorStack(error: unknown) {
  if (error instanceof Error) {
    return error.stack;
  }

  return undefined;
}

function getStatusCode(error: unknown) {
  if (error instanceof AppError) {
    return error.statusCode;
  }

  if (error instanceof ZodError) {
    return 400;
  }

  return 500;
}

function getResponseMessage(error: unknown) {
  if (error instanceof ZodError) {
    return 'Invalid request';
  }

  if (error instanceof AppError) {
    return error.message;
  }

  return 'Internal server error';
}

export const notFoundMiddleware: RequestHandler = (request, _response, next) => {
  next(new AppError(404, `Route not found: ${request.method} ${request.originalUrl}`));
};

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _request,
  response,
  next,
) => {
  void next;

  const statusCode = getStatusCode(error);
  const body: ErrorResponseBody = {
    success: false,
    error: {
      message: getResponseMessage(error),
    },
  };

  if (process.env.NODE_ENV === 'development') {
    body.error.stack = getErrorStack(error);
  }

  response.status(statusCode).json(body);
};

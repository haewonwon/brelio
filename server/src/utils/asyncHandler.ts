import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';

export function asyncHandler<
  Params extends ParamsDictionary = ParamsDictionary,
  ResponseBody = unknown,
  RequestBody = unknown,
  RequestQuery = ParsedQs,
  Locals extends Record<string, unknown> = Record<string, unknown>,
>(
  handler: (
    request: Request<Params, ResponseBody, RequestBody, RequestQuery, Locals>,
    response: Response<ResponseBody, Locals>,
    next: NextFunction,
  ) => Promise<void>,
): RequestHandler<Params, ResponseBody, RequestBody, RequestQuery, Locals> {
  return (request, response, next) => {
    handler(request, response, next).catch(next);
  };
}

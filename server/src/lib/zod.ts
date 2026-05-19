import type { RequestHandler } from 'express';
import { z } from 'zod';

type RequestValidationSchema = {
  params?: z.ZodType;
  query?: z.ZodType;
  body?: z.ZodType;
};

export { z };

export function validateRequest(schema: RequestValidationSchema): RequestHandler {
  return (request, _response, next) => {
    try {
      if (schema.params) {
        schema.params.parse(request.params);
      }

      if (schema.query) {
        schema.query.parse(request.query);
      }

      if (schema.body) {
        schema.body.parse(request.body);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

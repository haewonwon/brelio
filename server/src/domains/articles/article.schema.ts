import { z } from '../../lib/zod.js';

export const articleParamsSchema = z.object({
  id: z.string().trim().min(1, 'Article id is required'),
});

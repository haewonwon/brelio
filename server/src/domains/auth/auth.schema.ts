import { z } from '../../lib/zod.js';

export const googleAuthBodySchema = z.object({
  idToken: z.string().trim().min(1, 'Google idToken is required'),
});

import type { AuthenticatedUser } from '../domains/auth/auth.types.js';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};

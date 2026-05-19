import type { Request, Response } from 'express';

import { signInWithGoogle } from './auth.service.js';
import type { GoogleAuthRequestBody, GoogleAuthResponse } from './auth.types.js';
import type { SuccessResponse } from '../articles/article.types.js';

export async function handleGoogleAuth(
  request: Request<unknown, unknown, GoogleAuthRequestBody>,
  response: Response<SuccessResponse<GoogleAuthResponse>>,
) {
  const result = await signInWithGoogle(request.body.idToken);

  response.status(200).json({
    success: true,
    data: result,
  });
}

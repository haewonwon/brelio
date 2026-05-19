import { OAuth2Client } from 'google-auth-library';
import type { TokenPayload } from 'google-auth-library';

import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { signAccessToken } from '../../utils/jwt.js';
import type { GoogleAuthResponse } from './auth.types.js';

const googleClient = new OAuth2Client();

function getGoogleClientId() {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new AppError(500, 'Google client id is not configured');
  }

  return clientId;
}

export async function signInWithGoogle(
  idToken: string,
): Promise<GoogleAuthResponse> {
  const clientId = getGoogleClientId();
  let payload: TokenPayload | undefined;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: clientId,
    });

    payload = ticket.getPayload();
  } catch {
    throw new AppError(401, 'Invalid Google idToken');
  }

  if (!payload?.sub || !payload.email) {
    throw new AppError(401, 'Invalid Google idToken');
  }

  const user = await prisma.user.upsert({
    where: {
      email: payload.email,
    },
    update: {
      googleId: payload.sub,
      name: payload.name,
      profileImageUrl: payload.picture,
    },
    create: {
      email: payload.email,
      googleId: payload.sub,
      name: payload.name,
      profileImageUrl: payload.picture,
    },
    select: {
      id: true,
      email: true,
      name: true,
      profileImageUrl: true,
    },
  });

  const accessToken = signAccessToken({
    id: user.id,
    email: user.email,
  });

  return {
    accessToken,
    user,
  };
}

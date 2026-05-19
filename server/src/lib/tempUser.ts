import { prisma } from './prisma.js';

export const TEMP_USER_ID = 'temp-user';

export async function ensureTemporaryUser() {
  await prisma.user.upsert({
    where: {
      id: TEMP_USER_ID,
    },
    update: {},
    create: {
      id: TEMP_USER_ID,
      email: 'temp-user@brelio.local',
      passwordHash: 'temporary-password-hash',
      name: 'Temporary User',
    },
  });
}

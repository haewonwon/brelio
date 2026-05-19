export type GoogleAuthRequestBody = {
  idToken: string;
};

export type AuthUserResponse = {
  id: string;
  email: string;
  name: string | null;
  profileImageUrl: string | null;
};

export type GoogleAuthResponse = {
  accessToken: string;
  user: AuthUserResponse;
};

export type AuthenticatedUser = {
  id: string;
  email: string;
};

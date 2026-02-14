import { SessionOptions } from 'iron-session';

export interface SessionData {
  user?: {
    id: string;
    email: string;
    isVerified: boolean;
  };
  isLoggedIn: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD || 'complex_password_at_least_32_characters_long',
  cookieName: 'ai_studio_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  },
};

export const defaultSession: SessionData = {
  isLoggedIn: false,
};

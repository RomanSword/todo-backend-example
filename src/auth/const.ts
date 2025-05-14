import { CookieOptions } from 'express';

const ONE_MIN = 60 * 1000;
const MAX_AGE_15_MIN = 15 * ONE_MIN;
const MAX_AGE_1_DAY = 24 * 60 * ONE_MIN;

export const MAX_AGE_ACCESS_TOKEN = MAX_AGE_15_MIN;
export const MAX_AGE_REFRESH_TOKEN = MAX_AGE_1_DAY;

export const COOKIE_CONFIG: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax'
};

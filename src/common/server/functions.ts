import { IncomingMessage } from 'http';
import { parse } from 'url';
import { safeKey } from '@common/utils';

/**
 * getCookies from http IncomingMessage
 * @param req IncomingMessage - http IncomingMessage
 */
export const getCookies = (req: IncomingMessage): Map<string, string> => {
  const cookies = new Map<string, string>();

  if (!req.headers.cookie) return cookies;

  req.headers.cookie.split(';').forEach((cookie) => {
    const data = cookie.split('=');

    cookies.set(data[0].trim(), data[1].trim());
  });

  return cookies;
};

/**
 * Get Set-Cookie string with parameters.
 * You will get "${cookieName}=${value};Max-Age=${maxAge};domain=${domain};path=/;HttpOnly;SameSite=Lax;secure;"
 * sucure flag is going to be skipped if domain is "localhost"
 * @param cookieName - The cookie name
 * @param value - The cookie value
 * @param domain - The domain name
 * @param maxAge - The max age. default is 600
 * @param HttpOnly - The HttpOnly. default is true
 */
export const getSetCookie = (cookieName: string, value: string, domain: string, maxAge: number = 600, httpOnly: boolean = true): string => {
  let setCookie = `${cookieName}=${value};Max-Age=${maxAge};domain=${domain};path=/;SameSite=Lax;`;

  if (domain !== 'localhost') {
    setCookie += 'secure;';
  }

  if (httpOnly) {
    setCookie += 'HttpOnly;';
  }

  return setCookie;
};

/**
 * Extracr url query value
 * @param req - IncomingMessage
 * @param key - key
 * @param defaultValue - default value
 */
export const extractUrlQueryValue = (req: IncomingMessage, key: string, defaultValue: string = ''): string => {
  const queryParams = parse(req.url, true).query;
  const queryValue = queryParams[safeKey(key)];

  return typeof queryValue === 'string' ? queryValue : defaultValue;
};

/**
 * Check whether request is ajax or not
 * @param req - IncomingMessage
 */
export const isAjax = (req: IncomingMessage): boolean => {
  const pathname = parse(req.url).pathname;

  return !req.headers.accept.includes('html') && pathname && pathname.includes('.json');
};

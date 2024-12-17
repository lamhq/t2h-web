import { stringify } from 'querystring';
import { ServiceContext } from './context';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

const transform = (body: FormData | string | { [key: string]: any }): FormData | string => {
  if (process.browser) {
    if (!(body instanceof FormData) && typeof body !== 'string') {
      return JSON.stringify(body);
    }
  } else {
    if (typeof body !== 'string') {
      return JSON.stringify(body);
    }
  }

  return body;
};

export const isofetch = async (
  context: ServiceContext,
  method: HttpMethod,
  path: string,
  options: {
    body?: FormData | string | { [key: string]: any };
    query?: any;
    headers?: HeadersInit;
  } = {},
): Promise<Response> => {
  if (!options.body) {
    options.body = '';
  }

  if (!options.query) {
    options.query = {};
  }

  if (!options.headers) {
    options.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  }

  const queryStr = stringify(options.query);
  let fullUrl = context.useProxy
    ? `${context.scheme}://${context.domain}:${context.port}/proxy${path}`
    : `${context.scheme}://${context.domain}:${context.port}${path}`;

  if (queryStr.length > 0) {
    fullUrl += `?${queryStr}`;
  }

  if (method === 'GET' || method == 'DELETE') {
    return await fetch(fullUrl, {
      method: method,
      headers: { ...options.headers, ...context.headers },
      credentials: 'include',
    });
  } else {
    return await fetch(fullUrl, {
      method: method,
      headers: { ...options.headers, ...context.headers },
      credentials: 'include',
      body: transform(options.body),
    });
  }
};

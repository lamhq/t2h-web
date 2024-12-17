import getConfig from 'next/config';
import nextCookie from 'next-cookies';
import { ServiceContext } from './context';

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

export function createApiClient<T extends (ctx: ServiceContext) => ReturnType<T>>(
  ApiDefinition: T,
  context?: { req?: { headers: Record<string, any> } },
): ReturnType<T> {
  const cookie = context?.req.headers.cookie ?? '';
  const forward = context?.req.headers['x-forwarded-for'] ?? '';
  const userAgent = context?.req.headers['user-agent'] ?? '';

  if (process.browser) {
    // Call proxy
    return ApiDefinition({
      headers: { cookie },
      domain: publicRuntimeConfig.proxy.domain,
      port: publicRuntimeConfig.proxy.port,
      scheme: publicRuntimeConfig.proxy.scheme,
      useProxy: true,
    });
  } else {
    const getHeaders = (ctx: { req?: { headers: Record<string, any> } }) => {
      const headers = {
        'x-forwarded-for': forward,
        'user-agent': userAgent,
      };
      const { token } = nextCookie(ctx);

      if (token) {
        const authorization = `Bearer ${token}`;

        headers['authorization'] = authorization;
      }

      return headers;
    };

    // Call backend API directly
    return ApiDefinition({
      headers: getHeaders(context || {}),
      domain: serverRuntimeConfig.backend.domain,
      port: serverRuntimeConfig.backend.port,
      scheme: serverRuntimeConfig.backend.scheme,
      useProxy: false,
    });
  }
}

import { parse } from 'url';
import { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';
import { generateRandom } from '@common/utils';
import { getSetCookie, extractUrlQueryValue } from '@common/server';

const { serverRuntimeConfig } = getConfig();

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(403).json({ message: `Method ${res.statusCode} is not allowed` });
  }

  const { line, domain, serverCookie } = serverRuntimeConfig;
  const state = generateRandom(16);
  const oauth2Url =
    'https://access.line.me/oauth2/v2.1/authorize?response_type=code&' +
    `client_id=${line.channelId}` +
    `&redirect_uri=${encodeURIComponent(line.callbackUrl)}` +
    `&state=${state}` +
    `&scope=profile%20openid%20email`;
  const redirectBackUrl = parse(extractUrlQueryValue(req, 'redirect_back', '/')).path ?? '/';
  const setCookieCsrf = getSetCookie(serverCookie.lineOauth2State, state, domain);
  const setCookieRedirectBackUrl = getSetCookie(serverCookie.redirectBackUrl, redirectBackUrl, domain);

  res.writeHead(302, {
    Location: oauth2Url,
    'Set-Cookie': [setCookieCsrf, setCookieRedirectBackUrl],
  });
  res.end();
};

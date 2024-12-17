import { parse } from 'url';
import { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';
import { generateRandom } from '@common/utils';
import { getSetCookie, extractUrlQueryValue } from '@common/server';

const { serverRuntimeConfig } = getConfig();

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(403).json({ message: `Method ${req.method} is not allowed` });
  }

  const { facebook, domain, serverCookie } = serverRuntimeConfig;
  const state = generateRandom(16);
  const oauth2Url =
    'https://www.facebook.com/v7.0/dialog/oauth?' +
    `client_id=${facebook.appId}` +
    `&redirect_uri=${encodeURIComponent(facebook.callbackUrl)}` +
    `&state=${state}` +
    `&scope=email`;
  const redirectBackUrl = parse(extractUrlQueryValue(req, 'redirect_back', '/')).path ?? '/';
  const setCookieCsrf = getSetCookie(serverCookie.facebookOauth2State, state, domain);
  const setCookieRedirectBackUrl = getSetCookie(serverCookie.redirectBackUrl, redirectBackUrl, domain);

  res.writeHead(302, {
    Location: oauth2Url,
    'Set-Cookie': [setCookieCsrf, setCookieRedirectBackUrl],
  });
  res.end();
};

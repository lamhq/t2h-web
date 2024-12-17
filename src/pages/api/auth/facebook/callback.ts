import { encode } from 'querystring';
import * as jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'isomorphic-unfetch';
import getConfig from 'next/config';
import { Oauth2CallbackHandler, getCookies, getSetCookie } from '@common/server';

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const tokenIssuer = async (req: NextApiRequest, code: string, state: string) => {
  const { facebook, serverCookie } = serverRuntimeConfig;
  const cookies = getCookies(req);
  const csrfState = cookies.get(serverCookie.facebookOauth2State);

  if (csrfState !== state) {
    throw new Error('The given state token is not equal to CSRF state token');
  }

  const url = 'https://graph.facebook.com/v7.0/oauth/access_token';
  const queryParams = {
    client_id: facebook.appId,
    client_secret: facebook.appSecret,
    redirect_uri: facebook.callbackUrl,
    code,
  };
  const response = await fetch(url + '?' + encode(queryParams));

  if (!response.ok) {
    throw new Error('Unable to create a provider access token');
  }

  const responseBody = await response.json();

  return { accessToken: responseBody['access_token'], idToken: undefined };
};

// eslint-disable-next-line complexity
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(403).json({ message: `Method ${req.method} is not allowed` });
  }

  const { domain, serverCookie, backend } = serverRuntimeConfig;
  const { clientCookie } = publicRuntimeConfig;
  const cookies = getCookies(req);

  let redirectBackUrl = cookies.get(serverCookie.redirectBackUrl) ?? '/';
  const handler = new Oauth2CallbackHandler({ provider: 'facebook', backend }, tokenIssuer);
  const redirectCookies = [];

  try {
    // JWT Token by backend
    const token = cookies.get('token');

    if (token === undefined || token === null || token === '') {
      //Not logged in
      const accessToken = await handler.execute(req);
      const tokenSetCookie = getSetCookie(serverCookie.accessToken, accessToken['access_token'], domain, accessToken['expires_in']);
      const decoded = jwt.decode(accessToken['access_token']) as { [key: string]: any };

      if ('status' in decoded && decoded['status'] === 'draft') {
        redirectBackUrl = '/signup/social';
      }

      redirectCookies.push(tokenSetCookie);
    } else {
      await handler.connect(req);
    }
  } catch (err) {
    redirectCookies.push(getSetCookie(clientCookie.errorFlashMessage, err.message, domain, 60, false));
  } finally {
    // Delete state, no longer needed
    const deleteCookieCsrf = getSetCookie(serverCookie.facebookOauth2State, '', domain, 0);
    const deleteCookieRedirectBackUrl = getSetCookie(serverCookie.redirectBackUrl, '', domain, 0);

    res.writeHead(302, {
      Location: redirectBackUrl,
      'Set-Cookie': [deleteCookieCsrf, deleteCookieRedirectBackUrl, ...redirectCookies],
    });
    res.end();
  }
};

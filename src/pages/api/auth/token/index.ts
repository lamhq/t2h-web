import { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';
import { getSetCookie } from '@common/server';
import fetch from 'isomorphic-unfetch';

const { serverRuntimeConfig } = getConfig();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(403).json({ message: `Method ${req.method} is not allowed` });
  }

  const { serverCookie, domain, backend } = serverRuntimeConfig;
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  const response = await fetch(`${backend.scheme}://${backend.domain}:${backend.port}/auth/token`, {
    method: 'POST',
    headers,
    body: JSON.stringify(req.body),
  });
  const responseBody = await response.json();

  if (!response.ok || !('access_token' in responseBody)) {
    return res.status(response.status).json(responseBody);
  }

  const tokenSetCookie = getSetCookie(serverCookie.accessToken, responseBody['access_token'], domain, responseBody['expires_in']);

  res.setHeader('Set-Cookie', tokenSetCookie);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.json({ message: 'logged in successfully' });
};

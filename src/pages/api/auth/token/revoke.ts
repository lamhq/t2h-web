import { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';
import { getSetCookie } from '@common/server';

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(403).json({ message: `Method ${req.method} is not allowed` });
  }

  const { serverCookie, domain } = serverRuntimeConfig;
  const { clientCookie } = publicRuntimeConfig;
  const removeTokenSetCookie = getSetCookie(serverCookie.accessToken, '', domain, 0);
  const infoFlashMessageSetCookie = getSetCookie(clientCookie.infoFlashMessage, 'You have been successfully signed out', domain, 60, false);

  res.writeHead(302, {
    Location: '/',
    'Set-Cookie': [removeTokenSetCookie, infoFlashMessageSetCookie],
  });
  res.end();
};

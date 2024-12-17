const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const next = require('next');
const nextI18NextMiddleware = require('next-i18next/middleware').default;
const nextI18next = require('./i18n');
const { join } = require('path');
const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, distDir: join(__dirname, './.next') });
const handle = app.getRequestHandler();

require('dotenv').config();

app.prepare()
  .then(async () => {
    const { BACKEND_SCHEME, BACKEND_DOMAIN, BACKEND_PORT } = process.env;
    const server = express();

    server.disable('x-powered-by');
    server.use(helmet());
    server.use(
      morgan((tokens, req, res) => {
        const forwarded = (req.headers['x-forwarded-for'] || req.ip || 'unknown').replace(' ', '').split(',');

        return [
          tokens.method(req, res),
          tokens.url(req, res),
          tokens.status(req, res),
          tokens.res(req, res, 'content-length'),
          '-',
          tokens['response-time'](req, res),
          'ms',
          forwarded[0],
        ].join(' ');
      }),
    );

    await nextI18next.initPromise;
    server.use(nextI18NextMiddleware(nextI18next));
    server.use(cookieParser());
    server.use('/proxy', createProxyMiddleware({
      target: `${BACKEND_SCHEME || 'http'}://${BACKEND_DOMAIN || 'localhost'}:${BACKEND_PORT || '8000'}/`,
      changeOrigin: true,
      xfwd: true,
      pathRewrite: {
        '^/proxy': '/', // rewrite path
      },
      onProxyReq: (proxyReq, req, res) => {
        if ('token' in req.cookies) {
          proxyReq.setHeader('Authorization', `Bearer ${req.cookies.token}`);
        }
      }
    }));
    server.all('/api/*', (req, res, next) => {
      return handle(req, res);
    });
    server.get('/healthcheck', (req, res, next) => {
      return res.status(200).json({ status: 'available' })
    });

    // Remove unused headers of static files for CDN cache
    if (process.env.NODE_ENV === 'production') {
      server.get('/_next/static/*', (req, res, next) => {
        const ret = handle(req, res);
        res.removeHeader('set-cookie');
        res.removeHeader('content-language');
      });
    }

    const isBasicAuthSuccess = (req, res) => {
      const auth = { login: 'tr0k2hand', password: '4bvoXZVSctB4vLetODgb' };
      // parse login and password from headers
      const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
      const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

      return login && password && login === auth.login && password === auth.password;
    };

    server.get('*', (req, res, next) => {
      // handle GET request to /service-worker.js
      if (req.path === '/service-worker.js') {
        const filePath = join(__dirname, './.next', req.path);
        app.serveStatic(req, res, filePath);
      } else if (!isBasicAuthSuccess(req, res) && process.env.DOMAIN !== 'localhost') {
        res.set('WWW-Authenticate', 'Basic realm="401"');
        res.status(401).send('Authentication required.');
      } else {
        return handle(req, res);
      }
    });

    await server.listen(port || '3000');
    console.log(`> Ready on http://localhost:${port}`);
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  })

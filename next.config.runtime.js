module.exports = {
  poweredByHeader: process.env.NODE_ENV === 'development',
  exportTrailingSlash: true,
  compress: false,
  serverRuntimeConfig: {
    // Will only be available on the server side
    domain: process.env.DOMAIN,
    serverCookie: {
      redirectBackUrl: 't2h_redirect_back_url',
      facebookOauth2State: 't2h_facebook_oauth2_state',
      lineOauth2State: 't2h_line_oauth2_state',
      // Backend Access Token
      accessToken: 'token',
    },
    facebook: {
      appId: process.env.FACEBOOK_APP_ID,
      appSecret: process.env.FACEBOOK_APP_SECRET,
      callbackUrl: process.env.FACEBOOK_CALLBACK_URL,
    },
    line: {
      channelId: process.env.LINE_CHANNEL_ID,
      channelSecret: process.env.LINE_CHANNEL_SECRET,
      callbackUrl: process.env.LINE_CALLBACK_URL,
    },
    backend: {
      domain: process.env.BACKEND_DOMAIN || 'localhost',
      port: process.env.BACKEND_PORT || 8000,
      scheme: process.env.BACKEND_SCHEME || 'http',
    }
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    proxy: {
      domain: process.env.PROXY_DOMAIN || 'localhost',
      port: process.env.PROXY_PORT || 3000,
      scheme: process.env.PROXY_SCHEME || 'http',
    },
    clientCookie: {
      errorFlashMessage: 't2h_error_flash_message',
      infoFlashMessage: 't2h_info_flash_message',
    },
    omise: {
      publicKey: process.env.OMISE_PUBLIC_KEY,
    },
    recaptcha: {
      siteKey: process.env.RECAPTCHA_SITE_KEY,
    },
  },
};

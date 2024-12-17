import App from 'next/app';
import dynamic from 'next/dynamic';
import React from 'react';
import Error from 'next/error';
import Router from 'next/router';
import ReactDom from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { appWithTranslation } from '@server/i18n';
import { theme } from '@components/global/theme';
import GlobalSpinnerContextProvider from '@contexts/GlobalSpinnerContext';
import GlobalSnackbarContextProvider from '@contexts/GlobalSnackbarContext';
import GlobalOverflowContextProvider from '@contexts/GlobalOverflowContext';
import { isServerSideError } from '@common/utils/error';
import { GlobalNotificationsContextProvider } from '@hocs/withNotification';

// Dynamic Loading with no ssr because it's not used for critical rendering path
const NavProgress = dynamic(async () => import('@components/global/NavProgress'), { ssr: false });
const GlobalSpinner = dynamic(async () => import('@components/molecules/GlobalSpinner'), { ssr: false });
const GlobalSnackbar = dynamic(async () => import('@components/organisms/GlobalSnackbar'), { ssr: false });

class MyApp extends App {
  componentDidMount() {
    if (process.env.NODE_ENV !== 'production') {
      const axe = require('react-axe');

      axe(React, ReactDom, 1000);
    }

    this.removeServerSideStyle();
    this.redirectIfServerSideErrorSpecified();
    this.setScrollRestorationEvent();
  }

  componentDidUpdate() {
    this.redirectIfServerSideErrorSpecified();
  }

  removeServerSideStyle() {
    const jssStyles = document.querySelector('#jss-server-side');

    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  // https://github.com/vercel/next.js/issues/3303
  setScrollRestorationEvent() {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
      const cachedScrollPositions = [];
      let shouldScrollRestore;

      Router.events.on('routeChangeStart', () => {
        cachedScrollPositions.push([window.scrollX, window.scrollY]);
      });

      Router.events.on('routeChangeComplete', () => {
        if (shouldScrollRestore) {
          const { x, y } = shouldScrollRestore;

          setTimeout(() => {
            window.scrollTo(x, y);
          }, 100);
          shouldScrollRestore = false;
        }
      });

      Router.beforePopState(() => {
        if (cachedScrollPositions.length > 0) {
          const [x, y] = cachedScrollPositions.pop();

          shouldScrollRestore = { x, y };
        }

        return true;
      });
    }
  }

  redirectIfServerSideErrorSpecified() {
    const { pageProps } = this.props;

    // https://github.com/vercel/next.js/issues/12409
    // redirect if server side didn't return 301
    if (process.browser && isServerSideError(pageProps.error) && pageProps.error.redirect) {
      Router.replace(pageProps.error.redirect);
    }
  }

  render() {
    const { Component, pageProps } = this.props;
    const { error } = pageProps;

    const renderWithGlobalContext = (children) => {
      return (
        <GlobalOverflowContextProvider>
          <GlobalSpinnerContextProvider>
            {/* FIXME: First Load JS has been increased because of this */}
            <GlobalSpinner />
            <GlobalSnackbarContextProvider>
              <GlobalNotificationsContextProvider>
                {/* FIXME: First Load JS has been increased because of this */}
                <GlobalSnackbar />
                {children}
              </GlobalNotificationsContextProvider>
            </GlobalSnackbarContextProvider>
          </GlobalSpinnerContextProvider>
        </GlobalOverflowContextProvider>
      );
    };

    return (
      <React.Fragment>
        <NavProgress />
        <ThemeProvider theme={theme}>
          {renderWithGlobalContext(error ? <Error statusCode={error.statusCode} /> : <Component {...pageProps} />)}
        </ThemeProvider>
        {/* normalize. FIXME: createGlobalStyle doesn't work on SSR for some reason :( */}
        <style global jsx>
          {`
            html {
              line-height: 1.15;
              -webkit-text-size-adjust: 100%;
            }
            input,
            body,
            textarea {
              font-family: Helvetica, Arial, sans-serif;
            }
            body {
              margin: 0;
            }
            a {
              text-decoration: none;
              border-bottom: none;
              cursor: pointer;
            }
            a:visited {
              text-decoration: none;
              border-bottom: none;
            }
            a:hover {
              text-decoration: none;
              border-bottom: none;
            }
            #__next {
              width: 100%;
              height: 100%;
            }
          `}
        </style>
      </React.Fragment>
    );
  }
}

export default appWithTranslation(MyApp);

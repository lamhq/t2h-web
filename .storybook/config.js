import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@components/global/theme';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

addDecorator((story) => (
  <ThemeProvider theme={theme}>
    <I18nextProvider i18n={i18n}>
      {story()}
    </I18nextProvider>
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
          overflow-y: scroll;
          overflow-x: hidden;
        }
        a {
          text-decoration: none;
          border-bottom: none;
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
  </ThemeProvider>
));

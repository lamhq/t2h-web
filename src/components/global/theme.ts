import 'styled-components';
import breakpoints from './breakpoints';

export const theme = {
  /* styled-system theme start */
  space: ['0px', '4px', '8px', '16px', '24px', '32px', '64px', '128px', '256px', '512px'],
  colors: {
    white: '#ffffff',
    black: '#000000',
    lightGrey: '#8898aa',
    darkGrey: '#333333',
    primary: '#000a12',
    secondary: '#000a12',
    placeholder: '#989898',
    danger: '#ed1c24',
    link: '#2d8eff',
    separator: '#778f96',
    separatorBorder: '#8898aa',
    text: '#1d3461',
    inputText: '#333333',
    menuText: '#333333',
    border: '#dddddd',
    borderFocused: '#000a12',
    boxBackgroundColor: '#f0f4f7',
    background: '#f9f9f9',
    selected: 'rgba(0, 0, 0, 0.08)',
    unselected: 'rgba(29, 52, 97, 0.2)',
    icon: '#000a12',
    helpIcon: '#a9a9a9',
    passwordStrength: '#1d3461',
    passwordRule: '#989898',
    loadingSpinner: '#000a12',
    success: '#5AB203',
    label: '#222222',
    warning: '#F98120',
    info: '#FFE500',
    boost: '#ff3c35',
    dialogBackground: 'rgba(0,0,0,0.6)',
    red: '#ff3c35',
    yellow: '#EFBC21',
    description: '#666666',
    answerBox: '#f6f6f6',
    line: '#01c34d',
    facebook: '#3B5998',
  },
  fontSizes: ['12px', '14px', '16px', '18px', '20px', '23px', '28px', '32px'],
  letterSpacings: ['0.06px', '0.07px', '0.08px', '0.09px', '0.1px', '0.1px', '0.2px'],
  lineHeights: ['17px', '19px', '22px', '26px', '28px', '37px', '43px'],
  fonts: {
    primary: `'Product Sans', sans-serif`,
    secondary: `'Open Sans', sans-serif`,
    link: `'Open Sans', sans-serif`,
  },
  breakpoints,
  /* styled-system theme end */
} as const;

// ______________________________________________________
//
type AppTheme = typeof theme;
// ______________________________________________________
//
declare module 'styled-components' {
  interface DefaultTheme extends AppTheme {}
}

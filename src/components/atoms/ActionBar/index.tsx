import styled, { css } from 'styled-components';
import { space, layout, SpaceProps, LayoutProps } from 'styled-system';

type ActionBarPosition = 'bottom' | 'top';
type ActionBarProps = SpaceProps & LayoutProps & { position?: ActionBarPosition; isAnimated?: boolean };

const ActionBar = styled.div<ActionBarProps>`
  background: #ffffff;
  box-shadow: 0px -6px 12px rgba(0, 0, 0, 0.14);
  position: fixed;
  width: 100%;
  box-sizing: border-box;
  ${({ isAnimated, position }) => {
    if (isAnimated && position === 'bottom') {
      return css`
        animation: slide-top 0.5s ease-out both;
        @keyframes slide-top {
          0% {
            transform: translateY(100%);
          }
          100% {
            transform: translateY(0%);
          }
        }
      `;
    } else if (isAnimated && position === 'top') {
      return css`
        animation: slide-bottom 0.5s ease-out both;
        @keyframes slide-bottom {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(0%);
          }
        }
      `;
    }
  }}
  ${({ position }) =>
    position === 'bottom'
      ? css`
          bottom: 0;
        `
      : css`
          top: 0;
        `}
  ${space}
  ${layout}
`;

ActionBar.defaultProps = {
  position: 'bottom',
  isAnimated: false,
};

export default ActionBar;

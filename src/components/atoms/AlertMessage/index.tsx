import styled from 'styled-components';
import { variant, typography, color, space, border, ColorProps, TypographyProps, SpaceProps, BorderProps } from 'styled-system';

export type AlertMessageVariant = 'info' | 'success' | 'error' | 'warning';

export interface AlertMessageProps extends ColorProps, TypographyProps, SpaceProps, BorderProps {
  variant?: AlertMessageVariant;
}

export const AlertMessage = styled.div<AlertMessageProps>`
  ${color}
  ${typography}
  ${space}
  ${variant({
    variants: {
      success: {
        backgroundColor: 'success',
        color: 'white',
        borderRadius: '6px',
      },
      error: {
        backgroundColor: 'danger',
        color: 'white',
        borderRadius: '6px',
      },
      warning: {
        backgroundColor: 'warning',
        color: 'white',
        borderRadius: '6px',
      },
      info: {
        backgroundColor: 'info',
        color: 'darkGrey',
      },
    },
  })}
  ${border}
`;

AlertMessage.defaultProps = {
  variant: 'success',
  lineHeight: 2,
  fontSize: 2,
  p: 3,
};

export const MessageTitle = styled.h4<ColorProps>`
  ${color}
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.space[3]};
  font-size: 26px;
  line-height: ${({ theme }) => theme.lineHeights[2]};
  display: flex;
  align-items: center;
`;

MessageTitle.defaultProps = {
  color: 'white',
};

export default AlertMessage;

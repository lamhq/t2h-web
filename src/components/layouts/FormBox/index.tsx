import styled from 'styled-components';
import { color, space, ColorProps, SpaceProps } from 'styled-system';
import { theme } from '@components/global/theme';

const FormBoxStyles = `
  border-radius: 6px;
`;

type FormBoxProps = SpaceProps & ColorProps;

export const FormBox = styled.div<FormBoxProps>`
  ${color};
  ${space};
  ${FormBoxStyles};
`;

FormBox.defaultProps = {
  backgroundColor: theme.colors.boxBackgroundColor,
  px: { _: 2, md: 4 },
  py: { _: 3, md: 5 },
};

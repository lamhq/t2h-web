import styled from 'styled-components';
import { color, space, typography, ColorProps, SpaceProps, TypographyProps } from 'styled-system';

export type TitleProps = ColorProps & SpaceProps & TypographyProps;

export const Title = styled.h1<TitleProps>`
  ${color}
  ${space}
  ${typography}
`;

Title.defaultProps = {
  color: 'text',
  fontFamily: 'primary',
  fontSize: { _: 6, md: 7 },
  letterSpacing: { _: 4, md: 4 },
  lineHeight: { _: 5, md: 6 },
  textAlign: 'center',
  fontWeight: 'bold',
};

export const SubTitle = styled.h2<TitleProps>`
  ${color}
  ${space}
  ${typography}
`;

SubTitle.defaultProps = {
  color: 'text',
  fontFamily: 'primary',
  fontSize: { _: 5, md: 6 },
  letterSpacing: { _: 3, md: 3 },
  lineHeight: { _: 4, md: 5 },
  textAlign: 'center',
  fontWeight: 'bold',
  mt: 3,
  mb: 3,
};

export const SectionTitle = styled.h2<TitleProps>`
  ${color}
  ${space}
  ${typography}
`;

SectionTitle.defaultProps = {
  color: 'text',
  fontFamily: 'primary',
  fontSize: { _: 4, md: 5 },
  letterSpacing: { _: 2, md: 2 },
  lineHeight: { _: 3, md: 4 },
  textAlign: 'center',
  fontWeight: 'bold',
  mt: 2,
  mb: 2,
};

export const OuterTitle = styled.h1<TitleProps>`
  ${color}
  ${space}
  ${typography}
  margin: 0;
`;

OuterTitle.defaultProps = {
  color: 'text',
  fontFamily: 'primary',
  fontSize: { _: 5, md: 6 },
  letterSpacing: { _: 4, md: 4 },
  lineHeight: { _: 4, md: 5 },
  textAlign: 'left',
  fontWeight: 'bold',
  py: { _: 3, md: 4 },
  px: { _: 3, md: 4 },
};

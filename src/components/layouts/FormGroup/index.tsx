import styled from 'styled-components';
import { space, layout, LayoutProps, SpaceProps } from 'styled-system';

type FormControlProps = LayoutProps & SpaceProps;

export const FormControl = styled.div<FormControlProps>`
  ${space}
  ${layout}

  &:first-child {
    margin-top: 0px;
  }

  &:last-child {
    margin-bottom: 0px;
  }
`;

FormControl.defaultProps = {
  mt: 0,
  mb: 2,
  width: '100%',
};

type FormGroupProps = LayoutProps & SpaceProps;

export const FormGroup = styled.div<FormGroupProps>`
  ${space}
  ${layout}

  &:first-child {
    margin: 0px;
  }
`;

FormGroup.defaultProps = {
  mt: { _: 4, md: '40px' },
  width: '100%',
};

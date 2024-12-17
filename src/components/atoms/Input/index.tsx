import styled, { css } from 'styled-components';
import { padding, PaddingProps } from 'styled-system';

const Input = styled.input<{ hasError: boolean; hasBorder?: boolean; ref: any } & PaddingProps>`
  color: ${({ theme }) => theme.colors.inputText};
  ${({ theme, hasBorder, hasError }) => {
    if (hasBorder) {
      return css`
        border: 1px solid ${hasError ? theme.colors.danger : theme.colors.border};
        border-radius: 5px;
      `;
    } else {
      return css`
        border: none;
      `;
    }
  }}
  box-sizing: border-box;
  outline: none;
  width: 100%;
  height: 38px;
  font-size: 14px;
  line-height: 19px;
  ${padding}

  &::placeholder {
    color: ${({ theme }) => theme.colors.placeholder};
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type='number'] {
    -moz-appearance: textfield;
  }
`;

Input.defaultProps = {
  paddingLeft: '9px',
  paddingTop: '11px',
  paddingBottom: '12px',
  paddingRight: '12px',
  hasBorder: true,
};

export default Input;

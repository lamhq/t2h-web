import styled from 'styled-components';

const InputHelperText = styled.p<{ hasError: boolean }>`
  color: ${({ theme, hasError }) => (hasError ? theme.colors.danger : theme.colors.border)};
  font-size: 12px;
  line-height: 17px;
  padding: 4px 12px 0px 12px;
  margin: 0px;
`;

export default InputHelperText;

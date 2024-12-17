import styled from 'styled-components';

const InputLabel = styled.label`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 4px;
  display: block;
`;

export default InputLabel;

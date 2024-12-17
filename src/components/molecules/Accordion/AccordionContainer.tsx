import styled from 'styled-components';

const AccordionContainer = styled.div`
  padding: ${({ theme }) => theme.space[3]};
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.space[3]};
`;

export default AccordionContainer;

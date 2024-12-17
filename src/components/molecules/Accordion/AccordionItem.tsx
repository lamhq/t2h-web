import * as React from 'react';
import styled, { css } from 'styled-components';

interface AccordionItemProps extends React.HTMLAttributes<HTMLElement> {}

const ItemElement = styled.li`
  display: flex;
  align-items: center;
  position: relative;
  ${({ theme }) => {
    return css`
      color: ${theme.colors.text};
      font-size: ${theme.fontSizes[2]};
      letter-spacing: ${theme.letterSpacings[2]};
      line-height: ${theme.lineHeights[2]};
      font-family: ${theme.fonts.secondary};
    `;
  }}
  margin-bottom: ${({ theme }) => theme.space[3]};

  &:first-child {
    margin-top: ${({ theme }) => theme.space[3]};
  }

  &:last-child {
    margin-bottom: 0px;
  }
`;

const AccordionItem: React.FC<AccordionItemProps> = ({ children }: AccordionItemProps) => {
  return <ItemElement>{children}</ItemElement>;
};

export default AccordionItem;

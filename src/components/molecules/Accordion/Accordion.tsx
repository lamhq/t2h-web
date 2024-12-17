import * as React from 'react';
import styled, { css } from 'styled-components';
import { variant } from 'styled-system';
import { ExpandMoreIcon, ExpandLessIcon, ArrowDropDownIcon, ArrowDropUpIcon } from '@components/atoms/IconButton';
import Link from 'next/link';
import { theme } from '@components/global/theme';

type AccordionVariant = 'primary' | 'secondary';

interface AccordionProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  href?: string;
  variant?: AccordionVariant;
}

const variants = {
  primary: {
    color: theme.colors.text,
  },
  secondary: {
    color: '#ffffff',
  },
};

const AccordionWrapper = styled.div``;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  touch-action: manipulation;
`;

const Title = styled.span<{ variant: AccordionVariant }>`
  ${variant({ variants })}
  ${({ theme }) =>
    css`
      font-size: ${theme.fontSizes[2]};
      letter-spacing: ${theme.letterSpacings[2]};
      line-height: ${theme.lineHeights[2]};
      font-family: ${theme.fonts.secondary};
    `};
  font-weight: 700;
`;

const IconContainer = styled.div`
  margin-left: auto;
  margin-right: 6px;
`;

const ItemList = styled.ul<{ isOpen: boolean }>`
  list-style: none;
  margin: 0;
  padding: 0;

  ${({ isOpen }) => {
    if (!isOpen) {
      return css`
        height: 0;
        opacity: 0;
        display: none;
      `;
    }

    return css`
      height: auto;
      opacity: 1;
      display: block;
    `;
  }};
`;

const Accordion: React.FC<AccordionProps> = ({ children, title, href, variant = 'primary' }: AccordionProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onTitleClick = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!href) e.preventDefault();

      setIsOpen((isOpen) => !isOpen);
    },
    [href],
  );
  let expandIcon = <ExpandMoreIcon />;
  let collapseIcon = <ExpandLessIcon />;

  if (variant === 'secondary') {
    expandIcon = <ArrowDropDownIcon color="white" />;
    collapseIcon = <ArrowDropUpIcon color="white" />;
  }

  console.assert(!(href && children), 'href and children MUST not be specified at the same time.');

  const renderAccordion = () => {
    return (
      <AccordionWrapper>
        <TitleContainer onClick={onTitleClick}>
          <Title variant={variant}>{title}</Title>
          {children && <IconContainer>{isOpen ? collapseIcon : expandIcon}</IconContainer>}
        </TitleContainer>
        <ItemList isOpen={isOpen}>{children}</ItemList>
      </AccordionWrapper>
    );
  };

  if (href) {
    return (
      <Link href={href}>
        <a>{renderAccordion()}</a>
      </Link>
    );
  } else {
    return renderAccordion();
  }
};

export default Accordion;

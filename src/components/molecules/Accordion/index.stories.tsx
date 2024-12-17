import React from 'react';
import styled from 'styled-components';
import { TextLabel } from '@components/atoms/Text';
import { Accordion, AccordionItem, AccordionContainer } from './';

export default { title: 'Molecules|Accordion' };

const MyAccordionContainer = styled(AccordionContainer)`
  width: 288px;
`;

export const Standard = () => (
  <MyAccordionContainer>
    <Accordion title="SHOP">
      <AccordionItem>
        <TextLabel>Categories</TextLabel>
      </AccordionItem>
      <AccordionItem>
        <TextLabel>Brands</TextLabel>
      </AccordionItem>
      <AccordionItem>
        <TextLabel>Deals</TextLabel>
      </AccordionItem>
    </Accordion>
    <Accordion title="TRUCK2HAND">
      <AccordionItem>
        <TextLabel>About us</TextLabel>
      </AccordionItem>
      <AccordionItem>
        <TextLabel>Careers</TextLabel>
      </AccordionItem>
      <AccordionItem>
        <TextLabel>Blog</TextLabel>
      </AccordionItem>
      <AccordionItem>
        <TextLabel>Contact us</TextLabel>
      </AccordionItem>
    </Accordion>
    <Accordion title="Support">
      <AccordionItem>
        <TextLabel>Help Center(FAQ)</TextLabel>
      </AccordionItem>
      <AccordionItem>
        <TextLabel>Become A seller</TextLabel>
      </AccordionItem>
    </Accordion>
  </MyAccordionContainer>
);

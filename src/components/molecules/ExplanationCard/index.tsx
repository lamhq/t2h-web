import * as React from 'react';
import styled from 'styled-components';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import { Text } from '@components/atoms/Text';
import { CheckCircleIcon } from '@components/atoms/IconButton';

interface ExplanationCardProps {
  icon: JSX.Element;
  title: string;
  items: string[];
}

const ItemListContainer = styled.ul`
  list-style: none;
  margin: 9px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const ItemContainer = styled.li`
  display: inline-flex;
  align-items: center;
  &:not(:first-child) {
    margin-top: ${({ theme }) => theme.space[2]};
  }
`;

interface ItemProps {
  text: string;
}

const Item: React.FC<ItemProps> = ({ text }: ItemProps) => (
  <ItemContainer>
    <CheckCircleIcon size="18px" color="label" />
    <Box ml={2} width={180}>
      <Text mt={0} mb={0} variant="medium" color="menuText" fontFamily="secondary">
        {text}
      </Text>
    </Box>
  </ItemContainer>
);

const ExplanationCard: React.FC<any> = (props: ExplanationCardProps) => {
  const { icon, title, items } = props;

  return (
    <Flex flexDirection={{ _: 'column', md: 'row' }} alignItems="center" justifyContent="center">
      <Flex justifyContent="center">{icon}</Flex>
      <Box mt={{ _: 2, md: 'auto' }} mb={{ _: 0, md: 'auto' }} ml={{ _: 0, md: '50px' }} width={{ _: 'auto', md: '280px' }}>
        <Text
          mt={0}
          mb={0}
          textAlign={{ _: 'center', md: 'left' }}
          fontSize={{ _: '19px', md: 5 }}
          lineHeight={{ _: '23px', md: '31px' }}
          letterSpacing={{ _: 2, md: '0.1px' }}
          color="primary"
          fontWeight="bold"
        >
          {title}
        </Text>
        <ItemListContainer>
          {items.map((text, index) => (
            <Item key={index} text={text} />
          ))}
        </ItemListContainer>
      </Box>
    </Flex>
  );
};

export default ExplanationCard;

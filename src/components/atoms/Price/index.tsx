import React from 'react';
import styled from 'styled-components';
import { Title } from '@components/atoms/Title';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Flex';

const PriceContainer = styled(Flex)`
  border: 2px solid #ff3c35;
  border-radius: 6px;
  min-height: 54px;
`;

interface PriceProps {
  title: string;
  price: string;
}

const Price: React.FC<PriceProps> = (props: PriceProps) => {
  const { title, price } = props;

  return (
    <PriceContainer alignItems="center">
      <Box ml={2}>
        <Title fontSize="19px" lineHeight="23px" color="#ff3c55">{`${title}:`}</Title>
      </Box>
      <Box ml="auto" mr={2}>
        <Title fontSize="19px" lineHeight="23px" color="#ff3c55">
          {price}
        </Title>
      </Box>
    </PriceContainer>
  );
};

export default Price;

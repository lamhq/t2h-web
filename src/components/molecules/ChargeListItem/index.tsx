import React from 'react';
import styled from 'styled-components';
import Flex from '@components/layouts/Flex';
import { TextLabel } from '@components/atoms/Text';
import Box from '@components/layouts/Box';
import { theme } from '@components/global/theme';

interface ChargeListItemProps {
  cost: string;
  description: string;
  title: string;
}

const Content = styled.div`
  flex-grow: 1;
  padding-left: 5px;
`;

const Title = styled.h3`
  line-height: 22px;
  font-size: 12px;
  color: #989898;
  margin: 0;
`;

const Description = styled.div`
  font-size: 16px;
  color: #333333;
`;

// TODO: Refine component
const ChargeListItem: React.FC<ChargeListItemProps> = (props: ChargeListItemProps) => {
  const { cost, title, description } = props;

  return (
    <Box p={2} borderBottom={`solid 1px ${theme.colors.border}`}>
      <Flex alignItems="center" justifyContent="space-between">
        <Content>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </Content>
        <TextLabel>{cost}</TextLabel>
      </Flex>
    </Box>
  );
};

export default ChargeListItem;

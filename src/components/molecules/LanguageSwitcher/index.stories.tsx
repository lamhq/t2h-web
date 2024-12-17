import React from 'react';
import styled from 'styled-components';
import { Text } from '@components/atoms/Text';
import { MenuItem } from '@components/atoms/MenuItem';
import ItemDropdown from './index';

export default { title: 'Molecules|ItemDropdown' };

const Container = styled.div`
  margin: 16px;
`;

export const Normal = () => {
  return (
    <Container>
      <ItemDropdown>
        <MenuItem>
          <Text m={0} color="text">
            {`Edit listing`}
          </Text>
        </MenuItem>
        <MenuItem>
          <Text m={0} color="text">
            {`Boost listing`}
          </Text>
        </MenuItem>
        <MenuItem>
          <Text m={0} color="danger">
            {`Delete listing`}
          </Text>
        </MenuItem>
      </ItemDropdown>
    </Container>
  );
};

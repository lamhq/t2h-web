import * as React from 'react';
import styled from 'styled-components';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import { Title } from '@components/atoms/Title';
import { Text } from '@components/atoms/Text';

interface ListingDescriptionProps {
  title: string;
  description: string;
}

const StyledText = styled(Text)`
  &:not(:first-child) {
    margin-top: 22px;
    overflow-wrap: anywhere;
  }
  word-break: break-all;
`;

const ListingDescription: React.FC<ListingDescriptionProps> = (props: ListingDescriptionProps) => {
  const { title, description = '' } = props;

  return (
    <Flex flexDirection="column">
      <Box>
        <Title my={0} textAlign="left" color="darkGrey">
          {title}
        </Title>
      </Box>

      <Box mt={3}>
        {description.split('\n').map((d, i) => (
          <StyledText key={i} my={0} color="description" fontFamily="secondary">
            {d}
          </StyledText>
        ))}
      </Box>
    </Flex>
  );
};

export default ListingDescription;

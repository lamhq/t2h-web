import React from 'react';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import { Text } from '@components/atoms/Text';
import { LocationOnIcon } from '@components/atoms/IconButton';

interface LocationProps {
  location: string;
}

const Location = (props: LocationProps) => (
  <Flex>
    <Box mt="5px">
      <LocationOnIcon size="24px" color="label" />
    </Box>
    <Text my="auto" ml={2} color="description" fontFamily="secondary">
      {props.location}
    </Text>
  </Flex>
);

export default Location;

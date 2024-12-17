import * as React from 'react';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import { FiberManualRecordIcon, FiberManualRecordOutlinedIcon, IconButtonProps } from '@components/atoms/IconButton';

interface IndicatorProps {
  index: number;
  number: number;
  size?: string;
  color?: IconButtonProps['color'];
}

const Indicator = ({ index, number, size, color }: IndicatorProps) => {
  return (
    <Flex>
      {new Array(number).fill(null).map((_, i) => (
        <Box key={i} ml={i !== 0 ? 2 : 0}>
          {i === index ? <FiberManualRecordIcon size={size} color={color} /> : <FiberManualRecordOutlinedIcon size={size} color={color} />}
        </Box>
      ))}
    </Flex>
  );
};

Indicator.defaultProps = {
  size: '12px',
  color: 'white',
};

export default Indicator;

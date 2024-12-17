import React from 'react';
import Box from '@components/layouts/Box';
import { ImageData } from '@components/molecules/InputImages';
import { GridSortableInputImages, FlexSortableInputImages } from './index';

export default { title: 'Organisms|SortableInputImages' };

export const Grid = () => {
  const [images, setImages] = React.useState<ImageData[]>([]);

  return (
    <Box m={4}>
      <GridSortableInputImages images={images} onChange={setImages} maximumNumber={6} />
    </Box>
  );
};

export const Flex = () => {
  const [images, setImages] = React.useState<ImageData[]>([]);

  return (
    <Box m={4}>
      <FlexSortableInputImages images={images} onChange={setImages} maximumNumber={6} />
    </Box>
  );
};

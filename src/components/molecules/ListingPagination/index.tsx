import React from 'react';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import { Text } from '@components/atoms/Text';
import { ChevronLeftIcon, ChevronRightIcon } from '@components/atoms/IconButton';

interface ListingPaginationProps {
  leftText: string;
  startIndex: number;
  lastIndex: number;
  totalNumber: number;
  onPreviousClick: React.MouseEventHandler;
  onNextClick: React.MouseEventHandler;
}

const ListingPagination = (props: ListingPaginationProps) => {
  const { leftText, startIndex, lastIndex, totalNumber, onPreviousClick, onNextClick } = props;

  const canClickPrevious = !!onPreviousClick && startIndex > 1;
  const canClickNext = !!onNextClick && lastIndex < totalNumber;

  return (
    <Flex alignItems="center">
      <Text mt={0} mb={0} ml={0} variant="small" color="menuText" fontFamily="secondary">
        {leftText}
      </Text>
      <Text ml="auto" mt={0} mb={0} variant="small" color="menuText" fontFamily="secondary">
        {`${startIndex}-${lastIndex} of ${totalNumber}`}
      </Text>
      <Box ml={0}>
        <ChevronLeftIcon onClick={canClickPrevious ? onPreviousClick : undefined} color={canClickPrevious ? 'primary' : 'lightGrey'} />
      </Box>
      <Box mr={0}>
        <ChevronRightIcon onClick={canClickNext ? onNextClick : undefined} color={canClickNext ? 'primary' : 'lightGrey'} />
      </Box>
    </Flex>
  );
};

export default ListingPagination;

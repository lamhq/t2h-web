import React from 'react';
import styled from 'styled-components';
import ListingPagination from './index';

export default { title: 'Molecules|ListingPagination' };

const Contaienr = styled.div`
  width: 288px;
  padding: 22px;
`;

export const Normal = () => {
  const totalNumber = 105;
  const step = 10;
  const [startIndex, setStartIndex] = React.useState(1);
  const [lastIndex, setLastIndex] = React.useState(startIndex + step - 1);

  const onPreviousClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const newStartIndex = Math.max(1, startIndex - step);
      const newLastIndex = Math.min(totalNumber, newStartIndex + step);

      setStartIndex(newStartIndex);
      setLastIndex(newLastIndex);
    },
    [startIndex, setStartIndex, setLastIndex],
  );
  const onNextClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setStartIndex((startIndex) => Math.min(totalNumber, startIndex + step));
      setLastIndex((lastIndex) => Math.min(totalNumber, lastIndex + step));
    },
    [setStartIndex, setLastIndex],
  );

  return (
    <Contaienr>
      <ListingPagination
        leftText={`${step} listings`}
        startIndex={startIndex}
        lastIndex={lastIndex}
        totalNumber={totalNumber}
        onPreviousClick={onPreviousClick}
        onNextClick={onNextClick}
      />
    </Contaienr>
  );
};

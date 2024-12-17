import * as React from 'react';
import styled from 'styled-components';

interface PairItemProps {
  left: string;
  right: string;
}

const PairItemInner = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const LeftCell = styled.div`
  line-height: 38px;
  color: ${({ theme }) => theme.colors.inputText};
`;

const RightCell = styled.div`
  line-height: 38px;
  color: ${({ theme }) => theme.colors.primary};
`;

const PairItem: React.FC<PairItemProps> = ({ left, right }: PairItemProps) => {
  return (
    <PairItemInner>
      <LeftCell>{left}</LeftCell>
      <RightCell>{right}</RightCell>
    </PairItemInner>
  );
};

export default PairItem;

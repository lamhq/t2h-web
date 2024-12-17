import React from 'react';
import styled from 'styled-components';
import { CheckCircleIcon } from '@components/atoms/IconButton';
import Alert from './index';

export default { title: 'Molecules|Alert' };

const Container = styled.div`
  width: 266px;
  height: 496px;
  padding: 16px;
  box-sizing: border-box;
`;

export const Standard = () => {
  return (
    <Container>
      <Alert
        icon={<CheckCircleIcon size="120px" color="success" />}
        title="You've edited your listing."
        descriptions={[`Your changes will go live shortly, this may take a few minutes.`]}
      />
    </Container>
  );
};

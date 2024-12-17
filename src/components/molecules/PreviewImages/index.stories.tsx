import React from 'react';
import { action } from '@storybook/addon-actions';
import styled from 'styled-components';
import PreviewImages from './index';

export default { title: 'Molecules|PreviewImages' };

const Container = styled.div`
  width: 332px;
  margin: 20px;
`;

export const Normal = () => {
  return (
    <Container>
      <PreviewImages
        srcs={[
          '/static/images/1.jpg',
          '/static/images/2.jpg',
          '/static/images/3.jpg',
          '/static/images/4.jpg',
          '/static/images/5.jpg',
          '/static/images/6.jpg',
          '/static/images/1.jpg',
        ]}
        onSelect={action('onSelect')}
      />
    </Container>
  );
};

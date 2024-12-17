import React from 'react';
import styled from 'styled-components';
import Annotation from './index';

export default { title: 'Molecules|Annotation' };

const Page = styled.div`
  padding: 11px;
  width: 320px;
`;

export const Standard = () => (
  <Page>
    <Annotation title="Please take a clear making sure to avoid blurry images and reflections.">
      <img src="/static/images/5.jpg" width="280px" />
    </Annotation>
    <Annotation title="Why do you need my identification?">Description</Annotation>
  </Page>
);

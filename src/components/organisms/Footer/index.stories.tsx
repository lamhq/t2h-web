import React from 'react';
import styled from 'styled-components';
import Footer from './index';

const Page = styled.div`
  width: 320px;
`;

export default { title: 'Organisms|Footer' };

export const Standard = () => (
  <Page>
    <Footer />
  </Page>
);

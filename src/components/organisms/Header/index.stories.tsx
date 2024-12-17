import React from 'react';
import styled from 'styled-components';
import Header from './index';

const Page = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
`;

export default { title: 'Organisms|Header' };

export const NotLogin = () => (
  <>
    <Header notifications={[]} />
    <Page>Sample Page</Page>
  </>
);

export const LoggedIn = () => (
  <>
    <Header
      user={{ profileImageUrl: '/static/images/1.jpg', isBuyer: true, firstName: 'Taketo', lastName: 'Yoshida' } as any}
      notifications={[]}
    />
    <Page>Sample Page</Page>
  </>
);

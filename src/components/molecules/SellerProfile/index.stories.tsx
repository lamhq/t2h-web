import React from 'react';
import styled from 'styled-components';
import SellerProfile from './';

export default { title: 'Molecules|SellerProfile' };

const Container = styled.div`
  margin: 20px;
  width: 288px;

  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
`;

export const Standard = () => (
  <Container>
    <SellerProfile
      iconSrc="/static/images/1.jpg"
      isVerified={true}
      name="The Truck company"
      numOfListing={42}
      linkForViewMore="/"
      description={`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do`}
      imagesSrc={['/static/images/1.jpg', '/static/images/2.jpg', '/static/images/3.jpg', '/static/images/4.jpg', '/static/images/5.jpg']}
      linkForLineButton="/"
      linkForFacebookButton="/"
    />
  </Container>
);

///

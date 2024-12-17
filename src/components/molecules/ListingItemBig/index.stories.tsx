import React from 'react';
import styled from 'styled-components';
import ListingItemBig from '.';

export default { title: 'Molecules|ListingItemBig' };

const Container = styled.div`
  padding: 20px;
  width: 500px;
`;

export const Standard = () => (
  <Container>
    <ListingItemBig
      imageUrl="/static/images/1.jpg"
      title="DAF FA LF55.220 Sleeper 28 Foot 2ins Curtain c/w Taillift"
      detail="Nice truck"
      tags={['2017', 'Manual', '8.5L']}
      price="470,000 THB"
    />
  </Container>
);

import React from 'react';
import styled from 'styled-components';
import { Facebook, Line } from '@components/atoms/IconButton/icons';
import { CancelIcon, AddCircleOutlineIcon } from '@components/atoms/IconButton/buttons';
import SocialLinkButton from './';

export default { title: 'Molecules|SocialLinkButton' };

const Container = styled.div`
  margin: 20px;
  width: 300px;

  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
`;

export const Standard = () => (
  <Container>
    <SocialLinkButton
      variant="facebook"
      leftIcon={<Facebook />}
      rightIcon={<CancelIcon color="white" size="20px" />}
      name="Facebook"
      text="Connected"
    />
    <SocialLinkButton
      variant="facebook_outlined"
      leftIcon={<Facebook />}
      rightIcon={<CancelIcon color="facebook" size="20px" />}
      name="Facebook"
      text="Connect Facebook account"
      textProps={{ color: 'facebook' }}
    />
    <SocialLinkButton
      variant="line"
      leftIcon={<Line />}
      rightIcon={<AddCircleOutlineIcon color="white" size="20px" />}
      name="Line"
      text="Connected"
    />
    <SocialLinkButton
      variant="line_outlined"
      leftIcon={<Line />}
      rightIcon={<AddCircleOutlineIcon color="line" size="20px" />}
      name="Line"
      text="Connect line account"
      textProps={{ color: 'line' }}
    />
  </Container>
);

///

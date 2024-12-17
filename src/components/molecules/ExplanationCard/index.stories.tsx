import React from 'react';
import styled from 'styled-components';
import ExplanationCard from './';

export default { title: 'Molecules|ExplanationCard' };

const Container = styled.div`
  width: 288px;
  display: grid;
  gap: 10px;
`;

interface ImgIconProps {
  width: string;
  height: string;
}

const ImgIcon = styled.img<ImgIconProps>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
`;

export const WithIndex = () => (
  <Container>
    <ExplanationCard
      icon={<ImgIcon src="/static/images/icon/identity-card.png" width="84px" height="48px" />}
      title="Identification"
      items={['Thai National ID', 'Picture of your ID Card', 'Selfie with your ID card']}
    />

    <ExplanationCard
      icon={<ImgIcon src="/static/images/icon/bank.png" width="69px" height="60px" />}
      title="Bank Details"
      items={['Bank account number', 'Picture of Book Bank']}
    />
  </Container>
);

export const WithoutIndex = () => (
  <Container>
    <ExplanationCard
      icon={<ImgIcon src="/static/images/icon/identity-card.png" width="84px" height="48px" />}
      title="Identification"
      items={['Thai National ID', 'Picture of your ID Card', 'Selfie with your ID card']}
    />

    <ExplanationCard
      icon={<ImgIcon src="/static/images/icon/bank.png" width="69px" height="60px" />}
      title="Bank Details"
      items={['Bank account number', 'Picture of Book Bank']}
    />
  </Container>
);

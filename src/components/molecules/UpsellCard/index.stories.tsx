import React from 'react';
import styled from 'styled-components';
import UpsellCard from './index';

export default { title: 'Molecules|UpsellCard' };

const Container = styled.div`
  width: 320px;
`;

export const Standard = () => (
  <Container>
    <UpsellCard
      imageUrl="https://picsum.photos/171/90"
      title={'Buyer'}
      descriptionItems={[
        'View all community listings',
        'Directly contact sellers & ask product related questions',
        'Buy directly from seller without complicated system',
      ]}
      buttonLink={''}
      buttonText={`Current package`}
    />
    <UpsellCard
      imageUrl="https://picsum.photos/171/90"
      title={'Seller'}
      descriptionItems={[
        'Everything in Buyer',
        <span key={1}>
          Create exclusive listings on <strong>Truck2Hand</strong>
        </span>,
        'Boost your listings to the top of results',
      ]}
      buttonLink={''}
      buttonText={`Upgrade`}
      variant="success"
    />
    <UpsellCard
      imageUrl="https://picsum.photos/171/90"
      title={'Pro'}
      subTitle="1,500 THB /year"
      descriptionItems={[
        <span key={0}>
          Everything in <strong>Seller basic</strong>
        </span>,
        'Boost your listings',
        'Automatic social sharing',
      ]}
      buttonLink={'hoge'}
      buttonText="Upgrade"
      variant="success"
    />
    <UpsellCard
      imageUrl="/static/images/silver-pkg.svg"
      title={'Silver'}
      subTitle="3,000 THB /year"
      descriptionItems={[
        <span key={0}>
          Everything in <strong>Pro</strong>
        </span>,
        'Recommended status',
        'Performance tracking',
      ]}
      buttonLink={'hoge'}
      buttonText="Upgrade"
      variant="success"
    />
    <UpsellCard
      imageUrl="/static/images/gold-pkg.svg"
      title={'Gold'}
      subTitle="6,000 THB /year"
      descriptionItems={[
        <span key={0}>
          Everything in <strong>Silver</strong>
        </span>,
        'VIP priority listing exposure',
        'Custom store',
      ]}
      buttonLink={'hoge'}
      buttonText="Upgrade"
      variant="success"
    />
    <UpsellCard
      imageUrl="https://picsum.photos/171/90"
      title={'Premium'}
      subTitle="12,000 THB /year"
      descriptionItems={[
        <span key={0}>
          Everything in <strong>Gold</strong>
        </span>,
        'Ad-free shopping experience',
        'First to receive features',
      ]}
      buttonLink={'hoge'}
      buttonText="Upgrade"
      variant="success"
    />
  </Container>
);

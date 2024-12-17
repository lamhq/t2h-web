import React from 'react';
import styled from 'styled-components';
import PairItem from './index';

export default { title: 'Atoms|PairItem' };

const PairList = styled.div`
  padding: 10px;
`;

export const Standard = () => (
  <React.Fragment>
    <PairList>
      <h2>Details</h2>
      <PairItem left="Brand" right="Kubota" />
      <PairItem left="Model" right="M 6040" />
      <PairItem left="Production Year" right="2014" />
      <PairItem left="Mileage" right="41,750 KM" />
      <PairItem left="Transmission" right="Planetary-Gear" />
    </PairList>
  </React.Fragment>
);

import React from 'react';
import styled from 'styled-components';
import CoinMenuItem from './index';

export default { title: 'Molecules|CoinMenuItem' };

const MenuList = styled.div`
  margin: 20px;
  width: 288px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
`;

export const Standard = () => (
  <React.Fragment>
    <MenuList>
      <CoinMenuItem amount="25 coins" description="1 boost" price="100 THB" />
      <CoinMenuItem amount="50 coins" description="2 boosts" price="200 THB" />
      <CoinMenuItem amount="100 coins" description="4 boosts" price="400 THB" />
      <CoinMenuItem amount="200 coins" description="32 boosts +24h no ads!" price="800 THB" />
      <CoinMenuItem amount="400 coins" description="75 boosts + 3 days VIP!" price="1,600 THB" label="Most popular!" />
      <CoinMenuItem amount="800 coins" description="135 boosts + 7 days VIP!" price="3,200 THB" />
    </MenuList>
  </React.Fragment>
);

import React from 'react';
import styled from 'styled-components';
import { MonetizationOnIcon, RocketIcon } from '@components/atoms/IconButton';
import CoinHistoryListItem from './index';

export default { title: 'Molecules|CoinHistoryListItem' };

const Page = styled.div`
  width: 320px;
  padding: 16px;
`;

export const Standard = () => (
  <Page>
    <CoinHistoryListItem
      icon={<MonetizationOnIcon color="boost" size="16px" />}
      title="Purchased - 16:24"
      description="25 coins"
      cost="100 THB"
    />
    <CoinHistoryListItem
      icon={<RocketIcon color="boost" size="16px" />}
      title="Boosted - 16:24"
      description="ขาย รถขุด KOMATSU รุ่น PC20-6- มือสองญี่ปุ่น"
      cost="25 coins"
    />
    <CoinHistoryListItem
      icon={<MonetizationOnIcon color="boost" size="16px" />}
      title="Purchased - 16:24"
      description="25 coins"
      cost="100 THB"
    />
  </Page>
);

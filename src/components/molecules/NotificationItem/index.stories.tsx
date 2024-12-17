import React from 'react';
import styled from 'styled-components';
import { Text } from '@components/atoms/Text';
import NotificationItem from './index';

export default { title: 'Molecules|NotificationItem' };

const Page = styled.div`
  padding: 11px;
  width: 320px;
`;

export const Standard = () => (
  <Page>
    <NotificationItem title="Price drop on item!" time="18:30">
      <Text>ISUZU Six Big Wheel 240 FTR Length 760 Good engine, Ready to use…</Text>
    </NotificationItem>
    <NotificationItem title="Your item was boosted" time="18:30">
      <Text>Ford truck for quick sale</Text>
    </NotificationItem>
    <NotificationItem title="Seller application approved!" time="22:00" variant="success">
      <Text>Go to Memberships</Text>
    </NotificationItem>
    <NotificationItem title="Message with no content" time="22:00" />
  </Page>
);

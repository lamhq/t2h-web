import React from 'react';
import styled from 'styled-components';
import NotificationList from './index';

export default { title: 'Molecules|NotificationList' };

const notifications = [
  {
    isRead: true,
    type: 'approve_membership_application',
    content: 'Membership Application has been approved',
    createdAt: '2020-07-22T19:24:55.107Z',
    seenAt: '2020-07-23T03:24:55.000Z',
    hashId: 'YByNOqR9Xd',
    receiverHashId: 'bzvnKGnxQ9',
    senderHashId: '8l0R98W1vo',
  },
  {
    isRead: false,
    type: 'membership_application',
    content: 'Membership Application has been submitted',
    createdAt: '2020-07-21T19:24:55.107Z',
    hashId: 'mpPV6zVrO1',
    receiverHashId: 'bzvnKGnxQ9',
    senderHashId: '8l0R98W1vo',
  },
  {
    isRead: true,
    type: 'reject_membership_application',
    content: 'Membership Application has been rejected',
    createdAt: '2020-07-21T19:24:55.107Z',
    seenAt: '2020-07-23T03:24:55.000Z',
    hashId: 'gmZRjMVnl4',
    receiverHashId: 'bzvnKGnxQ9',
    senderHashId: '8l0R98W1vo',
  },
  {
    isRead: true,
    type: 'approve_seller_application',
    content: 'Seller Application has been approved',
    createdAt: '2020-07-20T19:24:55.107Z',
    seenAt: '2020-07-23T03:24:55.000Z',
    hashId: '60kRJGLMJp',
    receiverHashId: 'bzvnKGnxQ9',
    senderHashId: '8l0R98W1vo',
  },
  {
    isRead: false,
    type: 'other',
    content: 'Other notification',
    createdAt: '2020-07-20T19:24:55.107Z',
    hashId: 'mG3N2MLBZb',
    receiverHashId: 'bzvnKGnxQ9',
    senderHashId: '8l0R98W1vo',
  },
  {
    isRead: false,
    type: 'reject_seller_application',
    content: 'Seller Application has been rejected',
    createdAt: '2020-07-19T19:24:55.107Z',
    hashId: '2MERAdV9G6',
    receiverHashId: 'bzvnKGnxQ9',
    senderHashId: '8l0R98W1vo',
  },
  {
    isRead: false,
    type: 'submit_seller_application',
    content: 'Seller Application has been submitted',
    createdAt: '2020-07-18T19:24:55.107Z',
    hashId: '9zwLlENn5M',
    receiverHashId: 'bzvnKGnxQ9',
    senderHashId: '8l0R98W1vo',
  },
  {
    isRead: false,
    type: 'item_price_change',
    content: 'Item price is changed',
    createdAt: '2020-07-17T19:24:55.107Z',
    hashId: 'g6EL5GVk3Z',
    receiverHashId: 'bzvnKGnxQ9',
    senderHashId: '8l0R98W1vo',
  },
];

const Page = styled.div`
  padding: 11px;
  width: 320px;
`;

export const Standard = () => (
  <Page>
    <NotificationList notifications={notifications as any} />
  </Page>
);

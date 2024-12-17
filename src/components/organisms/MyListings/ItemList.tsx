import React from 'react';
import Link from 'next/link';
import { TFunction } from 'next-i18next';
import styled from 'styled-components';
import { border, BorderProps } from 'styled-system';
import Flex from '@components/layouts/Flex';
import { ItemResponse, ItemStatus } from '@services/types';
import ListingItem from '@components/molecules/ListingItem';
import { Text } from '@components/atoms/Text';
import ItemMenus from './ItemMenus';

const ItemListContainer = styled(Flex)`
  & > *:not(:first-child) {
    margin-top: ${({ theme }) => theme.space[3]};
  }
`;

interface ItemListProps {
  t: TFunction;
  items: ItemResponse[];
  onItemDeleteClick: (item: ItemResponse) => void;
  isItemStatusVisible?: boolean;
}

const getStatusTextAndColor = (status: ItemStatus): { text: string; color: string } => {
  switch (status) {
    case ItemStatus.Pending:
      return { text: 'In Review', color: 'menuText' };
    case ItemStatus.Submitted:
      return { text: 'In Review', color: 'menuText' };
    case ItemStatus.Rejected:
      return { text: 'Rejected', color: 'danger' };
    default:
      return null;
  }
};

const Badge = styled.div<BorderProps>`
  min-width: 70px;
  border-radius: 25px;
  border-width: 1px;
  border-style: solid;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  ${border}
`;

const Status = ({ t, status }: { t: TFunction; status: ItemStatus }) => {
  if ([ItemStatus.Pending, ItemStatus.Submitted, ItemStatus.Rejected].indexOf(status) === -1) {
    return null;
  }

  const { text, color } = getStatusTextAndColor(status);

  return (
    <Badge borderColor={color}>
      <Text mt={0} mb={0} variant="small" color={color}>
        {t(text)}
      </Text>
    </Badge>
  );
};

const ItemList = (props: ItemListProps) => {
  const { t, items, onItemDeleteClick, isItemStatusVisible } = props;

  return (
    <ItemListContainer width="100%" flexDirection="column">
      {items.map((item, index) => {
        const imageUrl = item.imageUrl;
        const title = item.title;
        const year = item.productionYear;
        const price = item.sellingPrice ? Number.parseInt(`${item.sellingPrice}`).toLocaleString() : '';

        return (
          <Link key={index} href={`/listing/${item.hashId}`}>
            <ListingItem
              imageUrl={imageUrl}
              title={title}
              tags={[`${year}`, item.transmission]}
              price={`${price} THB`}
              hasBorder={true}
              rightTopElement={<ItemMenus t={t} item={item} onDeleteClick={onItemDeleteClick} />}
              rightBottomElement={isItemStatusVisible ? <Status t={t} status={item.status} /> : null}
            />
          </Link>
        );
      })}
    </ItemListContainer>
  );
};

export default ItemList;

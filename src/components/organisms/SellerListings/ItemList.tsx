import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Flex from '@components/layouts/Flex';
import { ItemResponse, ItemStatus, FavoriteResponse } from '@services/types';
import ListingItem from '@components/molecules/ListingItem';
import { GreenCheckIcon, FavoriteIcon, FavoriteBorderIcon } from '@components/atoms/IconButton';

const ItemListContainer = styled(Flex)`
  & > *:not(:first-child) {
    margin-top: ${({ theme }) => theme.space[3]};
  }
`;

interface FavoriteProps {
  isFavorite: boolean;
  onClick: React.MouseEventHandler;
}

const Favorite = ({ isFavorite, onClick }: FavoriteProps) =>
  isFavorite ? <FavoriteIcon size="18px" color="red" onClick={onClick} /> : <FavoriteBorderIcon size="18px" onClick={onClick} />;

interface ItemListProps {
  items: ItemResponse[];
  itemHashIdToFavorite: { [key: string]: FavoriteResponse };
  onFavoriteIconClick: (e: React.MouseEvent, index: number, item: ItemResponse) => void;
}

const ItemList = (props: ItemListProps) => {
  const { items, itemHashIdToFavorite, onFavoriteIconClick } = props;

  return (
    <ItemListContainer width="100%" flexDirection="column">
      {items.map((item, index) => {
        const imageUrl = item.imageUrl;
        const title = item.title;
        const year = item.productionYear;
        const price = item.sellingPrice ? item.sellingPrice.toLocaleString() : '';
        const isFavorite = !!itemHashIdToFavorite[item.hashId];

        return (
          <Link key={index} href={`/listing/${item.hashId}`}>
            <ListingItem
              imageUrl={imageUrl}
              title={title}
              tags={[`${year}`, item.transmission]}
              price={`${price} THB`}
              hasBorder={true}
              leftTopElement={item.status === ItemStatus.Published ? <GreenCheckIcon /> : null}
              rightBottomElement={<Favorite isFavorite={isFavorite} onClick={(e) => onFavoriteIconClick(e, index, item)} />}
            />
          </Link>
        );
      })}
    </ItemListContainer>
  );
};

export default ItemList;

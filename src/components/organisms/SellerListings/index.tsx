import React from 'react';
import { WithTranslation } from 'react-i18next';
import { withTranslation } from '@server/i18n';
import { ItemArrayResponse, ItemResponse, FavoriteResponse } from '@services/types';
import Box from '@components/layouts/Box';
import Flex from '@components/layouts/Flex';
import InputSearch from '@components/organisms/InputSearch';
import ListingPagination from '@components/molecules/ListingPagination';
import ItemList from './ItemList';

interface SellerListingsProps extends WithTranslation {
  items: ItemArrayResponse;
  numberOfItems: number;
  startIndex: number;
  lastIndex: number;
  viewSearchWord: string;
  itemHashIdToFavorite: { [key: string]: FavoriteResponse };

  onFavoriteIconClick: (e: React.MouseEvent, index: number, item: ItemResponse) => void;
  onPreviousClick: React.MouseEventHandler;
  onNextClick: React.MouseEventHandler;
  onSearchWordChange: React.ChangeEventHandler;
}

const SellerListings: React.FC<SellerListingsProps> = (props: SellerListingsProps) => {
  const {
    t,
    items,
    numberOfItems,
    startIndex,
    lastIndex,
    viewSearchWord,
    itemHashIdToFavorite,
    onFavoriteIconClick,
    onPreviousClick,
    onNextClick,
    onSearchWordChange,
  } = props;

  return (
    <Box>
      <Flex mx={3}>
        <InputSearch placeholder={t(`Search by Listing ID, brand, make`)} value={viewSearchWord} onChange={onSearchWordChange} />
      </Flex>
      <Flex my={3} mx={3}>
        <ItemList items={items} itemHashIdToFavorite={itemHashIdToFavorite} onFavoriteIconClick={onFavoriteIconClick} />
      </Flex>
      {/* todo: consider to add Infinite list for mobile */}
      <Box mx={3}>
        <ListingPagination
          leftText={`${numberOfItems} listings`}
          startIndex={startIndex}
          lastIndex={lastIndex}
          totalNumber={numberOfItems}
          onPreviousClick={onPreviousClick}
          onNextClick={onNextClick}
        />
      </Box>
    </Box>
  );
};

export default withTranslation('common')(SellerListings);

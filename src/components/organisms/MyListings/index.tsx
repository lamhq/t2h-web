import React from 'react';
import { WithTranslation } from 'react-i18next';
import { withTranslation } from '@server/i18n';
import { ItemResponse, ItemArrayResponse } from '@services/types';
import { TabType } from '@services/hooks/myListings';
import Box from '@components/layouts/Box';
import Flex from '@components/layouts/Flex';
import InputSearch from '@components/organisms/InputSearch';
import { Tabs, Tab } from '@components/molecules/Tab';
import ListingPagination from '@components/molecules/ListingPagination';
import ItemList from './ItemList';
import DeleteItemDialog from './DeleteItemDialog';

interface MyListingsProps extends WithTranslation {
  tab: TabType;
  items: ItemArrayResponse;
  numberOfItems: number;
  startIndex: number;
  lastIndex: number;
  viewSearchWord: string;
  isDeleteDialogOpen: boolean;
  dialogOffsetTop: number;

  onTabChange: (e: React.ChangeEvent, newTab: TabType) => void;
  onItemDeleteClick: (item: ItemResponse) => void;
  onPreviousClick: React.MouseEventHandler;
  onNextClick: React.MouseEventHandler;
  onSearchWordChange: React.ChangeEventHandler<HTMLInputElement>;
  onDeleteDialogClose: (e: React.SyntheticEvent) => void;
  onDeleteItemClick: React.MouseEventHandler;
}

const MyListings: React.FC<MyListingsProps> = (props: MyListingsProps) => {
  const {
    t,
    tab,
    items,
    numberOfItems,
    startIndex,
    lastIndex,
    viewSearchWord,
    isDeleteDialogOpen,
    dialogOffsetTop,
    onTabChange,
    onItemDeleteClick,
    onPreviousClick,
    onNextClick,
    onSearchWordChange,
    onDeleteDialogClose,
    onDeleteItemClick,
  } = props;

  return (
    <Box>
      <Flex mx={3}>
        <InputSearch placeholder={t(`Search by Listing ID, brand, make`)} value={viewSearchWord} onChange={onSearchWordChange} />
      </Flex>
      <Flex mt={2}>
        <Tabs value={tab} onChange={onTabChange}>
          <Tab label={t(`Active`)} />
          <Tab label={t(`Draft`)} />
          <Tab label={t(`History`)} />
        </Tabs>
      </Flex>
      <Flex my={3} mx={3}>
        <ItemList t={t} items={items} onItemDeleteClick={onItemDeleteClick} isItemStatusVisible={true} />
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
      <DeleteItemDialog
        t={t}
        isOpen={isDeleteDialogOpen}
        onClose={onDeleteDialogClose}
        onDeleteClick={onDeleteItemClick}
        offsetTop={dialogOffsetTop}
      />
    </Box>
  );
};

export default withTranslation('common')(MyListings);

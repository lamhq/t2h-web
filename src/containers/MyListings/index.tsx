import React from 'react';
import { WithTranslation } from 'react-i18next';
import { withTranslation } from '@server/i18n';
import { ItemStatus, ItemArrayResponse } from '@services/types';
import { ItemApi } from '@services/apis';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import { TabType, useMyListingsState } from '@services/hooks/myListings';
import MyListings from '@components/organisms/MyListings';

interface MyListingsContainerProps extends WithTranslation {
  itemApi: ReturnType<typeof ItemApi>;
  defaultActiveItems: ItemArrayResponse;
  defaultDraftItems: ItemArrayResponse;
  defaultHistoryItems: ItemArrayResponse;
  defaultNumberOfActiveItems: number;
  defaultNumberOfDraftItems: number;
  defaultNumberOfHistoryItems: number;
  numberOfItemsPerPage: number;
  intervalOfSearch: number;
}

const MyListingsContainer = (props: MyListingsContainerProps) => {
  const {
    t,
    itemApi,
    defaultActiveItems,
    defaultDraftItems,
    defaultHistoryItems,
    defaultNumberOfActiveItems,
    defaultNumberOfDraftItems,
    defaultNumberOfHistoryItems,
    numberOfItemsPerPage,
    intervalOfSearch,
  } = props;
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();

  const loadItems = React.useCallback(
    async (page: number, perPage: number, tab: TabType, searchWord?: string) => {
      let status: ItemStatus[] = [];

      switch (tab) {
        case TabType.Active:
          status = [ItemStatus.Published, ItemStatus.Submitted, ItemStatus.Pending];
          break;
        case TabType.Draft:
          status = [ItemStatus.Draft, ItemStatus.Rejected];
          break;
        case TabType.History:
          status = [ItemStatus.Sold];
          break;
        default:
          const invalidTab: never = tab;

          throw new Error(`${invalidTab} is not TabType`);
      }

      return itemApi.getMyItems({ page, perPage, status, q: searchWord });
    },
    [itemApi],
  );

  const myListingsState = useMyListingsState({
    loadItems,
    defaultActiveItems,
    defaultNumberOfActiveItems,
    defaultDraftItems,
    defaultNumberOfDraftItems,
    defaultHistoryItems,
    defaultNumberOfHistoryItems,
    numberOfItemsPerPage,
    intervalOfSearch,
  });

  const onPreviousClick = React.useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      try {
        await myListingsState.moveToPrevPage();
      } catch (error) {
        setGlobalSnackbar({ message: t(error.message), variant: 'error' });
      }
    },
    [t, setGlobalSnackbar, myListingsState],
  );
  const onNextClick = React.useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      try {
        await myListingsState.moveToNextPage();
      } catch (error) {
        setGlobalSnackbar({ message: t(error.message), variant: 'error' });
      }
    },
    [t, setGlobalSnackbar, myListingsState],
  );

  const onDeleteItemClick = React.useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      setGlobalSpinner(true);
      try {
        const { hashId } = myListingsState.itemForDelete;

        await itemApi.deleteItem(hashId);
        myListingsState.removeItem(hashId);
        myListingsState.closeDeleteDialog();
      } catch (error) {
        setGlobalSnackbar({ message: t(error.message), variant: 'error' });
      } finally {
        setGlobalSpinner(false);
      }
    },
    [t, itemApi, setGlobalSpinner, setGlobalSnackbar, myListingsState],
  );

  return (
    <MyListings
      tab={myListingsState.tab}
      items={myListingsState.items}
      numberOfItems={myListingsState.numberOfItems}
      startIndex={myListingsState.startIndex}
      lastIndex={myListingsState.lastIndex}
      viewSearchWord={myListingsState.viewSearchWord}
      isDeleteDialogOpen={myListingsState.isDeleteDialogOpen}
      dialogOffsetTop={myListingsState.dialogOffsetTop}
      onTabChange={myListingsState.onTabChange}
      onItemDeleteClick={myListingsState.openDeleteDialog}
      onPreviousClick={onPreviousClick}
      onNextClick={onNextClick}
      onSearchWordChange={myListingsState.onSearchWordChange}
      onDeleteDialogClose={myListingsState.closeDeleteDialog}
      onDeleteItemClick={onDeleteItemClick}
    />
  );
};

export default withTranslation('common')(MyListingsContainer);

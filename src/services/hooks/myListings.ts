import React from 'react';
import { safeKey, getMaxPage } from '@common/utils';
import { ItemResponse, ItemArrayResponse } from '@services/types';
import { useDelayState } from '@common/utils/hooks';

export enum TabType {
  Active = 0,
  Draft = 1,
  History = 2,
}

export interface TabState {
  items: ItemArrayResponse;
  numberOfItems: number;
  page: number;
}

export const getTabState = (state: { [key in TabType]: TabState }, tab: TabType): TabState | undefined => {
  if (tab in state) {
    return state[safeKey(tab)];
  }
};

export interface MyListingsInitialData {
  loadItems: (page: number, perPage: number, tab: TabType, searchWord?: string) => Promise<[ItemArrayResponse, number]>;

  defaultActiveItems: ItemArrayResponse;
  defaultDraftItems: ItemArrayResponse;
  defaultHistoryItems: ItemArrayResponse;
  defaultNumberOfActiveItems: number;
  defaultNumberOfDraftItems: number;
  defaultNumberOfHistoryItems: number;

  numberOfItemsPerPage: number;
  intervalOfSearch: number;
}

export interface MyListingStateData {
  tab: TabType;
  viewSearchWord: string;
  items: ItemArrayResponse;
  numberOfItems: number;
  page: number;
  startIndex: number;
  lastIndex: number;
  isDeleteDialogOpen: boolean;
  dialogOffsetTop: number;
  itemForDelete: ItemResponse;

  onTabChange: (e: React.ChangeEvent, value: TabType) => void;
  onSearchWordChange: React.ChangeEventHandler;
  moveToPrevPage: () => Promise<void>;
  moveToNextPage: () => Promise<void>;
  openDeleteDialog: (item: ItemResponse) => void;
  closeDeleteDialog: () => void;
  removeItem: (hashId: string) => void;
}

export const useMyListingsState = (init: MyListingsInitialData): MyListingStateData => {
  const [tab, setTab] = React.useState(TabType.Active);
  const onTabChange = React.useCallback(
    (event: React.ChangeEvent<{}>, newValue: number) => {
      event.preventDefault();
      setTab(newValue);
    },
    [setTab],
  );

  const [tabStates, setTabStates] = React.useState<{ [key in TabType]: TabState }>({
    [TabType.Active]: {
      items: init.defaultActiveItems,
      numberOfItems: init.defaultNumberOfActiveItems,
      page: 1,
    },
    [TabType.Draft]: {
      items: init.defaultDraftItems,
      numberOfItems: init.defaultNumberOfDraftItems,
      page: 1,
    },
    [TabType.History]: {
      items: init.defaultHistoryItems,
      numberOfItems: init.defaultNumberOfHistoryItems,
      page: 1,
    },
  });
  const updateItems = React.useCallback(
    (tab: TabType, items: ItemArrayResponse) =>
      setTabStates((tabStates) => ({
        ...tabStates,
        [tab]: {
          ...tabStates[safeKey(tab)],
          items,
        },
      })),
    [setTabStates],
  );

  const updateNumberOfItems = React.useCallback(
    (tab: TabType, numberOfItems: number) =>
      setTabStates((tabStates) => ({
        ...tabStates,
        [tab]: {
          ...tabStates[safeKey(tab)],
          numberOfItems,
        },
      })),
    [setTabStates],
  );

  const updatePage = React.useCallback(
    (tab: TabType, page: number) =>
      setTabStates((tabStates) => ({
        ...tabStates,
        [tab]: {
          ...tabStates[safeKey(tab)],
          page,
        },
      })),
    [setTabStates],
  );

  const [viewSearchWord, searchWord, setSearchWord] = useDelayState('', init.intervalOfSearch);
  const onSearchWordChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setSearchWord(e.target.value);
    },
    [setSearchWord],
  );

  const loadItems = React.useCallback(
    async (tab: TabType, page: number, searchWord?: string) => {
      const [items, numberOfItems] = await init.loadItems(page, init.numberOfItemsPerPage, tab, searchWord);

      updateItems(tab, items);
      updateNumberOfItems(tab, numberOfItems);
      updatePage(tab, page);
    },
    [updateItems, updateNumberOfItems, updatePage, init],
  );

  const moveToPrevPage = React.useCallback(async () => {
    const tabState = getTabState(tabStates, tab);
    const newPage = Math.max(1, tabState.page - 1);

    return loadItems(tab, newPage, searchWord);
  }, [loadItems, tab, tabStates, searchWord]);
  const moveToNextPage = React.useCallback(async () => {
    console.log('moveToNextPage');
    const tabState = getTabState(tabStates, tab);
    const numberOfItems = tabState.numberOfItems;
    const maxPage = getMaxPage(numberOfItems, init.numberOfItemsPerPage);
    const newPage = Math.min(maxPage, tabState.page + 1);

    return loadItems(tab, newPage, searchWord);
  }, [loadItems, tab, tabStates, init, searchWord]);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [itemForDelete, setItemForDelete] = React.useState<ItemResponse>(null);
  const [dialogOffsetTop, setDialogOffsetTop] = React.useState(0);
  const openDeleteDialog = React.useCallback(
    (item: ItemResponse) => {
      const scrollHeight = document?.body.scrollTop || document?.documentElement.scrollTop || 0;

      setIsDeleteDialogOpen(true);
      setItemForDelete(item);
      setDialogOffsetTop(scrollHeight);
    },
    [setIsDeleteDialogOpen, setItemForDelete, setDialogOffsetTop],
  );
  const closeDeleteDialog = React.useCallback(() => {
    setIsDeleteDialogOpen(false);
    setItemForDelete(null);
    setDialogOffsetTop(0);
  }, [setIsDeleteDialogOpen, setItemForDelete, setDialogOffsetTop]);

  const removeItem = React.useCallback(
    (hashId: string) => {
      const { items } = getTabState(tabStates, tab);
      const newItems = items.filter((item) => item.hashId !== hashId);

      updateItems(tab, newItems);
    },
    [updateItems, tabStates, tab],
  );

  React.useEffect(() => {
    loadItems(TabType.Active, 1, searchWord);
    loadItems(TabType.Draft, 1, searchWord);
    loadItems(TabType.History, 1, searchWord);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchWord]);

  const { items, numberOfItems, page } = React.useMemo(() => getTabState(tabStates, tab), [tabStates, tab]);
  const startIndex = init.numberOfItemsPerPage * (page - 1) + 1;
  const lastIndex = init.numberOfItemsPerPage * (page - 1) + items.length;

  return {
    tab,
    viewSearchWord,
    items,
    numberOfItems,
    page,
    startIndex,
    lastIndex,
    isDeleteDialogOpen,
    dialogOffsetTop,
    itemForDelete,
    onTabChange,
    onSearchWordChange,
    moveToPrevPage,
    moveToNextPage,
    openDeleteDialog,
    closeDeleteDialog,
    removeItem,
  };
};

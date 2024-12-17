import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { withRouter, SingletonRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import moment from 'moment';
import { WithTranslation } from 'react-i18next';
import { withTranslation } from '@server/i18n';
import Layout from '@containers/Layout';
import { Text } from '@components/atoms/Text';
import Flex from '@components/layouts/Flex';
import MyAccountContainerLayout from '@containers/MyAccountContainerLayout';
import Box from '@components/layouts/Box';
import { EventIcon } from '@components/atoms/IconButton';
import { withAuth, RedirectAction, withAuthServerSideProps } from '@hocs/withAuth';
import { compose, safeKey } from '@common/utils';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import { createApiClient } from '@services/core';
import { BoostApi, UserApi } from '@services/apis';
import { BoostType, BoostStatus, BoostResponse as BoostRecord } from '@services/types';
import InputSearch from '@components/organisms/InputSearch';
import { useDelayState } from '@common/utils/hooks';
import { Tabs, Tab } from '@components/molecules/Tab';
import { TFunction } from 'next-i18next';
import ListingItem from '@components/molecules/ListingItem';
import { MenuItemLink } from '@components/atoms/MenuItem';
import ListingPagination from '@components/molecules/ListingPagination';
import ItemDropdown from '@components/molecules/ItemDropdown';

const boostApi = createApiClient(BoostApi);
const userApi = createApiClient(UserApi);

const NUM_OF_ITEMS_PER_PAGE = 10;
const MIN_INTERVAL_OF_SEARCH = 1000;

enum TabType {
  Boosting = 0,
  Scheduled = 1,
  History = 2,
}

interface TabState {
  boosts: Boost[];
  numOfBoosts: number;
  page: number;
}

type Boost = BoostRecord;

const fetchBoostsByTab = async (page: number, perPage: number, tab: TabType, searchWord?: string): Promise<Boost[]> => {
  //todo: add call search api with search word
  console.log(searchWord);

  let status: BoostStatus | null = null;

  switch (tab) {
    case TabType.Boosting:
      status = BoostStatus.Boosting;
      break;
    case TabType.Scheduled:
      status = BoostStatus.Scheduled;
      break;
    case TabType.History:
      status = BoostStatus.Finished;
      break;
    default:
      const invalidTab: never = tab;

      throw new Error(`${invalidTab} is not TabType`);
  }

  return boostApi.getMyBoosts(page, perPage, status);
};

const getTabState = (state: { [key in TabType]: TabState }, tab: TabType): TabState | undefined => {
  if (tab in state) {
    return state[safeKey(tab)];
  }
};

const getMaxPage = (numOfBoosts: number, perPage: number) => {
  const maxPage = Math.floor(numOfBoosts / perPage);

  if (numOfBoosts % perPage > 0) {
    return maxPage + 1;
  }

  return maxPage;
};

const getCallenderText = (boost: Boost) => {
  if (boost.type === BoostType.Schedule) {
    if (boost.status === BoostStatus.Boosting || boost.status === BoostStatus.Scheduled) {
      return `${moment(boost.nextBoostTime).format('HH:mm')} (${boost.totalCount - boost.remainCount}/${boost.totalCount})`;
    }

    if (boost.status === BoostStatus.Finished) {
      return moment(boost.finishBoostTime).format('DD-MM-YYYY HH:mm');
    }
  } else {
    return moment(boost.createdAt).format('DD-MM-YYYY HH:mm');
  }
};

interface BoostMenusProps {
  t: TFunction;
  boost: Boost;
}

const BoostMenus = (props: BoostMenusProps) => {
  const { t, boost } = props;

  return (
    <ItemDropdown>
      <MenuItemLink href="/listing/[hashId]/edit" as={`/listing/${boost.hashItemId}/edit`}>
        <Text m={0} color="text">
          {t(`Edit listing`)}
        </Text>
      </MenuItemLink>
      {boost.status === BoostStatus.Finished && (
        <MenuItemLink href="/listing/[hashId]/boost" as={`/listing/${boost.hashItemId}/boost`}>
          <Text m={0} color="text">
            {t(`Boost listing`)}
          </Text>
        </MenuItemLink>
      )}
    </ItemDropdown>
  );
};

const CalenderContainer = styled(Flex)`
  min-width: 67px;
  height: 25px;
  border: 1px solid #222222;
  border-radius: 24px;
  box-sizing: border-box;
`;

const Calender = (props: { text: string }) => {
  return (
    <CalenderContainer p={1} alignItems="center" justifyContent="center">
      <EventIcon size="12px" />
      <Text mt={0} mb={0} ml={1} variant="extraSmall" fontFamily="secondary" fontWeight="600">
        {props.text}
      </Text>
    </CalenderContainer>
  );
};

const BoostListContainer = styled(Flex)`
  width: 100%;

  & > *:not(:first-child) {
    margin-top: ${({ theme }) => theme.space[3]};
  }
`;

interface BoostListProps {
  t: TFunction;
  boosts: Boost[];
}

const BoostList = (props: BoostListProps) => {
  const { t, boosts } = props;

  return (
    <BoostListContainer flexDirection="column">
      {boosts.map((boost) => {
        const imageUrl = boost.item?.imageUrl ?? '';
        const title = boost.item?.title;
        const year = boost.item?.productionYear;
        const price = boost.item?.sellingPrice ? boost.item.sellingPrice.toLocaleString() : '';
        const callenderText = getCallenderText(boost);

        return (
          <Link key={boost.hashId} href={`/listing/[hashId]`} as={`/listing/${boost.hashItemId}`}>
            <ListingItem
              imageUrl={imageUrl}
              title={title}
              tags={[`${year}`, boost.item.transmission]}
              price={`${price} THB`}
              hasBorder={true}
              rightTopElement={<BoostMenus t={t} boost={boost} />}
              rightBottomElement={<Calender text={callenderText} />}
            />
          </Link>
        );
      })}
    </BoostListContainer>
  );
};

interface MyAccountBoostsPageProps extends WithTranslation {
  router: SingletonRouter;
  defaultActiveBoosts: Boost[];
  defaultScheduledBoosts: Boost[];
  defaultHistoryBoosts: Boost[];
  defaultNumberOfActiveBoosts: number;
  defaultNumberOfScheduledBoosts: number;
  defaultNumberOfHistoryBoosts: number;
}

const MyAccountBoostsPage: NextPage<MyAccountBoostsPageProps> = (props: MyAccountBoostsPageProps) => {
  const {
    t,
    defaultActiveBoosts,
    defaultScheduledBoosts,
    defaultHistoryBoosts,
    defaultNumberOfActiveBoosts,
    defaultNumberOfScheduledBoosts,
    defaultNumberOfHistoryBoosts,
  } = props;
  const setGlobalSpinner = useGlobalSpinnerActionsContext();

  const [tabStates, setTabStates] = React.useState<{ [key in TabType]: TabState }>({
    [TabType.Boosting]: {
      boosts: defaultActiveBoosts,
      numOfBoosts: defaultNumberOfActiveBoosts,
      page: 1,
    },
    [TabType.Scheduled]: {
      boosts: defaultScheduledBoosts,
      numOfBoosts: defaultNumberOfScheduledBoosts,
      page: 1,
    },
    [TabType.History]: {
      boosts: defaultHistoryBoosts,
      numOfBoosts: defaultNumberOfHistoryBoosts,
      page: 1,
    },
  });

  const updateBoosts = React.useCallback(
    (tab: TabType, boosts: Boost[]) =>
      setTabStates((tabStates) => ({
        ...tabStates,
        [tab]: {
          ...tabStates[safeKey(tab)],
          boosts,
        },
      })),
    [setTabStates],
  );

  /*
 const updateNumsOfBoosts = React.useCallback(
    (tab: TabType, numOfBoosts: number) =>
      setTabStates(tabStates => ({
        ...tabStates,
        [tab]: {
          ...tabStates[safeKey(tab)],
          numOfBoosts,
        },
      })),
    [setTabStates],
  );
  */

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

  const [tab, setTab] = React.useState(TabType.Boosting);
  const onTabChange = React.useCallback(
    (event: React.ChangeEvent<{}>, newValue: number) => {
      setTab(newValue);
    },
    [setTab],
  );

  const loadBoosts = React.useCallback(
    async (tab: TabType, page: number, searchWord?: string) => {
      setGlobalSpinner(true);
      try {
        const boosts = await fetchBoostsByTab(page, NUM_OF_ITEMS_PER_PAGE, tab, searchWord);

        //todo: update num of items from state
        updateBoosts(tab, boosts);
        updatePage(tab, page);
      } catch (error) {
        console.error(error);
      } finally {
        setGlobalSpinner(false);
      }
    },
    [setGlobalSpinner, updateBoosts, updatePage],
  );

  const onPreviousClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const tabState = getTabState(tabStates, tab);
      const newPage = Math.max(1, tabState.page - 1);

      loadBoosts(tab, newPage);
    },
    [tabStates, tab, loadBoosts],
  );
  const onNextClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const tabState = getTabState(tabStates, tab);
      const numOfBoosts = tabState.numOfBoosts;
      const maxPage = getMaxPage(numOfBoosts, NUM_OF_ITEMS_PER_PAGE);
      const newPage = Math.min(maxPage, tabState.page + 1);

      loadBoosts(tab, newPage);
    },
    [tabStates, tab, loadBoosts],
  );

  const [viewSearchWord, searchWord, setSearchWord] = useDelayState('', MIN_INTERVAL_OF_SEARCH);
  const onSearchWordChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setSearchWord(e.target.value);
    },
    [setSearchWord],
  );

  React.useEffect(() => {
    //todo: search by searchWord with num, page
    loadBoosts(TabType.Boosting, 1, searchWord);
    loadBoosts(TabType.Scheduled, 1, searchWord);
    loadBoosts(TabType.History, 1, searchWord);
  }, [searchWord, setTabStates, loadBoosts]);

  const { boosts, numOfBoosts, page } = getTabState(tabStates, tab);

  const startIndex = NUM_OF_ITEMS_PER_PAGE * (page - 1) + 1;
  const lastIndex = Math.min(numOfBoosts, NUM_OF_ITEMS_PER_PAGE * (page - 1) + boosts.length);

  return (
    <Layout>
      <Head>
        <title>{t(`My Boosts`)}</title>
      </Head>
      <MyAccountContainerLayout title={t('Boosts Schedule')} userApi={userApi}>
        <Flex mt={3}>
          <InputSearch placeholder={t(`Search by Listing ID, brand, make`)} value={viewSearchWord} onChange={onSearchWordChange} />
        </Flex>
        <Flex mt={2}>
          <Tabs value={tab} onChange={onTabChange}>
            <Tab label={t('Running')} />
            <Tab label={t('Reserved')} />
            <Tab label={t('Finished')} />
          </Tabs>
        </Flex>
        <Box my={3}>
          <ListingPagination
            leftText={`${numOfBoosts} listings`}
            startIndex={startIndex}
            lastIndex={lastIndex}
            totalNumber={numOfBoosts}
            onPreviousClick={onPreviousClick}
            onNextClick={onNextClick}
          />
        </Box>
        <Flex>
          <BoostList t={t} boosts={boosts} />
        </Flex>
        {/* todo: consider to add Infinite list for mobile */}
        <Box my={3}>
          <ListingPagination
            leftText={`${numOfBoosts} listings`}
            startIndex={startIndex}
            lastIndex={lastIndex}
            totalNumber={numOfBoosts}
            onPreviousClick={onPreviousClick}
            onNextClick={onNextClick}
          />
        </Box>
      </MyAccountContainerLayout>
    </Layout>
  );
};

MyAccountBoostsPage.displayName = 'MyAccountBoostsPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async (ctx) => {
  const boostApi = createApiClient(BoostApi, ctx);

  const fetchBoostsResults = await Promise.allSettled([
    boostApi.getMyBoosts(1, NUM_OF_ITEMS_PER_PAGE, BoostStatus.Boosting),
    boostApi.getMyBoosts(1, NUM_OF_ITEMS_PER_PAGE, BoostStatus.Scheduled),
    boostApi.getMyBoosts(1, NUM_OF_ITEMS_PER_PAGE, BoostStatus.Finished),
  ]);

  let activeBoosts: Boost[] = [];
  let scheduledBoosts: Boost[] = [];
  let historyBoosts: Boost[] = [];

  if (fetchBoostsResults[0].status === 'fulfilled') {
    activeBoosts = fetchBoostsResults[0].value;
  }

  if (fetchBoostsResults[1].status === 'fulfilled') {
    scheduledBoosts = fetchBoostsResults[1].value;
  }

  if (fetchBoostsResults[2].status === 'fulfilled') {
    historyBoosts = fetchBoostsResults[2].value;
  }

  return {
    props: {
      namespacesRequired: ['common'],
      defaultActiveBoosts: activeBoosts,
      defaultScheduledBoosts: scheduledBoosts,
      defaultHistoryBoosts: historyBoosts,
      defaultNumberOfActiveBoosts: 1000,
      defaultNumberOfScheduledBoosts: 1000,
      defaultNumberOfHistoryBoosts: 1000,
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], MyAccountBoostsPage);

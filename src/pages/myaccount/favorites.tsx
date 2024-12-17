import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { withRouter, SingletonRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import { WithTranslation } from 'react-i18next';
import { withTranslation } from '@server/i18n';
import { TFunction } from 'next-i18next';
import Layout from '@containers/Layout';
import MyAccountContainerLayout from '@containers/MyAccountContainerLayout';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import { CheckCircleIcon, FavoriteIcon, FavoriteBorderIcon } from '@components/atoms/IconButton';
import { withAuth, RedirectAction, withAuthServerSideProps } from '@hocs/withAuth';
import { compose, safeKey } from '@common/utils';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import { createApiClient } from '@services/core';
import { FavoriteApi, UserApi } from '@services/apis';
import { FavoriteResponse } from '@services/types';
import InputSearch from '@components/organisms/InputSearch';
import { useDelayState } from '@common/utils/hooks';
import ListingItem from '@components/molecules/ListingItem';
import ListingPagination from '@components/molecules/ListingPagination';
import { Text } from '@components/atoms/Text';

type Favorite = FavoriteResponse & {
  isFavorite: boolean;
};

const favoriteApi = createApiClient(FavoriteApi);
const userApi = createApiClient(UserApi);

const NUM_OF_ITEMS_PER_PAGE = 10;
const MIN_INTERVAL_OF_SEARCH = 1000;

const getMaxPage = (numOfBoosts: number, perPage: number) => {
  const maxPage = Math.floor(numOfBoosts / perPage);

  if (numOfBoosts % perPage > 0) {
    return maxPage + 1;
  }

  return maxPage;
};

const FavoriteListContainer = styled(Flex)`
  width: 100%;

  & > *:not(:first-child) {
    margin-top: ${({ theme }) => theme.space[3]};
  }
`;

const StyledCheckCircleIcon = styled(CheckCircleIcon)`
  & svg {
    background-color: white;
    border-radius: 100%;
  }
`;

interface FavoriteListProps {
  t: TFunction;
  favorites: Favorite[];
  onFavoriteIconClick: (e: React.MouseEvent, favorite: Favorite, index: number) => void;
}

const FavoriteList = (props: FavoriteListProps) => {
  const { t, favorites, onFavoriteIconClick } = props;

  if (favorites.length === 0) {
    return (
      <Text mt={0} mb={0}>
        {t(`There are no favorite listings.`)}
      </Text>
    );
  }

  return (
    <FavoriteListContainer flexDirection="column">
      {favorites.map((favorite: Favorite, index: number) => {
        const imageUrl = favorite.item?.imageUrl ?? '';
        const title = favorite.item?.title;
        const year = favorite.item?.productionYear;
        const price = favorite.item?.sellingPrice ? favorite.item.sellingPrice.toLocaleString() : '';

        return (
          <Link key={favorite.hashId} href={`/listing/${favorite.itemHashId}`}>
            <ListingItem
              imageUrl={imageUrl}
              title={title}
              tags={[`${year}`, favorite.item.transmission]}
              price={`${price} THB`}
              hasBorder={true}
              leftTopElement={<StyledCheckCircleIcon size="18px" color="success" />}
              rightBottomElement={
                favorite.isFavorite ? (
                  <FavoriteIcon size="18px" color="red" onClick={(e: React.MouseEvent) => onFavoriteIconClick(e, favorite, index)} />
                ) : (
                  <FavoriteBorderIcon
                    size="18px"
                    color="helpIcon"
                    onClick={(e: React.MouseEvent) => onFavoriteIconClick(e, favorite, index)}
                  />
                )
              }
            />
          </Link>
        );
      })}
    </FavoriteListContainer>
  );
};

interface MyAccountFavoritesPageProps extends WithTranslation {
  router: SingletonRouter;
  defaultFavorites: Favorite[];
  defaultNumberOfFavorites: number;
}

const MyAccountFavoritesPage: NextPage<MyAccountFavoritesPageProps> = (props: MyAccountFavoritesPageProps) => {
  const { t, defaultFavorites, defaultNumberOfFavorites } = props;

  const [favorites, setFavorites] = React.useState<Favorite[]>(() =>
    defaultFavorites.map((favorite) => ({ ...favorite, isFavorite: true })),
  );

  const [numOfFavorites, setNumOfFavorites] = React.useState(defaultNumberOfFavorites);
  const [favoritePage, setFavoritePage] = React.useState(1);
  const setGlobalSpinner = useGlobalSpinnerActionsContext();

  const loadFavorites = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (page: number, searchKeyword: string = '') => {
      setGlobalSpinner(true);
      try {
        const [favorites, numOfFavorites] = await favoriteApi.getMyFavorites({
          page,
          perPage: NUM_OF_ITEMS_PER_PAGE,
          q: searchKeyword,
        });

        setFavorites(favorites.map((fav) => ({ ...fav, isFavorite: true })));
        setNumOfFavorites(numOfFavorites);
        setFavoritePage(page);
      } catch (error) {
        console.error(error);
      } finally {
        setGlobalSpinner(false);
      }
    },
    [setGlobalSpinner, setFavorites, setNumOfFavorites, setFavoritePage],
  );

  const onPreviousClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const newPage = Math.max(1, favoritePage - 1);

      loadFavorites(newPage);
    },
    [favoritePage, loadFavorites],
  );
  const onNextClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const maxPage = getMaxPage(numOfFavorites, NUM_OF_ITEMS_PER_PAGE);
      const newPage = Math.min(maxPage, favoritePage + 1);

      loadFavorites(newPage);
    },
    [numOfFavorites, favoritePage, loadFavorites],
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
    loadFavorites(1, searchWord);
  }, [searchWord, loadFavorites]);

  const startIndex = NUM_OF_ITEMS_PER_PAGE * (favoritePage - 1) + 1;
  const lastIndex = Math.min(numOfFavorites, NUM_OF_ITEMS_PER_PAGE * (favoritePage - 1) + favorites.length);

  const onFavoriteIconClick = React.useCallback(
    async (e: React.MouseEvent, favorite: Favorite, index: number) => {
      e.preventDefault();

      let newFavorite = favorite;

      if (favorite.isFavorite) {
        await favoriteApi.deleteFavorite(favorite.hashId);
        favorite.isFavorite = false;
      } else {
        const { hashId } = await favoriteApi.createFavorite({ itemHashId: favorite.itemHashId });

        newFavorite = {
          ...favorite,
          hashId: hashId,
          isFavorite: true,
        };
      }

      setFavorites((favorites) => {
        const newFavorites = [...favorites];

        newFavorites[safeKey(index)] = newFavorite;

        return newFavorites;
      });
      setNumOfFavorites((num) => num);
    },
    [setFavorites, setNumOfFavorites],
  );

  console.log('favorites', favorites);

  return (
    <Layout>
      <Head>
        <title>{t(`My Favorites`)}</title>
      </Head>
      <MyAccountContainerLayout title={t('My Favorites')} userApi={userApi}>
        <Flex mt={3}>
          <InputSearch placeholder={t(`Search by Listing ID, brand, make`)} value={viewSearchWord} onChange={onSearchWordChange} />
        </Flex>
        <Box my={3}>
          <ListingPagination
            leftText={`${numOfFavorites} listings`}
            startIndex={startIndex}
            lastIndex={lastIndex}
            totalNumber={numOfFavorites}
            onPreviousClick={onPreviousClick}
            onNextClick={onNextClick}
          />
        </Box>
        <Flex>
          <FavoriteList t={t} favorites={favorites} onFavoriteIconClick={onFavoriteIconClick} />
        </Flex>
        <Box my={3}>
          <ListingPagination
            leftText={`${numOfFavorites} listings`}
            startIndex={startIndex}
            lastIndex={lastIndex}
            totalNumber={numOfFavorites}
            onPreviousClick={onPreviousClick}
            onNextClick={onNextClick}
          />
        </Box>
      </MyAccountContainerLayout>
    </Layout>
  );
};

MyAccountFavoritesPage.displayName = 'MyAccountFavoritesPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async (ctx) => {
  const favoriteApi = createApiClient(FavoriteApi, ctx);
  const [favorites, numOfFavorites] = await favoriteApi.getMyFavorites({ page: 1, perPage: NUM_OF_ITEMS_PER_PAGE });

  return {
    props: {
      namespacesRequired: ['common'],
      defaultFavorites: favorites,
      defaultNumberOfFavorites: numOfFavorites,
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], MyAccountFavoritesPage);

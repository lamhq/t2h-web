import React from 'react';
import { WithTranslation } from 'react-i18next';
import { withTranslation } from '@server/i18n';
import { ItemApi, FavoriteApi } from '@services/apis';
import { ItemResponse, SearchItemArrayResponse, FavoriteResponse } from '@services/types';
import { createApiClient } from '@services/core';
import Box from '@components/layouts/Box';
import { SubTitle } from '@components/atoms/Title';
import ListingItemContainer from '@components/molecules/ListingItemContainer';
import { useAuthContext } from '@hocs/withAuth';
import { safeKey } from '@common/utils';

const itemApi = createApiClient(ItemApi);
const favoriteApi = createApiClient(FavoriteApi);

interface SimilarListingsContainerProps extends WithTranslation {
  numberOfItems: number;
  item: ItemResponse;
}

const SimilarListingsContainer = ({ t, item, numberOfItems }: SimilarListingsContainerProps) => {
  const me = useAuthContext();

  const [items, setItems] = React.useState<SearchItemArrayResponse>([]);
  const [itemHashIdToFavorite, setItemHashIdToFavorite] = React.useState<{ [key: string]: FavoriteResponse }>({});

  React.useEffect(() => {
    (async () => {
      const [items] = await itemApi.search({ q: item.title, perPage: numberOfItems + 1 });
      const newItems = items.filter((i) => i.hashId !== item.hashId).slice(0, numberOfItems);

      setItems(newItems);

      if (me) {
        const itemHashIdToFavorite: { [key: string]: FavoriteResponse } = {};
        const itemHashIds = newItems.map((i) => i.hashId);
        const [favorites] = await favoriteApi.getMyFavorites({
          page: 1,
          perPage: itemHashIds.length,
          itemIds: itemHashIds,
        });

        for (const fav of favorites) {
          itemHashIdToFavorite[fav.itemHashId] = fav;
        }
        setItemHashIdToFavorite(itemHashIdToFavorite);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFavoriteIconClick = React.useCallback(
    async (e: React.MouseEvent, itemHashId: string) => {
      e.preventDefault();

      const favorite = itemHashIdToFavorite[safeKey(itemHashId)];

      let newFavorite: FavoriteResponse | null = null;

      if (favorite) {
        await favoriteApi.deleteFavorite(favorite.hashId);
      } else {
        newFavorite = await favoriteApi.createFavorite({ itemHashId: itemHashId });
      }

      setItemHashIdToFavorite((itemHashIdToFavorite) => ({
        ...itemHashIdToFavorite,
        [itemHashId]: newFavorite,
      }));
    },
    [itemHashIdToFavorite],
  );

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Box mx={{ _: 3, md: 'auto' }}>
      <SubTitle textAlign="left" mt={0} mb={0}>
        {t(`Similar Items`)}
      </SubTitle>
      <Box mt={3}>
        <ListingItemContainer
          items={items}
          expectedTotal={items.length}
          isLoading={false}
          itemHashIdToFavorite={itemHashIdToFavorite}
          onFavoriteIconClick={onFavoriteIconClick}
        />
      </Box>
    </Box>
  );
};

export default withTranslation('common')(SimilarListingsContainer);

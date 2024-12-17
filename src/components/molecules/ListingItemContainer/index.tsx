import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { WithTranslation, withTranslation } from 'react-i18next';
import { useScrollPosition } from '@common/utils/hooks';
import Image from '@components/atoms/Image';
import { Text } from '@components/atoms/Text';
import Flex from '@components/layouts/Flex';
import Spinner from '@components/atoms/Spinner';
import Box from '@components/layouts/Box';
import { ItemArrayResponse, SearchItemArrayResponse, FavoriteResponse } from '@services/types';
import ListingItem from '@components/molecules/ListingItem';
import ListingItemBig from '@components/molecules/ListingItemBig';
import { FavoriteIcon, FavoriteBorderIcon } from '@components/atoms/IconButton';

interface FavoriteIconProps {
  isFavorite: boolean;
  itemHashId: string;
  onFavoriteIconClick?: (e: React.MouseEvent, itemHashId: string) => void;
}

const Favorite = (props: FavoriteIconProps) => {
  const { isFavorite, itemHashId, onFavoriteIconClick } = props;

  return isFavorite ? (
    <FavoriteIcon size="18px" color="red" onClick={(e) => onFavoriteIconClick && onFavoriteIconClick(e, itemHashId)} />
  ) : (
    <FavoriteBorderIcon size="18px" color="helpIcon" onClick={(e) => onFavoriteIconClick && onFavoriteIconClick(e, itemHashId)} />
  );
};

interface ListingItemContainerProps extends WithTranslation {
  children?: React.ReactNode;
  items: ItemArrayResponse | SearchItemArrayResponse;
  expectedTotal: number;
  isLoading: boolean;
  onReachBottom?: () => void;
  itemHashIdToFavorite?: { [key: string]: FavoriteResponse };
  onFavoriteIconClick?: (e: React.MouseEvent, itemHashId: string) => void;
}

const ListingItemContainerWrapper = styled.div``;

const ListingItemContainer: React.FC<ListingItemContainerProps> = (props: ListingItemContainerProps) => {
  const { t, children, items = [], isLoading, expectedTotal, onReachBottom, itemHashIdToFavorite, onFavoriteIconClick } = props;
  const hasNext = expectedTotal > items.length;
  const isEmpty = items.length == 0 && !isLoading;

  useScrollPosition(
    async ({ scrollY }) => {
      if (process.browser && window && hasNext) {
        const scrollMaxY = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        // useScrollPosition use requestAnimationFrame. don't have to care about excessive function call
        if (onReachBottom && !isLoading && scrollY >= scrollMaxY * 0.7) {
          onReachBottom();
        }
      }
    },
    [isLoading, hasNext, onReachBottom],
  );

  return (
    <ListingItemContainerWrapper>
      {isEmpty && (
        <Flex mb={0} flexDirection="column" alignItems="center">
          <Image width={200} src="/static/images/listing/empty.svg" />
          <Text mb={0} variant="extraLarge" fontWeight="bold">
            {t('No Result Found')}
          </Text>
        </Flex>
      )}
      {!isEmpty &&
        items.map((item, idx) => {
          const imageUrl = item.imageUrl ?? '/static/images/listing/no-image.svg';
          const title = item.title;
          const productionYear = item.productionYear;
          const price = item.sellingPrice != 0 ? `${Number(item.sellingPrice).toLocaleString()} THB` : 'Contact seller';
          const isFavorite = !!(itemHashIdToFavorite ?? {})[item.hashId];

          return (
            <Link href="/listing/[hashId]" as={`/listing/${item.hashId}`} key={idx}>
              <a>
                <Box mt={idx == 0 ? 0 : 2}>
                  <Box display={{ _: 'block', md: 'none' }}>
                    <ListingItem
                      imageUrl={imageUrl}
                      title={title}
                      tags={[`${productionYear}`, item.transmission]}
                      price={price}
                      hasBorder
                      rightBottomElement={
                        <Favorite isFavorite={isFavorite} itemHashId={item.hashId} onFavoriteIconClick={onFavoriteIconClick} />
                      }
                    />
                  </Box>
                  <Box display={{ _: 'none', md: 'block' }}>
                    <ListingItemBig
                      imageUrl={imageUrl}
                      title={title}
                      tags={[`${productionYear}`, item.transmission]}
                      price={price}
                      hasBorder
                      photoCount={0}
                      rightBottomElement={
                        <Favorite isFavorite={isFavorite} itemHashId={item.hashId} onFavoriteIconClick={onFavoriteIconClick} />
                      }
                    />
                  </Box>
                </Box>
              </a>
            </Link>
          );
        })}
      {(hasNext || isLoading) && (
        <Flex p={2} justifyContent="center">
          <Spinner size={20} strokeWidth={2} />
        </Flex>
      )}
      {children}
    </ListingItemContainerWrapper>
  );
};

export default withTranslation('common')(ListingItemContainer);

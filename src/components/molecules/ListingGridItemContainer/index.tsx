import React from 'react';
import Link from 'next/link';
import { WithTranslation, withTranslation } from 'react-i18next';
import { useScrollPosition } from '@common/utils/hooks';
import Image from '@components/atoms/Image';
import { Text } from '@components/atoms/Text';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import Grid from '@components/layouts/Grid';
import { ItemArrayResponse, SearchItemArrayResponse } from '@services/types';
import ListingGridItem from '@components/molecules/ListingGridItem';

interface ListingGridItemContainerProps extends WithTranslation {
  items: ItemArrayResponse | SearchItemArrayResponse;
  expectedTotal: number;
  isLoading: boolean;
  onReachBottom: () => void;
}

const ListingGridItemContainer: React.FC<ListingGridItemContainerProps> = (props: ListingGridItemContainerProps) => {
  const { t, items = [], isLoading, expectedTotal, onReachBottom } = props;
  const hasNext = expectedTotal > items.length;
  const isEmpty = items.length == 0 && !isLoading;

  useScrollPosition(
    async ({ scrollY }) => {
      if (process.browser && window && hasNext) {
        const scrollMaxY = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        // useScrollPosition use requestAnimationFrame. don't have to care about excessive function call
        if (!isLoading && scrollY >= scrollMaxY * 0.7) {
          onReachBottom();
        }
      }
    },
    [isLoading, hasNext, onReachBottom],
  );

  return (
    <>
      {isEmpty !== true ? (
        <Grid display="grid" gridTemplateColumns="repeat(auto-fill, 200px)" gridGap={2}>
          {items.map((item, idx) => (
            <Link href="/listing/[hashId]" as={`/listing/${item.hashId}`} key={idx}>
              <a>
                <Box>
                  <ListingGridItem
                    imageUrl={item.imageUrl}
                    title={item.title}
                    tags={[`${item.productionYear}`, item.transmission]}
                    price={`${item.sellingPrice.toLocaleString()} THB`}
                  />
                </Box>
              </a>
            </Link>
          ))}
        </Grid>
      ) : (
        <Flex mb={0} flexDirection="column" alignItems="center">
          <Image width={200} src="/static/images/listing/empty.svg" />
          <Text mb={0} variant="extraLarge" fontWeight="bold">
            {t('No Result Found')}
          </Text>
        </Flex>
      )}
    </>
  );
};

export default withTranslation('common')(ListingGridItemContainer);

import * as React from 'react';
import Head from 'next/head';
import { NextPage, GetServerSideProps } from 'next';
import { withRouter, SingletonRouter } from 'next/router';
import Link from 'next/link';
import { WithTranslation } from 'react-i18next';
import { withTranslation } from '@server/i18n';
import { TFunction } from 'next-i18next';
import styled from 'styled-components';
import { withAuth, withAuthServerSideProps, useAuthContext } from '@hocs/withAuth';
import { createApiClient } from '@services/core';
import { ItemApi, FavoriteApi, CategoryMasterApi, BrandMasterApi } from '@services/apis';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import { Text } from '@components/atoms/Text';
import { Title } from '@components/atoms/Title';
import { FavoriteIcon, FavoriteBorderIcon, GreenCheckIcon } from '@components/atoms/IconButton';
import { compose, pickNotEmpty } from '@common/utils';
import ImageBackground from '@components/molecules/ImageBackground';
import HomeSearchForm from '@components/organisms/HomeSearchForm';
import { useHomeSearchFormState, HomeSearchFormState } from '@services/hooks/HomeSearchFrom';
import ListingItem from '@components/molecules/ListingItem';
import ListingGridItem, { ListingGridItemMini } from '@components/molecules/ListingGridItem';
import { ItemArrayResponse, ItemResponse, FavoriteResponse } from '@services/types';
import CategoryGrid, { Category } from '@components/molecules/CategoryGrid';
import { VipIcon } from '@components/atoms/IconButton/buttons';
import HorizontalCollection from '@components/atoms/HorizontalCollection';
import Article from '@components/molecules/Article';
import { ButtonLink } from '@components/atoms/Button';
import { HomeSearchFormData } from '@components/organisms/HomeSearchForm';

const LARGE_LISTING_ITEM_WIDTH = 235;
const LARGE_LISTING_ITEM_COL_GAP = 15;
const SMALL_LISTING_ITEM_WIDTH = 145;
const SMALL_LISTING_ITEM_COL_GAP = 10;
const CONTAINER_PADDING = 64;
const calcHomeFlexWidth = (itemCount: number) => LARGE_LISTING_ITEM_WIDTH * itemCount + LARGE_LISTING_ITEM_COL_GAP * (itemCount - 1) + 64;

const favoriteApi = createApiClient(FavoriteApi);
const categoryMasterApi = createApiClient(CategoryMasterApi);
const brandMasterApi = createApiClient(BrandMasterApi);

const CATEGORY_LOGOS = [
  { key: 'Truck', name: 'Trucks', image: '/static/images/category/Trucks.svg', url: '#' },
  { key: 'BUS', name: 'Buses', image: '/static/images/category/Buses.svg', url: '#' },
  { key: 'PUP', name: 'PUP', image: '/static/images/category/PUP.svg', url: '#' },
  { key: 'PPV/SUV', name: 'PPV/SUV', image: '/static/images/category/PPV.svg', url: '#' },
  { key: 'P-Car', name: 'P-Car', image: '/static/images/category/P-car.svg', url: '#' },
  {
    key: 'Heavy & construction machinery',
    name: 'Construction & heavy machinery',
    image: '/static/images/category/Construction.svg',
    url: '#',
  },
  { key: 'Agricultural machinery', name: 'Agriculture machinery', image: '/static/images/category/Agriculture.svg', url: '#' },
  { key: 'Boat', name: 'Boats', image: '/static/images/category/Boats.svg', url: '#' },
  { key: 'Part', name: 'Parts', image: '/static/images/category/Parts.svg', url: '#' },
  { key: 'Tire', name: 'Tires', image: '/static/images/category/Tires.svg', url: '#' },
];

const articles = [
  {
    imageUrl: '/static/images/top-page/article1.png',
    title: "What's it worth",
    description: 'Get a free valuation. Sell or part-exchange your car at the right price.',
  },
  {
    imageUrl: '/static/images/top-page/article2.png',
    title: "What's it worth",
    description: 'Get a free valuation. Sell or part-exchange your car at the right price.',
  },
];

const TopLogoContentContainer = styled(Box)`
  box-sizing: border-box;
`;

const StyledImageBackground = styled(ImageBackground)`
  background: rgba(29, 52, 97, 0.69);
  @media screen and (min-width: ${({ theme }) => theme.breakpoints['md']}) {
    border-radius: 8px;
    background: -moz-linear-gradient(left, #1d3461, rgba(36, 62, 109, 0.83) 42.37%, rgba(62, 100, 154, 0.14));
    background: -webkit-linear-gradient(left, #1d3461, rgba(36, 62, 109, 0.83) 42.37%, rgba(62, 100, 154, 0.14));
    background: linear-gradient(to right, #1d3461, rgba(36, 62, 109, 0.83) 42.37%, rgba(62, 100, 154, 0.14));
  }
`;

interface TopLogoProps {
  t: TFunction;
  src: string;
  numberOfItems: number;
  homeSearchFormState: HomeSearchFormState;
  onSearchSubmit: (values: HomeSearchFormData) => void;
}

const TopLogo = (props: TopLogoProps) => {
  const { t, src, numberOfItems, homeSearchFormState, onSearchSubmit } = props;

  return (
    <Box width="100%" height={{ _: '210px', md: '481px' }}>
      <StyledImageBackground imageSrc={src} imageSize="cover" imageRepeat="no-repeat" borderRadius={{ _: 0, md: '8px' }}>
        <TopLogoContentContainer
          height="100%"
          width="100%"
          maxWidth={{ _: '100%', md: '968px' }}
          pt={{ _: '27px', md: '74px' }}
          px={{ _: 3, md: '185px' }}
        >
          <Box maxWidth="389px" mx={{ _: 'auto', md: 0 }}>
            <Text
              mt={0}
              mb={0}
              textAlign={{ _: 'center', md: 'left' }}
              fontSize={{ _: '40px', md: '52px' }}
              lineHeight={{ _: '43px', md: '58px' }}
              letterSpacing="0.2px"
              fontWeight="bold"
              color="white"
            >
              {t(`Find your next vehicle with us`)}
            </Text>
          </Box>
          <Box mx={{ _: 'auto', md: 0 }}>
            <Text
              mt={{ _: '14px', md: '7px' }}
              mb={0}
              mx={{ _: '24px', md: 0 }}
              textAlign={{ _: 'center', md: 'left' }}
              fontFamily="secondary"
              color="white"
            >
              {t(`Thailands #1 marketplace for used machinery and commercial vehicle sales `)}
            </Text>
          </Box>

          <Box display={{ _: 'none', md: 'block' }} mt="22px">
            <Text mt={0} mb={0} color="white" fontFamily="secondary">{`${t('Search')} ${numberOfItems.toLocaleString()} ${t(
              'listings',
            )}`}</Text>
            <Box mt={2}>
              <HomeSearchForm {...homeSearchFormState} onSubmit={onSearchSubmit} />
            </Box>
          </Box>
        </TopLogoContentContainer>
      </StyledImageBackground>
    </Box>
  );
};

interface FavoriteIconProps {
  item: ItemResponse;
  itemHashIdToFavorite: { [key: string]: FavoriteResponse };
  onFavoriteIconClick: (e: React.MouseEvent, item: ItemResponse) => void;
}

const Favorite = (props: FavoriteIconProps) => {
  const { item, onFavoriteIconClick, itemHashIdToFavorite } = props;
  const isFavorite = !!itemHashIdToFavorite[item.hashId];

  return isFavorite ? (
    <FavoriteIcon size="18px" color="red" onClick={(e) => onFavoriteIconClick(e, item)} />
  ) : (
    <FavoriteBorderIcon size="18px" color="helpIcon" onClick={(e) => onFavoriteIconClick(e, item)} />
  );
};

const RecentListContainer = styled(Flex)`
  @media screen and (max-width: ${({ theme }) => theme.breakpoints['md']}) {
    & > *:not(:first-child) {
      margin-top: ${({ theme }) => theme.space[2]};
    }
  }
  @media screen and (min-width: ${({ theme }) => theme.breakpoints['md']}) {
    display: grid;
    grid-template-columns: repeat(auto-fill, ${LARGE_LISTING_ITEM_WIDTH}px);
    column-gap: ${LARGE_LISTING_ITEM_COL_GAP}px;
    row-gap: 24px;
  }
  justify-content: center;
`;

interface ListingListProps {
  items: ItemArrayResponse;
  onFavoriteIconClick: (e: React.MouseEvent, item: ItemResponse) => void;
  itemHashIdToFavorite: { [key: string]: FavoriteResponse };
}

const RecentListingList = (props: ListingListProps) => {
  const { items, onFavoriteIconClick, itemHashIdToFavorite } = props;

  return (
    <RecentListContainer width="100%" flexDirection={{ _: 'column', md: 'row' }} flexWrap={{ _: 'nowrap', md: 'wrap' }}>
      {items.map((item) => {
        const imageUrl = item.imageUrl ?? '/static/images/listing/no-image.svg';
        const title = item.title;
        const year = item.productionYear;
        const price = item.sellingPrice != 0 ? `${Number(item.sellingPrice).toLocaleString()} THB` : 'Contact seller';
        const numberOfPhotos = item.images.length;
        const isVerified = item.user.isEmailVerified || item.user.isMobileVerified;

        return (
          <Link key={item.hashId} href={`/listing/[hashId]`} as={`/listing/${item.hashId}`}>
            <a>
              <>
                <Box display={{ _: 'block', md: 'none' }}>
                  <ListingItem
                    imageUrl={imageUrl}
                    title={title}
                    tags={[`${year}`, item.transmission]}
                    price={price}
                    hasBorder={true}
                    rightBottomElement={
                      <Favorite item={item} itemHashIdToFavorite={itemHashIdToFavorite} onFavoriteIconClick={onFavoriteIconClick} />
                    }
                  />
                </Box>
                <Box display={{ _: 'none', md: 'block' }}>
                  <ListingGridItem
                    imageUrl={imageUrl}
                    title={title}
                    tags={[`${year}`, item.transmission]}
                    price={price}
                    rightTopElement={isVerified ? <GreenCheckIcon /> : null}
                    rightBottomElement={
                      <Favorite item={item} itemHashIdToFavorite={itemHashIdToFavorite} onFavoriteIconClick={onFavoriteIconClick} />
                    }
                    photoCount={numberOfPhotos}
                  />
                </Box>
              </>
            </a>
          </Link>
        );
      })}
    </RecentListContainer>
  );
};

const VipListContainer = styled(Flex)`
  @media screen and (max-width: ${({ theme }) => theme.breakpoints['md']}) {
    & > *:not(:first-child) {
      margin-top: ${({ theme }) => theme.space[2]};
    }
  }
  @media screen and (min-width: ${({ theme }) => theme.breakpoints['md']}) {
    display: grid;
    grid-template-columns: repeat(auto-fill, ${SMALL_LISTING_ITEM_WIDTH}px);
    column-gap: ${SMALL_LISTING_ITEM_COL_GAP}px;
    row-gap: 24px;
  }
  justify-content: center;
`;

const VipIconWithWhiteBorder = styled(VipIcon)`
  & svg {
    background-color: white;
    border-radius: 100%;
  }
`;

const VipSellerListingList = (props: ListingListProps) => {
  const { items, onFavoriteIconClick, itemHashIdToFavorite } = props;

  return (
    <VipListContainer flexDirection="column">
      {items.map((item) => {
        const companyName = item.user.displayName;
        const imageUrl = item.imageUrl ?? '/static/images/listing/no-image.svg';
        const title = item.title;
        const price = item.sellingPrice != 0 ? `${Number(item.sellingPrice).toLocaleString()} THB` : 'Contact seller';
        const numberOfPhotos = item.images.length;

        return (
          <Link key={item.hashId} href={`/listing/[hashId]`} as={`/listing/${item.hashId}`}>
            <a>
              <>
                <Box display={{ _: 'block', md: 'none' }}>
                  <ListingItem
                    imageUrl={imageUrl}
                    companyName={companyName}
                    title={title}
                    price={price}
                    hasBorder={true}
                    leftTopElement={<VipIconWithWhiteBorder size="18px" />}
                    rightBottomElement={
                      <Favorite item={item} itemHashIdToFavorite={itemHashIdToFavorite} onFavoriteIconClick={onFavoriteIconClick} />
                    }
                  />
                </Box>
                <Box display={{ _: 'none', md: 'block' }}>
                  <ListingGridItemMini
                    imageUrl={imageUrl}
                    seller={companyName}
                    title={title}
                    price={price}
                    rightTopElement={<VipIconWithWhiteBorder size="18px" />}
                    rightBottomElement={
                      <Favorite item={item} itemHashIdToFavorite={itemHashIdToFavorite} onFavoriteIconClick={onFavoriteIconClick} />
                    }
                    photoCount={numberOfPhotos}
                  />
                </Box>
              </>
            </a>
          </Link>
        );
      })}
    </VipListContainer>
  );
};

const StyledArticle = styled(Article)`
  flex: 0 0 auto;
  &:not(:first-child) {
    margin-left: ${({ theme }) => theme.space[2]};
  }
`;

const BannerContainer = styled(Box)`
  position: relative;
  background-color: ${({ theme }) => theme.colors.text};
  border-radius: 8px;
  overflow: hidden;
  box-sizing: border-box;
`;

const BannerTrapezoid = styled.div`
  position: absolute;
  box-sizing: border-box;
  border-color: transparent transparent ${({ theme }) => theme.colors.red} transparent;
  border-style: solid;

  right: 0;
  bottom: 0;
  border-width: 0 0 255px 61px;

  @media screen and (min-width: ${({ theme }) => theme.breakpoints['md']}) {
    top: 0px;
    margin-left: auto;
    border-width: 0px 320px 320px 320px;
    right: -640px;
    width: calc(68% + 320px);
  }
`;

const Banner = ({ t }: { t: TFunction }) => (
  <BannerContainer width="100%" height="261px">
    <Box position="relative" width={{ _: 1, md: '1015px' }} mx="auto" px={{ _: '26px', md: 4 }} pt={{ _: '26px', md: '34px' }}>
      <Box position="absolute" zIndex={2} width={{ _: '201px', md: '750px' }}>
        <Text
          mt={0}
          mb={0}
          fontSize={{ _: 6, md: '52px' }}
          lineHeight={{ _: 5, md: '68px' }}
          letterSpacing={{ _: 4, md: 6 }}
          color="white"
          fontWeight="bold"
        >
          {t(`Register today to start buying and selling vehicles`)}
        </Text>
        <Box mt={{ _: '11px', md: '22px' }} width={{ _: '174px', md: '216px' }}>
          <ButtonLink href="/signup" variant="secondary">
            {t(`REGISTER NOW`)}
          </ButtonLink>
        </Box>
      </Box>
    </Box>
    <BannerTrapezoid />
  </BannerContainer>
);

const HomeFlex = styled(Flex)`
  @media screen and (max-width: ${({ theme }) => theme.breakpoints['md']}) {
    width: 100%;
  }
  @media screen and (min-width: ${({ theme }) => theme.breakpoints['md']}) {
    width: ${calcHomeFlexWidth(3) - CONTAINER_PADDING}px;
  }
  @media screen and (min-width: ${calcHomeFlexWidth(4)}px) {
    width: ${calcHomeFlexWidth(4) - CONTAINER_PADDING}px;
  }
  @media screen and (min-width: ${calcHomeFlexWidth(5)}px) {
    width: ${calcHomeFlexWidth(5) - CONTAINER_PADDING}px;
  }
  @media screen and (min-width: ${calcHomeFlexWidth(6)}px) {
    width: ${calcHomeFlexWidth(6) - CONTAINER_PADDING}px;
  }
  @media screen and (min-width: ${calcHomeFlexWidth(7)}px) {
    width: ${calcHomeFlexWidth(7) - CONTAINER_PADDING}px;
  }
  @media screen and (min-width: ${calcHomeFlexWidth(8)}px) {
    width: 100%;
  }
`;

interface IndexPageProps extends WithTranslation {
  router: SingletonRouter;
  numberOfItems: number;
  recentItems: ItemArrayResponse;
  vipItems: ItemArrayResponse;
  categoryLinks: Category[];
}

const IndexPage: NextPage<IndexPageProps> = (props: IndexPageProps) => {
  const { t, i18n, router, numberOfItems, categoryLinks, recentItems, vipItems } = props;

  const me = useAuthContext();

  const [itemHashIdToFavorite, setItemHashIdToFavorite] = React.useState<{ [key: string]: FavoriteResponse }>({});

  React.useEffect(() => {
    (async () => {
      if (me) {
        const itemHashIdToFavorite: { [key: string]: FavoriteResponse } = {};

        const itemHashIds = recentItems.map((i) => i.hashId).concat(vipItems.map((i) => i.hashId));
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

  const onSubmit = React.useCallback(
    (values: HomeSearchFormData) => {
      const categories = [values.category, values.subCategory].filter(Boolean).join(',');

      router.push({
        pathname: '/search',
        query: pickNotEmpty({
          categories: categories,
          brand: values.brand,
          year: values.year,
        }),
      });
    },
    [router],
  );

  const onFavoriteIconClick = React.useCallback(
    async (e: React.MouseEvent, item: ItemResponse) => {
      e.preventDefault();
      if (!me) {
        return router.push('/signin');
      }

      const favorite = itemHashIdToFavorite[item.hashId];

      let newFavorite: FavoriteResponse | null = null;

      if (favorite) {
        await favoriteApi.deleteFavorite(favorite.hashId);
      } else {
        newFavorite = await favoriteApi.createFavorite({ itemHashId: item.hashId });
      }

      setItemHashIdToFavorite((itemHashIdToFavorite) => {
        return {
          ...itemHashIdToFavorite,
          [item.hashId]: newFavorite,
        };
      });
    },
    [router, setItemHashIdToFavorite, me, itemHashIdToFavorite],
  );

  const homeSearchFormState = useHomeSearchFormState(t, i18n, categoryMasterApi, brandMasterApi);

  return (
    <Layout>
      <Head>
        <title>{t('Index')}</title>
      </Head>
      <Box pt={{ _: 0, md: '12px' }} px={{ _: 0, md: 3 }}>
        <TopLogo
          t={t}
          src="/static/images/top-page/top-logo.png"
          numberOfItems={numberOfItems}
          homeSearchFormState={homeSearchFormState}
          onSearchSubmit={onSubmit}
        />
      </Box>

      <Container>
        <Flex justifyContent="center">
          <HomeFlex flexDirection="column">
            <Box display={{ _: 'block', md: 'none' }}>
              <Text mt={0} mb={0} color="text" fontFamily="secondary">{`${t('Search')} ${numberOfItems.toLocaleString()} ${t(
                'listings',
              )}`}</Text>
              <Box mt={2}>
                <HomeSearchForm {...homeSearchFormState} onSubmit={onSubmit} />
              </Box>
            </Box>

            <Box mt={{ _: '44px', md: 2 }}>
              <Title
                mt={0}
                mb={0}
                textAlign="left"
                fontSize={{ _: '23px', md: '28px' }}
                lineHeight={{ _: '27px', md: '37px' }}
                letterSpacing="0.1px"
                fontWeight="bold"
                color="text"
              >
                {t(`Recently added`)}
              </Title>
              <Box mt={{ _: '21px', md: '15px' }}>
                <RecentListingList
                  items={recentItems}
                  onFavoriteIconClick={onFavoriteIconClick}
                  itemHashIdToFavorite={itemHashIdToFavorite}
                />
              </Box>
            </Box>

            <Box mt={{ _: 5, md: '82px' }}>
              <Title mt={0} mb={0} textAlign="left" fontSize="23px" lineHeight="27px" fontWeight="bold" color="text">
                {t(`Browse by category`)}
              </Title>
              <Box mt={{ _: 4, md: '46px' }}>
                <CategoryGrid categories={categoryLinks} />
              </Box>
            </Box>

            <Box mt={5}>{/* Advert */}</Box>

            <Box mt="34px">
              <Flex alignItems="center">
                <VipIcon size="30px" />
                <Title mt={0} mb={0} ml={2} textAlign="left" fontSize="23px" lineHeight="27px" fontWeight="bold" color="text">
                  {t(`Our VIP sellers`)}
                </Title>
              </Flex>
              <Box mt="21px">
                <VipSellerListingList
                  items={vipItems}
                  onFavoriteIconClick={onFavoriteIconClick}
                  itemHashIdToFavorite={itemHashIdToFavorite}
                />
              </Box>
            </Box>

            <Box mt="68px">{/* Advert */}</Box>

            <Box mt="36px">
              <Title mt={0} mb={0} textAlign="left" fontSize="23px" lineHeight="27px" fontWeight="bold" color="text">
                {t(`Learn more about T2H`)}
              </Title>
              <Box mt={4}>
                <HorizontalCollection height={{ _: '300px', md: '550px' }}>
                  {articles.map((article, index) => (
                    <StyledArticle key={index} photoUrl={article.imageUrl} title={t(article.title)} description={t(article.description)} />
                  ))}
                </HorizontalCollection>
              </Box>
            </Box>
          </HomeFlex>
        </Flex>
      </Container>
      <Box mt="20px" mb="42px" mx={3}>
        <Banner t={t} />
      </Box>
    </Layout>
  );
};

IndexPage.displayName = 'IndexPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps()(async (ctx) => {
  const itemApi = createApiClient(ItemApi, ctx);
  const categoryMasterApi = createApiClient(CategoryMasterApi, ctx);

  // TODO: try to improve performance
  // Use dynamicm Imports
  // https://web.dev/code-splitting-with-dynamic-imports-in-nextjs/
  const [recentItems, vipItems, estimatedCount, rootCategories] = await Promise.all([
    itemApi.getRecentItems(1, 21),
    itemApi.getVipItems(1, 33),
    itemApi.getEstimatedCount(),
    categoryMasterApi.getRootCategories({ page: 1, perPage: 100 }),
  ]);

  const categoryLinks = CATEGORY_LOGOS.map((cl) => {
    const category = rootCategories.find((rc) => rc.englishName === cl.key);

    return {
      name: cl?.name,
      image: cl?.image,
      url: `/search?categories=${category?.hashId}`,
    };
  });

  return {
    props: {
      namespacesRequired: ['common'],
      numberOfItems: estimatedCount,
      recentItems,
      vipItems,
      categoryLinks,
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], IndexPage);

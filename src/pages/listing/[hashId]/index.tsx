import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { compose, getFacebookShareUrl, getLineShareUrl } from '@common/utils';
import { withRouter, SingletonRouter } from 'next/router';
import { withTranslation } from '@server/i18n';
import { WithTranslation, TFunction } from 'next-i18next';
import { withAuth, RedirectAction, withAuthServerSideProps } from '@hocs/withAuth';
import Head from 'next/head';
import getConfig from 'next/config';
import styled from 'styled-components';
import moment from 'moment';
import { useAuthContext } from '@hocs/withAuth';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import Layout from '@containers/Layout';
import Box from '@components/layouts/Box';
import Flex from '@components/layouts/Flex';
import Separator from '@components/atoms/Separator';
import { Button, ButtonLink } from '@components/atoms/Button';
import { Text } from '@components/atoms/Text';
import ListingDetails from '@containers/ListingDetails';
import { FavoriteIcon, FavoriteBorderIcon, ShareIcon, PhoneIcon, RocketIcon, CheckCircleOutlineIcon } from '@components/atoms/IconButton';
import ActionBar from '@components/atoms/ActionBar';
import Snackbar from '@components/organisms/Snackbar';
import Dialog from '@components/molecules/Dialog';
import { createApiClient } from '@services/core';
import { CommentApi, FavoriteApi, ShopApi } from '@services/apis';
import {
  UserResponse,
  ItemResponse,
  FileResponse,
  CommentArrayResponse,
  BoostResponse,
  BoostStatus,
  BoostArrayResponse,
} from '@services/types';
import { getItemData } from '@services/facades/item';
import { getCommentByContextQueryHashId } from '@services/facades/comment';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';

const SimilarListings = dynamic(import('@containers/SimilarListings'), { ssr: false });

const NUMBER_OF_SIMILAR_ITEMS = 5;

export enum NotificationType {
  ListingUpdated = 'listing_updated',
  BoostScheduled = 'boost_scheduled',
  ListingReported = 'listing_reported',
}

const { serverRuntimeConfig } = getConfig();

const commentApi = createApiClient(CommentApi);
const favoriteApi = createApiClient(FavoriteApi);

const getNotification = (type: string) => {
  switch (type) {
    case NotificationType.ListingUpdated:
      return {
        type: 'success',
        message: 'Your listing has been updated',
      };
    case NotificationType.BoostScheduled:
      return {
        type: 'success',
        message: 'Listing boost scheduled',
      };
    case NotificationType.ListingReported:
      return {
        type: 'warning',
        message: 'Thank you for reporting this listing',
      };
    default:
      return null;
  }
};

interface Notification {
  type: 'success' | 'error';
  message: string;
}

const ActionButtonContainer = styled(Flex)`
  height: 48px;
`;

interface SellerActionBarProps {
  item: ItemResponse;
  boosts: BoostArrayResponse;
  t: TFunction;
}

const SellerActionBar = (props: SellerActionBarProps) => {
  const { t, item, boosts = [] } = props;
  const boost = boosts[0];

  return (
    <React.Fragment>
      <ActionBar p={3}>
        <Box width={{ _: 1, md: '968px' }} mx="auto">
          {!boost && (
            <Flex alignItems="center" justifyContent="space-between">
              <Box width={{ _: '90px', md: '133px' }}>
                <ButtonLink href={`/listing/${item.hashId}/edit`} variant="transparent" height="48px" borderRadius="24px">
                  <ActionButtonContainer alignItems="center" justifyContent="center">
                    <Box display={{ _: 'block', md: 'none' }}>{t(`Edit`)}</Box>
                    <Box display={{ _: 'none', md: 'block' }}>{t(`Edit listing`)}</Box>
                  </ActionButtonContainer>
                </ButtonLink>
              </Box>
              <Box width="180px">
                <ButtonLink href={`/listing/${item.hashId}/boost`} variant="contact" height="48px" borderRadius="24px">
                  <ActionButtonContainer alignItems="center" justifyContent="center">
                    <RocketIcon size="14px" color="white" />
                    <Box ml={1}>{t(`Boost this listing`)}</Box>
                  </ActionButtonContainer>
                </ButtonLink>
              </Box>
            </Flex>
          )}
          {boost && (
            <Flex flexDirection="column">
              <Flex alignItems="flex-end" justifyContent="space-between">
                <Box width={{ _: '90px', md: '133px' }}>
                  <ButtonLink href={`/listing/${item.hashId}/edit`} variant="transparent" height="48px" borderRadius="24px">
                    <ActionButtonContainer alignItems="center" justifyContent="center">
                      <Box display={{ _: 'block', md: 'none' }}>{t(`Edit`)}</Box>
                      <Box display={{ _: 'none', md: 'block' }}>{t(`Edit listing`)}</Box>
                    </ActionButtonContainer>
                  </ButtonLink>
                </Box>
                <Flex flexDirection={{ _: 'column', md: 'row' }} alignItems={{ _: 'flex-end', md: 'center' }}>
                  <Flex
                    flexDirection={{ _: 'row', md: 'column' }}
                    justifyContent={{ _: 'flex-end', md: 'center' }}
                    alignItems={{ md: 'flex-end' }}
                  >
                    <Text mt={0} mb={0} variant="small" color="#676767" fontFamily="secondary">
                      {t(`Remaing {{count}}/{{totalCount}}`, {
                        count: boost.totalCount - boost.remainCount,
                        totalCount: boost.totalCount,
                      })}
                    </Text>
                    <Box display={{ _: 'block', md: 'none' }}>
                      <Text mt={0} mb={0} variant="small" color="#676767" fontFamily="secondary">
                        {t(`; Next {{boostTime}}`, {
                          boostTime: moment(boost.nextBoostTime).format('MM-DD HH:mm'),
                        })}
                      </Text>
                    </Box>
                    <Box display={{ _: 'none', md: 'block' }}>
                      <Text mt={0} mb={0} variant="small" color="#676767" fontFamily="secondary">
                        {t(`Next {{boostTime}}`, {
                          boostTime: moment(boost.nextBoostTime).format('MM-DD HH:mm'),
                        })}
                      </Text>
                    </Box>
                  </Flex>
                  <Box width="180px" ml={{ _: 0, md: 2 }} mt={{ _: 2, md: 0 }}>
                    <ButtonLink variant="boosted" height="48px" borderRadius="24px">
                      <ActionButtonContainer alignItems="center" justifyContent="center">
                        <RocketIcon size="14px" color="white" />
                        <Box ml={1}>{t(`Listing boosted`)}</Box>
                      </ActionButtonContainer>
                    </ButtonLink>
                  </Box>
                </Flex>
              </Flex>
            </Flex>
          )}
        </Box>
      </ActionBar>
    </React.Fragment>
  );
};

interface NotSellerActionBarProps {
  t: TFunction;
  isFavorited: boolean;
  isPhoneNumberVisible: boolean;
  onShareIconClick: React.MouseEventHandler;
  onFavoriteIconClick: React.MouseEventHandler;
  onViewSellerProfileClick: React.MouseEventHandler;
}

const NotSellerActionBar = (props: NotSellerActionBarProps) => {
  const { t, isFavorited, isPhoneNumberVisible, onShareIconClick, onFavoriteIconClick, onViewSellerProfileClick } = props;

  return (
    <ActionBar p={3} display={{ _: 'block', md: 'none' }}>
      <Flex alignItems="center">
        <Box>
          {isFavorited ? (
            <FavoriteIcon size="24px" color="label" onClick={onFavoriteIconClick} />
          ) : (
            <FavoriteBorderIcon size="24px" color="label" onClick={onFavoriteIconClick} />
          )}
        </Box>
        <Box ml={3}>
          <ShareIcon size="22px" color="label" onClick={onShareIconClick} />
        </Box>
        {isPhoneNumberVisible !== true && (
          <Box ml="auto" width="144px">
            <Button variant="contact" height="48px" borderRadius="24px" onClick={onViewSellerProfileClick}>
              <ActionButtonContainer alignItems="center" justifyContent="center">
                <PhoneIcon size="14px" color="white" />
                <Box ml={1}>{t(`Contact seller`)}</Box>
              </ActionButtonContainer>
            </Button>
          </Box>
        )}
      </Flex>
    </ActionBar>
  );
};

const SnackbarContainer = styled.div`
  position: absolute;
  bottom: 200px;
  & > div {
    margin-bottom: 100px;
  }
`;

interface NotificationSnackbarProps {
  t: TFunction;
  notification: Notification;
  isVisible: boolean;
  onClose: () => void;
}

const NotificationSnackbar = ({ t, notification, isVisible, onClose }: NotificationSnackbarProps) => {
  return (
    <SnackbarContainer>
      <Snackbar variant={notification.type} isVisible={isVisible} onClose={onClose} isCloseIconHidden={true} borderRadius="24px">
        <Flex alignItems="center">
          <CheckCircleOutlineIcon size="24px" color="white" />
          <Box ml={2}>{t(notification.message)}</Box>
        </Flex>
      </Snackbar>
    </SnackbarContainer>
  );
};

const SocialButton = styled(Button)`
  &:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.space[2]};
  }
`;

interface ShareDialogProps {
  t: TFunction;
  isOpen: boolean;
  onDialogClose: (e: React.SyntheticEvent) => void;
  dialogTop: number;
  facebookShareUrl: string;
  lineShareUrl: string;
}

const ShareDialog = (props: ShareDialogProps) => {
  const { t, isOpen, onDialogClose, dialogTop, facebookShareUrl, lineShareUrl } = props;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onDialogClose}
      title={t(`Share`)}
      showsTitle={true}
      showsCloseIcon={false}
      showsActionButton={false}
      ContainerProps={{ top: `calc(${dialogTop}px + 16px)` }}
    >
      <Flex flexDirection="column">
        <Box mb={3} width="100%">
          <SocialButton variant="facebook" onClick={() => window.open(facebookShareUrl, '_blank')}>
            {t('Share on Facebook')}
          </SocialButton>
        </Box>
        <Box width="100%">
          <SocialButton variant="line" onClick={() => window.open(lineShareUrl, '_blank')}>
            {t('Share on Line')}
          </SocialButton>
        </Box>
      </Flex>
    </Dialog>
  );
};

const BannerContainer = styled(Box)`
  position: relative;
  width: calc(100% - 64px);
  height: 320px;
  margin-left: 32px;
  margin-right: 32px;
  background-color: #fdd76f;
  border-radius: 8px;
  overflow: hidden;
  box-sizing: border-box;
`;

const BannerTrapezoid = styled.div`
  position: absolute;
  top: 0px;
  right: -320px;
  box-sizing: border-box;
  width: calc(68% + 320px);
  margin-left: auto;
  border-bottom: 320px solid #fdca40;
  border-left: 320px solid transparent;
  border-right: 320px solid transparent;
`;

const Banner = ({ t }: { t: TFunction }) => (
  <BannerContainer>
    <BannerTrapezoid />
    <Box my="80px" ml="13%" position="relative">
      <Box position="absolute" left={0} top={0} width="100%" height="100%">
        <Text mt={0} mb={0} color="text" fontSize="52px" lineHeight="68px" letterSpacing="0.2px" fontWeight="bold">
          {t(`No.1 marketplace`)}
        </Text>
        <Text mt={0} mb={0} color="text" variant="large" fontFamily="secondary">
          {t(`The worldwide marketplace for used heavy equipment.`)}
        </Text>
        <Flex mt={3}>
          <Box width="180px">
            <ButtonLink href={'/'} variant="contact">
              {t(`Get started`)}
            </ButtonLink>
          </Box>
          <Box ml={3} width="180px">
            <ButtonLink href={'/'} variant="transparent">
              {t(`Learn more`)}
            </ButtonLink>
          </Box>
        </Flex>
      </Box>
    </Box>
  </BannerContainer>
);

interface BreadcrumbListProps {
  t: TFunction;
  items: { name: string; url: string }[];
}

const BreadcrumbLinkText = styled(Text)`
  cursor: pointer;
`;

const BreadcrumbList = ({ t, items }: BreadcrumbListProps) => {
  return (
    <>
      <Box height="48px" maxWidth="960px" mx="auto">
        <Flex mx={3} height="100%" alignItems="center">
          {items.map((item, index) => {
            if (index < items.length - 1) {
              return (
                <>
                  <Link key={index} href={item.url}>
                    <BreadcrumbLinkText mt={0} mb={0} color="menuText" fontFamily="secondary">
                      {t(item.name)}
                    </BreadcrumbLinkText>
                  </Link>
                  <Text mt={0} mb={0} mx={2} color="menuText" fontFamily="secondary">
                    {`>`}
                  </Text>
                </>
              );
            }

            return (
              <Link key={index} href={item.url}>
                <BreadcrumbLinkText mt={0} mb={0} color="menuText" fontFamily="secondary">
                  {t(item.name)}
                </BreadcrumbLinkText>
              </Link>
            );
          })}
        </Flex>
      </Box>
      <Box mt="auto">
        <Separator height="" borderBottomColor="#F3F3F3" />
      </Box>
    </>
  );
};

interface ListingDetailsPageProps extends WithTranslation {
  router: SingletonRouter;
  itemId: string;
  item: ItemResponse;
  boosts: BoostArrayResponse;
  seller: UserResponse;
  defaultComments: CommentArrayResponse;
  notification?: Notification;
  facebookShareUrl: string;
  lineShareUrl: string;
  defaultFavoriteHashId?: string;
  shopImageSrcs: string[];
}

const ListingDetailsPage: NextPage<ListingDetailsPageProps> = (props: ListingDetailsPageProps) => {
  const { t, router, item, boosts, seller, defaultComments, facebookShareUrl, lineShareUrl, shopImageSrcs } = props;
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();
  const me = useAuthContext();
  const isSeller = me !== undefined && me.hashId === item.userHashId;

  const [favorite, setFavorite] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      if (me) {
        const favorites = await favoriteApi.getMyFavorites({
          page: 1,
          perPage: 1,
          itemIds: [item.hashId],
        });

        setFavorite(favorites[0]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [comments, setComments] = React.useState(defaultComments);
  const onCommentSubmit = React.useCallback(
    async (message: string, isAnonymous: boolean) => {
      setGlobalSpinner(true);
      try {
        await commentApi.createComment({
          message: message,
          visibility: !isAnonymous,
          receiverHashId: seller.hashId,
          itemHashId: item.hashId,
        });
        const newComments = (await commentApi.getCommentsByItemHashId(item.hashId)).reverse();

        setComments(newComments);
        setGlobalSnackbar({ message: t("You've successfully added your question"), variant: 'success' });
      } catch (err) {
        setGlobalSnackbar({ message: t(err.message), variant: 'error' });
      } finally {
        setGlobalSpinner(false);
      }
    },
    [setGlobalSpinner, setGlobalSnackbar, setComments, item, seller, t],
  );

  const onFavoriteIconClick = React.useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      if (!me) {
        return router.push('/signin');
      }

      if (favorite) {
        await favoriteApi.deleteFavorite(favorite.hashId);
        setFavorite(null);
      } else {
        const favorite = await favoriteApi.createFavorite({ itemHashId: item.hashId });

        setFavorite(favorite);
      }
    },
    [item, favorite, setFavorite, me, router],
  );

  const [notification] = React.useState<Notification>(props.notification);
  const [isNotificationVisible, setIsNotificationVisible] = React.useState(true);
  const onNotificationClose = React.useCallback(() => {
    setIsNotificationVisible(false);
  }, [setIsNotificationVisible]);

  const [isShareDialogOpen, setIsShareDialogOpen] = React.useState(false);
  const [dialogTop, setDialogTop] = React.useState(0);
  const onShareIconClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setDialogTop(document?.body.scrollTop || document?.documentElement.scrollTop || 0);
      setIsShareDialogOpen(true);
    },
    [setDialogTop, setIsShareDialogOpen],
  );
  const onDialogClose = React.useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      setIsShareDialogOpen(false);
    },
    [setIsShareDialogOpen],
  );

  const [isPhoneNumberVisible, setIsPhoneNumberVisible] = React.useState(false);
  const onViewSellerProfileClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsPhoneNumberVisible(true);
    },
    [setIsPhoneNumberVisible],
  );

  const breadcrumbItems = [
    { name: 'Bread', url: '#' },
    { name: 'Crumbs', url: '#' },
    { name: 'Search', url: '#' },
  ];

  return (
    <React.Fragment>
      <Layout>
        <Head>
          <title>{item.title}</title>
        </Head>
        <Box display={{ _: 'none', md: 'block' }}>
          <BreadcrumbList t={t} items={breadcrumbItems} />
        </Box>
        <Flex width="100%" justifyContent="center">
          <ListingDetails
            item={item}
            seller={item.user}
            shopImageSrcs={shopImageSrcs}
            isContactSellerVisible={true}
            isPhoneNumberVisible={isPhoneNumberVisible}
            onViewSellerProfileClick={onViewSellerProfileClick}
            isCommentsBoxVisible={true}
            comments={comments}
            onCommentSubmit={onCommentSubmit}
          />
        </Flex>

        <Box width={{ _: 1, md: '960px' }} mx={{ _: 0, md: 'auto' }} mt={3} mb={3}>
          <SimilarListings item={item} numberOfItems={NUMBER_OF_SIMILAR_ITEMS} />
        </Box>

        <Box mb={3} display={{ _: 'none', md: 'block' }}>
          <Banner t={t} />
        </Box>
      </Layout>
      {notification && (
        <NotificationSnackbar t={t} notification={notification} isVisible={isNotificationVisible} onClose={onNotificationClose} />
      )}
      {isSeller === true ? (
        <SellerActionBar t={t} item={item} boosts={boosts} />
      ) : (
        <NotSellerActionBar
          t={t}
          isFavorited={!!favorite}
          isPhoneNumberVisible={isPhoneNumberVisible}
          onShareIconClick={onShareIconClick}
          onFavoriteIconClick={onFavoriteIconClick}
          onViewSellerProfileClick={onViewSellerProfileClick}
        />
      )}
      <ShareDialog
        t={t}
        isOpen={isShareDialogOpen}
        onDialogClose={onDialogClose}
        dialogTop={dialogTop}
        facebookShareUrl={facebookShareUrl}
        lineShareUrl={lineShareUrl}
      />
    </React.Fragment>
  );
};

ListingDetailsPage.displayName = 'ListingDetailsPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.None)(async (ctx) => {
  try {
    const [{ itemData }, defaultComments] = await Promise.all([getItemData(ctx), getCommentByContextQueryHashId(ctx)]);
    const notificationType = Array.isArray(ctx.query.notificationType) ? ctx.query.notificationType[0] : ctx.query.notificationType;
    const notification = getNotification(notificationType);
    const req = ctx.req as any;
    const url = `${req.protocol}://${req?.get('host')}${req.originalUrl}`;
    const facebookAppId = serverRuntimeConfig?.facebook?.appId;
    const facebookShareUrl = getFacebookShareUrl(facebookAppId, url);
    const lineShareUrl = getLineShareUrl(url);
    const boosts = (itemData.boosts || []).filter((boost: BoostResponse) => boost.status !== BoostStatus.Finished);
    const shopApi = createApiClient(ShopApi, ctx);
    const shop = await shopApi.getShopByUserHashId(itemData.userHashId).catch((error) => {
      console.error(error);

      return undefined;
    });
    const shopImageSrcs = shop ? shop.images.slice(0, 5).map((img: FileResponse) => img.url) : [];

    return {
      props: {
        namespacesRequired: ['common'],
        item: itemData,
        boosts,
        seller: itemData.user,
        defaultComments: defaultComments,
        notification,
        facebookShareUrl,
        lineShareUrl,
        shopImageSrcs,
      },
    };
  } catch (err) {
    console.error(err);

    const statusCode = err.statusCode || 500;

    ctx.res.statusCode = statusCode;

    return {
      props: { error: { message: err.message, statusCode } },
    };
  }
});

export default compose([withAuth, withRouter, withTranslation('common')], ListingDetailsPage);

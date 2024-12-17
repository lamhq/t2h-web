import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { compose } from '@common/utils';
import { withRouter, SingletonRouter } from 'next/router';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'next-i18next';
import { withAuth, RedirectAction, withAuthServerSideProps, useAuthContext } from '@hocs/withAuth';
import Head from 'next/head';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import { getItemData } from '@services/facades/item';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import Box from '@components/layouts/Box';
import Flex from '@components/layouts/Flex';
import { Button } from '@components/atoms/Button';
import { Text } from '@components/atoms/Text';
import { SubTitle, OuterTitle } from '@components/atoms/Title';
import { CheckCircleIcon } from '@components/atoms/IconButton';
import CheckBox from '@components/molecules/CheckBox';
import Balance from '@components/molecules/Balance';
import InputLabel from '@components/atoms/InputLabel';
import { InputDate, InputTime } from '@components/molecules/Time';
import ListingItem from '@components/molecules/ListingItem';
import BoostTypeRadioButtons, { BoostType } from '@components/organisms/BoostTypeRadioButtons';
import { ItemResponse, ItemStatus, BoostType as ApiBoostType } from '@services/types';
import { createApiClient } from '@services/core';
import { BoostApi } from '@services/apis';
import ListingItemBig from '@components/molecules/ListingItemBig';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';

const boostApi = createApiClient(BoostApi);

const InputTimeContainer: React.FC = ({ children }: { children: React.ReactNode }) => {
  return <MuiPickersUtilsProvider utils={MomentUtils}>{children}</MuiPickersUtilsProvider>;
};

const useTimeState = () => {
  const [data, setData] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const onDataChange = React.useCallback(
    (date: moment.Moment) => {
      setData(date);
    },
    [setData],
  );
  const onOpen = React.useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);
  const onClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return [data, isOpen, onDataChange, onOpen, onClose] as const;
};

interface ListingBoostPageProps extends WithTranslation {
  router: SingletonRouter;
  item: ItemResponse;
}

const ListingBoostPage: NextPage<ListingBoostPageProps> = (props: ListingBoostPageProps) => {
  const { t, router, item } = props;
  const me = useAuthContext();
  const { user } = item;

  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();

  const [boostType, setBoostType] = React.useState(null);
  const onBoostTypeChange = React.useCallback((value: string | number) => {
    setBoostType(value);
  }, []);

  const [startDate, isInputDateOpen, onStartDateChange, onInputDateOpen, onInputDateClose] = useTimeState();

  const [startTime, isInputTimeOpen, onStartTimeChange, onInputTimeOpen, onInputTimeClose] = useTimeState();

  const [isDontAskAgainChecked, setIsDntAskAgainChecked] = React.useState(false);
  const onIsDontAskAgainChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      //todo: save this value to localstorage
      setIsDntAskAgainChecked(e.target.checked);
    },
    [setIsDntAskAgainChecked],
  );

  const onBoostClick = React.useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      setGlobalSpinner(true);
      try {
        const type = boostType === BoostType.Instant ? ApiBoostType.Instant : ApiBoostType.Schedule;

        if (type === ApiBoostType.Schedule && (!startDate || !startTime)) {
          throw new Error(`Missing Date`);
        }

        const period = type === ApiBoostType.Schedule ? Number.parseInt(boostType) : 1;

        let startBoostTime: string = '';
        let finishBoostTime: string = '';
        let date;

        if (type === ApiBoostType.Instant) {
          date = moment();
        } else {
          date = moment(startDate);
          date.set({ hour: startTime.hour(), minute: startTime.minute(), second: 0, millisecond: 0 });
        }

        startBoostTime = date.toISOString();
        finishBoostTime = date.clone().add(period, 'days').toISOString();

        await boostApi.boostItem(item.hashId, {
          type,
          startBoostTime,
          finishBoostTime,
        });

        setGlobalSnackbar({ message: t("You've successfully boosted your listing"), variant: 'success' });
        await router.push(`/listing/${encodeURIComponent(item.hashId)}?notif=boosted`);
      } catch (err) {
        setGlobalSnackbar({ message: t(err.message), variant: 'error' });
      } finally {
        setGlobalSpinner(false);
      }
    },
    [router, setGlobalSpinner, setGlobalSnackbar, item, boostType, startDate, startTime, t],
  );

  return (
    <Layout>
      <Head>
        <title>{t('Boost listing')}</title>
      </Head>
      <OuterTitle fontSize="23px" color="#333" textAlign="left">
        <Flex flexDirection={{ _: 'column', md: 'row' }} justifyContent="center" mt={0} mb={0}>
          <Box width={{ _: 1, md: '968px' }}>{t('Boost listing')}</Box>
        </Flex>
      </OuterTitle>
      <Container>
        <Flex flexDirection={{ _: 'column', md: 'row' }} justifyContent="center" mt={0} mb={0}>
          <Box width={{ _: 1, md: '500px' }}>
            <Box display={{ _: 'none', md: 'block' }}>
              <Flex justifyContent="center">
                <Balance iconColor="yellow" variant="normal" amount={user?.balance || 0} caption={t('Current balance')} />
              </Flex>
            </Box>
            <Box display={{ _: 'block', md: 'none' }}>
              <Flex alignItems="center">
                <SubTitle mt={0} mb={0} color="menuText" fontSize="19px" lineHeight="23px" fontFamily="secondary">
                  {t(`Wallet balance`)}
                </SubTitle>
                <Box ml="auto">
                  <Balance iconColor="yellow" variant="small" amount={me.balance} />
                </Box>
              </Flex>
            </Box>

            <Box display={{ _: 'block', md: 'none' }} mt={3}>
              <ListingItem
                imageUrl={item.imageUrl}
                title={item.title}
                tags={[item.productionYear.toString(), item.transmission]}
                price={`${item.sellingPrice} THB`}
                leftTopElement={item.status === ItemStatus.Published ? <CheckCircleIcon color="success" size="18px" /> : null}
              />
            </Box>
            <Box display={{ _: 'none', md: 'block' }} mt={4}>
              <ListingItemBig
                imageUrl={item.imageUrl}
                title={item.title}
                tags={[item.productionYear.toString(), item.transmission]}
                price={`${item.sellingPrice} THB`}
              />
            </Box>

            <Box mt={5}>
              <BoostTypeRadioButtons boostType={boostType} onBoostTypeChange={onBoostTypeChange} />
            </Box>

            {boostType !== BoostType.Instant && boostType && (
              <Flex mt={5} flexDirection="column">
                <SubTitle mt={3} mb={0} color="menuText" fontSize="19px" lineHeight="23px" textAlign="left">
                  {t(`Boost start date/time`)}
                </SubTitle>
                <InputTimeContainer>
                  <Box mt={2}>
                    <InputLabel>{t(`Schedule start date`)}</InputLabel>
                    <InputDate
                      value={startDate}
                      onChange={onStartDateChange}
                      open={isInputDateOpen}
                      onOpen={onInputDateOpen}
                      onClose={onInputDateClose}
                      minDate={new Date()}
                    />
                  </Box>

                  <Box mt={2}>
                    <InputLabel>{t(`Schedule start time`)}</InputLabel>
                    <InputTime
                      value={startTime}
                      onChange={onStartTimeChange}
                      open={isInputTimeOpen}
                      onOpen={onInputTimeOpen}
                      onClose={onInputTimeClose}
                    />
                  </Box>
                </InputTimeContainer>
              </Flex>
            )}

            <Box mt={3}>
              <Text color="menuText" fontFamily="secondary">
                {t(`You are about to schedule a post to be boosted, you can delete this from your account settings later.`)}
              </Text>
            </Box>

            <Box mt={3}>
              <CheckBox
                name="all_categories"
                label={'Don’t ask to again'}
                checked={isDontAskAgainChecked}
                onChange={onIsDontAskAgainChange}
              />
            </Box>

            <Box mt={3}>
              <Box display={{ _: 'none', md: 'block' }}>
                <Flex justifyContent="flex-end">
                  <Button variant="boost" onClick={onBoostClick} block={false}>
                    {t('Boost listing')}
                  </Button>
                </Flex>
              </Box>
              <Box display={{ _: 'block', md: 'none' }}>
                <Button variant="boost" onClick={onBoostClick}>
                  {t('Boost listing')}
                </Button>
              </Box>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Layout>
  );
};

ListingBoostPage.displayName = 'ListingBoostPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.None)(async (ctx) => {
  const { itemData } = await getItemData(ctx);

  return {
    props: {
      namespacesRequired: ['common'],
      item: itemData,
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], ListingBoostPage);

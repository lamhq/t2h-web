/* eslint-disable no-restricted-imports */
import React from 'react';
import Head from 'next/head';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'react-i18next';
import { compose } from '@common/utils';
import { SubTitle, OuterTitle } from '@components/atoms/Title';
import Flex from '@components/layouts/Flex';
import { Tabs, Tab, TabPanel } from '@components/molecules/Tab';
import CoinMenuItem from '@components/molecules/CoinMenuItem';
import { withStyles } from '@material-ui/core/styles';
import CoinHistoryListItem from '@components/molecules/CoinHistoryListItem';
import { MonetizationOnIcon, RocketIcon } from '@components/atoms/IconButton';
import Pagination from '@components/molecules/Pagination';
import Balance from '@components/molecules/Balance';

export const StyledTab = withStyles({
  root: {
    flexGrow: 1,
    textTransform: 'none',
    maxWidth: 'unset',
    fontWeight: 'normal',
    fontSize: '16px',
    marginRight: 0,
    '&:hover': {
      opacity: 1,
    },
    '&$selected': {
      fontWeight: 'bold',
    },
  },
  selected: {},
})(Tab);

const Page1: React.FC<WithTranslation> = ({ t }: WithTranslation) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Layout>
      <Head>
        <title>{t('Coins')}</title>
      </Head>
      <OuterTitle fontSize="19px" color="darkGrey" textAlign="left">
        {t('Coins')}
      </OuterTitle>
      <Container>
        <Flex justifyContent="center">
          <Balance iconColor="red" variant="normal" amount={420} caption={t('Current balance')} />
        </Flex>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <StyledTab label={t('Buy coins')} />
          <StyledTab label={t('History')} />
        </Tabs>
        <TabPanel value={activeTab} index={0}>
          <CoinMenuItem href="/" amount="25 coins" description="1 boost" price="100 THB" />
          <CoinMenuItem href="/" amount="50 coins" description="2 boosts" price="200 THB" />
          <CoinMenuItem href="/" amount="100 coins" description="4 boosts" price="400 THB" />
          <CoinMenuItem href="/" amount="200 coins" description="32 boosts +24h no ads!" price="800 THB" />
          <CoinMenuItem href="/" amount="400 coins" description="75 boosts + 3 days VIP!" price="1,600 THB" label="Most popular!" />
          <CoinMenuItem href="/" amount="800 coins" description="135 boosts + 7 days VIP!" price="3,200 THB" />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <SubTitle textAlign="left" fontSize={3} mt={4}>
            {t('Today')}
          </SubTitle>
          <CoinHistoryListItem
            icon={<MonetizationOnIcon color="boost" size="16px" />}
            title="Purchased - 16:24"
            description="25 coins"
            cost="100 THB"
          />
          <CoinHistoryListItem
            icon={<RocketIcon color="boost" size="16px" />}
            title="Boosted - 16:24"
            description="ขาย รถขุด KOMATSU รุ่น PC20-6- มือสองญี่ปุ่น"
            cost="25 coins"
          />
          <CoinHistoryListItem
            icon={<MonetizationOnIcon color="boost" size="16px" />}
            title="Purchased - 16:24"
            description="25 coins"
            cost="100 THB"
          />

          <SubTitle textAlign="left" fontSize={3} mt={4}>
            {t('Tuesday 25th ')}
          </SubTitle>
          <CoinHistoryListItem
            icon={<MonetizationOnIcon color="boost" size="16px" />}
            title="Purchased - 16:24"
            description="25 coins"
            cost="100 THB"
          />
          <CoinHistoryListItem
            icon={<RocketIcon color="boost" size="16px" />}
            title="Boosted - 16:24"
            description="ขาย รถขุด KOMATSU รุ่น PC20-6- มือสองญี่ปุ่น"
            cost="25 coins"
          />
          <CoinHistoryListItem
            icon={<MonetizationOnIcon color="boost" size="16px" />}
            title="Purchased - 16:24"
            description="25 coins"
            cost="100 THB"
          />
          <Flex justifyContent="flex-end">
            <Pagination page={2} pageSize={10} totalCount={100} onChange={() => 1} />
          </Flex>
        </TabPanel>
      </Container>
    </Layout>
  );
};

export default compose([withTranslation('common')], Page1);

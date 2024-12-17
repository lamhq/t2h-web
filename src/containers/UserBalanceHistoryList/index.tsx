import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { withTranslation, WithTranslation } from 'react-i18next';
import { BalanceHistoryApi } from '@services/apis';
import { BalanceHistoryArrayResponse } from '@services/types';
import CoinHistoryListItem from '@components/molecules/CoinHistoryListItem';
import { MonetizationOnIcon, RocketIcon } from '@components/atoms/IconButton';

const UserBalanceHistoryListWrapper = styled.div``;

interface UserBalanceHistoryListProps extends WithTranslation {
  historyApi: ReturnType<typeof BalanceHistoryApi>;
  defaultHistories?: BalanceHistoryArrayResponse;
}

const UserBalanceHistoryList: React.FC<UserBalanceHistoryListProps> = ({
  t,
  defaultHistories,
  historyApi,
}: UserBalanceHistoryListProps) => {
  const [histories, setHistories] = useState(defaultHistories);

  useEffect(() => {
    const fetchInitialHistories = async () => {
      if (histories.length === 0) {
        // TODO: Pagination if needed
        const [response] = await historyApi.getBalanceHistories();

        setHistories(response);
      }
    };

    fetchInitialHistories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserBalanceHistoryListWrapper>
      {histories.map((h, idx) => {
        const icon = h.type === 'consumed' ? <RocketIcon color="boost" size="16px" /> : <MonetizationOnIcon color="boost" size="16px" />;
        // TODO: timezone
        const title =
          `${t(h.type)} - ${moment(h.createdAt).format('DD-MM-YYYY')}` + (h.type === 'purchased' ? ` - ${h.purchasePrice / 100} THB` : '');
        const description = h.note ?? '-';
        const cost = `${h.coin} coins`;

        return <CoinHistoryListItem key={idx} icon={icon} title={title} description={t(description)} cost={cost} />;
      })}
    </UserBalanceHistoryListWrapper>
  );
};

UserBalanceHistoryList.displayName = 'UserBalanceHistoryList';

UserBalanceHistoryList.defaultProps = {
  defaultHistories: [],
};

export default withTranslation('common')(UserBalanceHistoryList);

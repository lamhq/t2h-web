import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import Balance, { BalanceVariant } from '@components/molecules/Balance';
import { useAuthContext } from '@hocs/withAuth';

interface UserBalanceProps extends WithTranslation {
  variant?: BalanceVariant;
}

const UserBalance: React.FC<UserBalanceProps> = ({ t, variant }: UserBalanceProps) => {
  const user = useAuthContext();

  return <Balance iconColor="red" variant={variant} amount={user?.balance || 0} caption={t('Current balance')} />;
};

UserBalance.displayName = 'UserBalance';

UserBalance.defaultProps = {
  variant: 'normal',
};

export default withTranslation('common')(UserBalance);

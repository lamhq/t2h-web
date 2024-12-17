import React, { useRef } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { SingletonRouter, withRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { WithTranslation } from 'next-i18next';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import { AppLogo } from '@components/atoms/AppLogo';
import Dropdown from '@components/molecules/Dropdown';
import InputText from '@components/molecules/InputText';
import { AccountCircleIcon } from '@components/atoms/IconButton';
import { ButtonLink } from '@components/atoms/Button';
import { SearchIcon } from '@components/atoms/IconButton';
import { Notification } from '@components/molecules/NotificationList';
import AccountPopover from './AccountPopover';
import NotificationPopover from './NotificationPopover';
import { HeaderUser } from '../types';

const OPTIONS = [
  { label: 'All vehicles', value: '' },
  { label: 'Long Truck', value: '0' },
  { label: 'Big Truck', value: '1' },
  { label: 'Small Truck', value: '2' },
  { label: 'LT A1', value: '3' },
  { label: 'LT A2', value: '4' },
  { label: 'BT B1', value: '5' },
  { label: 'ST C1', value: '6' },
  { label: 'LT A2', value: '7' },
];

const LowerHeaderContainer = styled(Flex)`
  height: 60px;
  background: #ffffff;
  box-shadow: 0 -1px 0px 0px #ececec inset;
  padding-left: 15.15px;
  padding-right: 24px;
  box-sizing: border-box;
`;

const AppLogoContainer = styled(Box)`
  svg {
    width: 142.87px;
    height: 43.68px;
  }
`;

const DropdownContainer = styled(Box)`
  & > div > div {
    background: ${({ theme }) => theme.colors.boxBackgroundColor};
  }
`;

const SearchBoxContainer = styled(Box)`
  width: 400px;
`;

const SearchBox = styled(InputText)`
  background: ${({ theme }) => theme.colors.boxBackgroundColor};
`;

interface AccountIconProps {
  user?: HeaderUser;
}

const AccountIcon = ({ user }: AccountIconProps) => {
  return (
    <>
      {user ? (
        <AccountPopover user={user} />
      ) : (
        <Link href="/signin">
          <a>
            <AccountCircleIcon size="24px" />
          </a>
        </Link>
      )}
    </>
  );
};

interface LowerHeaderProps extends WithTranslation {
  user?: HeaderUser;
  notifications: Notification[];
  router: SingletonRouter;
}

const LowerHeader: React.FC<LowerHeaderProps> = ({ t, i18n, user, notifications, router }: LowerHeaderProps) => {
  const isLogin = user !== undefined;
  const isSeller = isLogin && user.isBuyer !== true;
  const q = (router?.query?.q || '').toString();
  const category = router.query.categories ? router.query.categories[router.query.categories.length - 1] : null;
  const formRef = useRef<HTMLFormElement>();
  const { handleSubmit, register, getValues, reset } = useForm({
    mode: 'onChange',
    defaultValues: {
      q,
      category,
    },
  });

  const options = React.useMemo(() => {
    return OPTIONS.map((opt) => ({ ...opt, label: t(opt.label) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, i18n.language]);

  const onSubmit = React.useCallback(
    ({ q, category }) => {
      router.push({ pathname: '/search', query: { q, categories: category } });
    },
    [router],
  );

  React.useEffect(() => {
    reset({
      q,
      category,
    });
  }, [reset, q, category]);

  return (
    <LowerHeaderContainer alignItems="center">
      <AppLogoContainer>
        <Link href="/">
          <a>
            <AppLogo />
          </a>
        </Link>
      </AppLogoContainer>

      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <Flex>
          <DropdownContainer ml="43px">
            <Dropdown
              ref={register}
              name="category"
              options={options}
              placeholder={t(`All vehicles`)}
              defaultValue={getValues('category')}
            />
          </DropdownContainer>
          <SearchBoxContainer ml={2} mr={2}>
            <SearchBox
              ref={register}
              type="text"
              name="q"
              placeholder={t(`Search brand, model or type`)}
              rightIcon={<SearchIcon size="20px" onClick={() => formRef.current && formRef.current.dispatchEvent(new Event('submit'))} />}
            />
          </SearchBoxContainer>
        </Flex>
      </form>

      <Flex ml="auto" alignItems="center">
        {isLogin && <NotificationPopover notifications={notifications} />}
        {isSeller && (
          <Box ml="27px" width="84px">
            <ButtonLink variant="secondary" href="/listing/add">
              {t(`Sell`)}
            </ButtonLink>
          </Box>
        )}
        <Box ml="16px">
          <AccountIcon user={user} />
        </Box>
      </Flex>
    </LowerHeaderContainer>
  );
};

LowerHeader.displayName = 'LowerHeader';

export default withRouter(withTranslation('common')(LowerHeader));

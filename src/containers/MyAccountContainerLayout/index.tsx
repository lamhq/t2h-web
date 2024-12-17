import React from 'react';
import styled from 'styled-components';
import { withRouter, SingletonRouter } from 'next/router';
import { position, PositionProps, layout, LayoutProps } from 'styled-system';
import { theme } from '@components/global/theme';
import breakpoints from '@components/global/breakpoints';
import MyAccountMenuList, { isMenuItemsType } from '@components/molecules/MyAccountMenuList';
import { useAuthContext } from '@hocs/withAuth';
import EmailVerificaitionAlertMessage from '@containers/EmailVerificaitionAlertMessage';
import Flex from '@components/layouts/Flex';
import { UserApi } from '@services/apis';
import Container from '@components/layouts/Container';
import MyAccountTitle from '@components/molecules/MyAccountTitle';

type MyAccountMenuListConatiner = PositionProps & LayoutProps;

const MyAccountMenuListConatiner = styled.div<MyAccountMenuListConatiner>`
  ${position}
  ${layout}
  width: 300px;
  margin-right: 16px;
  position: sticky;
  height: max-content;
`;

MyAccountMenuListConatiner.defaultProps = {
  top: { _: theme.space[3], md: theme.space[4] },
};

const MyAccountBodyContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
`;

interface MyAccountContainerLayoutProps {
  children?: React.ReactNode;
  userApi: ReturnType<typeof UserApi>;
  title: string;
  router: SingletonRouter;
}

const MyAccountContainerLayout: React.FC<MyAccountContainerLayoutProps> = (props: MyAccountContainerLayoutProps) => {
  const { title, userApi, router, children } = props;
  const user = useAuthContext();
  const selectedItem = (() => {
    const location = router.pathname.startsWith('/myaccount/') ? router.pathname.replace('/myaccount/', '') : undefined;

    return isMenuItemsType(location) ? location : undefined;
  })();

  return (
    <React.Fragment>
      {!user.isEmailVerified && <EmailVerificaitionAlertMessage userApi={userApi} />}
      <MyAccountTitle>{title}</MyAccountTitle>
      <Container>
        <Flex justifyContent="center">
          <Flex width={{ _: 1, lg: breakpoints.lg }}>
            <MyAccountMenuListConatiner display={{ _: 'none', md: 'block' }}>
              <MyAccountMenuList user={user} selectedItem={selectedItem} />
            </MyAccountMenuListConatiner>
            <MyAccountBodyContainer>{children}</MyAccountBodyContainer>
          </Flex>
        </Flex>
      </Container>
    </React.Fragment>
  );
};

export default withRouter(MyAccountContainerLayout);

import { ParsedUrlQuery } from 'querystring';
import React, { createContext, useState, useContext, useEffect } from 'react';
import nextCookie from 'next-cookies';
import { NextPage, GetServerSideProps, GetServerSidePropsResult, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { isChrome } from '@common/utils/browser';
import { isAjax } from '@common/server';
import { pickNotEmpty } from '@common/utils';
import { ServerSideError } from '@common/utils/error';
import {
  UserResponse,
  BankAccount,
  AuthenticateProviderArrayResponse,
  UserStatus,
  UserSellerIndentityType,
  UserSellerType,
  ShopResponse,
} from '@services/types';
import { createApiClient } from '@services/core';
import { UserApi } from '@services/apis';

export type UserRole = 'buyer' | 'seller' | 'seller_pro' | 'seller_silver' | 'seller_gold' | 'admin_staff' | 'admin_manager' | 'admin_gm';

export type UserMembership = 'basic' | 'pro' | 'silver' | 'gold';

export class AuthUser {
  readonly hashId: string;

  readonly username: string;

  readonly email: string;

  readonly displayName: string;

  readonly firstName: string;

  readonly lastName: string;

  readonly profileImageUrl?: string;

  readonly mobile: string;

  readonly status: UserStatus;

  readonly membership: UserMembership; // TODO enum

  readonly isEmailVerified: boolean;

  readonly isMobileVerified: boolean;

  readonly isHomeVerified: boolean;

  readonly description?: string;

  readonly address?: string;

  readonly fax?: string;

  readonly nationalId?: string;

  readonly passportNo?: string;

  readonly homePhone?: string;

  readonly companyName?: string;

  readonly companyTaxId?: string;

  readonly personalWebHomepage?: string;

  readonly province?: string;

  readonly district?: string;

  readonly zipcode?: string;

  readonly balance?: number;

  readonly sellerIdentityType?: UserSellerIndentityType;

  readonly sellerType?: UserSellerType;

  readonly roles: UserRole[];

  readonly role: UserRole;

  readonly hasPassword?: boolean;

  readonly authenticateProviders?: AuthenticateProviderArrayResponse;

  readonly bankAcc?: BankAccount;

  readonly shop?: ShopResponse;

  constructor(data: Partial<UserResponse>) {
    Object.assign(this, data);
  }

  get isBuyer(): boolean {
    return (this.roles || []).find((role) => role === 'buyer') !== undefined;
  }
}

const UserContext = createContext<AuthUser | undefined>(undefined);
const UserUpdateContext = createContext(null);

export enum RedirectAction {
  RedirectIfNotAuthenticated = 'redirectIfNotAuthenticated',
  RedirectIfAuthenticated = 'redirectIfAuthenticated',
  None = 'none',
}

export type getServerSidePropsInnerType<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery
> = (context: GetServerSidePropsContext<Q>, user?: AuthUser) => Promise<GetServerSidePropsResult<P>>;

export function withAuthServerSideProps(action: RedirectAction = RedirectAction.None) {
  const withAuthServerSidePropsInner = (getServerSidePropsInner: getServerSidePropsInnerType = async () => ({ props: {} })) => {
    // eslint-disable-next-line complexity
    const getServerSideProps: GetServerSideProps = async (ctx) => {
      const { token } = nextCookie(ctx);
      const redirectOnError = (path: string): ServerSideError => {
        // https://github.com/vercel/next.js/issues/12409
        if (!isAjax(ctx.req) || isChrome(ctx.req.headers['user-agent'])) {
          ctx.res.writeHead(301, { Location: path, 'Cache-Control': 'no-cache, no-store', Pragma: 'no-cache' });
          ctx.res.end();
        }

        return { message: 'You are not authorized to access this page', statusCode: 401, redirect: path };
      };
      const getMe = async (): Promise<UserResponse | undefined> => {
        try {
          if (!token) return undefined;

          return await createApiClient(UserApi, ctx).getMe();
        } catch (err) {
          return undefined;
        }
      };
      const user = await getMe();
      const result = await getServerSidePropsInner(ctx, user ? new AuthUser(user) : undefined);
      let error = undefined;

      if (!token && action === RedirectAction.RedirectIfNotAuthenticated) {
        error = redirectOnError('/signin');
      }

      if (token && action === RedirectAction.RedirectIfAuthenticated) {
        error = redirectOnError('/');
      }

      return {
        ...result,
        props: pickNotEmpty({
          action,
          user: user,
          error: error,
          ...result.props,
        }),
      };
    };

    return getServerSideProps;
  };

  return withAuthServerSidePropsInner;
}

export function withAuth(PageComponent: NextPage) {
  const WithAuth = (props) => {
    // eslint-disable-next-line react/prop-types
    const { action, ...appProps } = props;
    const [user, setUser] = useState(props?.user);
    const router = useRouter();

    useEffect(() => {
      if (!user && action === RedirectAction.RedirectIfNotAuthenticated) {
        router.replace('/signin');
      }

      if (user && action === RedirectAction.RedirectIfAuthenticated) {
        router.replace('/');
      }
    }, [router, action, user]);

    return (
      <UserContext.Provider value={user ? new AuthUser(user) : undefined}>
        <UserUpdateContext.Provider value={setUser}>
          <PageComponent {...appProps} />
        </UserUpdateContext.Provider>
      </UserContext.Provider>
    );
  };

  WithAuth.displayName = `WithAuth(${PageComponent.displayName})`;

  return WithAuth;
}

export const useAuthContext = (): AuthUser | undefined => useContext(UserContext);
export const useUpdateAuthContext = (): React.Dispatch<AuthUser | undefined> => useContext(UserUpdateContext);

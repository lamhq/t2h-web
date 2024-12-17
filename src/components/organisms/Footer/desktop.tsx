import * as React from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';
import { WithTranslation } from 'next-i18next';
import Link from 'next/link';
import { FlexProps } from 'styled-system';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import { FacebookIcon, LineIcon } from '@components/atoms/IconButton';
import { WhiteAppLogo } from '@components/atoms/AppLogo';
import IconTextLink from '@components/molecules/IconTextLink';
import { Text } from '@components/atoms/Text';
import { FooterUser } from './types';

const FooterContainer = styled(Flex)`
  padding-top: ${({ theme }) => theme.space[4]};
  padding-bottom: 13px;
  background-color: ${({ theme }) => theme.colors.text};
  box-sizing: border-box;
`;

const FooterContent = styled.div`
  color: ${({ theme }) => theme.colors.white};
  flex: 1;
  max-width: 1020px;

  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
`;

const Column = styled(Flex)<FlexProps & { gridColumnStart: number; gridColumnEnd: number }>`
  grid-column-start: ${({ gridColumnStart }) => gridColumnStart};
  grid-column-end: ${({ gridColumnEnd }) => gridColumnEnd};
`;

const ColumnItems = styled(Flex)`
  & > *:not(:first-child) {
    margin-top: 21px;
  }
`;

const AppLogoContainer = styled(Box)`
  svg {
    width: 127.97px;
    height: 36.71px;
  }
`;

const ColumnTitle = ({ children }: { children: React.ReactNode }) => (
  <Text mt={0} mb={0} color="white" fontSize="19px" letterSpacing={3} lineHeight="27px" fontWeight="bold">
    {children}
  </Text>
);

const ColumnItem = ({ children }: { children: React.ReactNode }) => (
  <Text mt={0} mb={0} color="white" fontFamily="secondary">
    {children}
  </Text>
);

export interface DesktopFooterProps extends WithTranslation {
  user?: FooterUser;
}

const DesktopFooter: React.FC<DesktopFooterProps> = ({ t }: DesktopFooterProps) => {
  return (
    <FooterContainer px={3} flexDirection="column" alignItems="center">
      <FooterContent>
        <Column gridColumnStart={1} gridColumnEnd={3} flexDirection="column">
          <ColumnTitle>{t(`Shop`)}</ColumnTitle>
          <ColumnItems mt="26px" flexDirection="column">
            <Link href="/category">
              <a>
                <ColumnItem>{t(`Categories`)}</ColumnItem>
              </a>
            </Link>
            <Link href="/category">
              <a>
                <ColumnItem>{t(`Brands`)}</ColumnItem>
              </a>
            </Link>
            <Link href="/category">
              <a>
                <ColumnItem>{t(`Deals`)}</ColumnItem>
              </a>
            </Link>
          </ColumnItems>
        </Column>
        <Column gridColumnStart={3} gridColumnEnd={5} flexDirection="column">
          <ColumnTitle>{t(`Truck2Hand`)}</ColumnTitle>
          <ColumnItems mt="26px" flexDirection="column">
            <Link href="/about">
              <a>
                <ColumnItem>{t(`About us`)}</ColumnItem>
              </a>
            </Link>
            <Link href="/careers">
              <a>
                <ColumnItem>{t(`Careers`)}</ColumnItem>
              </a>
            </Link>
            <a href="https://blog.truck2hand.com" target="_blank" rel="noopener noreferrer">
              <ColumnItem>{t(`Blog`)}</ColumnItem>
            </a>
            <Link href="/contact">
              <a>
                <ColumnItem>{t(`Contact us`)}</ColumnItem>
              </a>
            </Link>
          </ColumnItems>
        </Column>
        <Column gridColumnStart={5} gridColumnEnd={7} flexDirection="column">
          <ColumnTitle>{t(`Support`)}</ColumnTitle>
          <ColumnItems mt="26px" flexDirection="column">
            <Link href="/faq">
              <a>
                <ColumnItem>{t(`Help Center(FAQ)`)}</ColumnItem>
              </a>
            </Link>
            <Link href="/seller/register">
              <a>
                <ColumnItem>{t(`Become a seller`)}</ColumnItem>
              </a>
            </Link>
          </ColumnItems>
        </Column>
        <Column gridColumnStart={-3} gridColumnEnd={-1} flexDirection="column">
          <ColumnTitle>{t(`Legal`)}</ColumnTitle>
          <ColumnItems mt="26px" flexDirection="column">
            <Link href="/tos">
              <a>
                <ColumnItem>{t(`Terms & Conditions`)}</ColumnItem>
              </a>
            </Link>
            <Link href="/privacy">
              <a>
                <ColumnItem>{t(`Privacy policy`)}</ColumnItem>
              </a>
            </Link>
            <Link href="/rule">
              <a>
                <ColumnItem>{t(`Rule`)}</ColumnItem>
              </a>
            </Link>
          </ColumnItems>
          <Flex mt="28px">
            <IconTextLink icon={<FacebookIcon color="white" />} />
            &nbsp;
            <IconTextLink icon={<LineIcon color="white" />} />
          </Flex>
        </Column>
      </FooterContent>
      <AppLogoContainer mt="28px">
        <WhiteAppLogo />
      </AppLogoContainer>
    </FooterContainer>
  );
};

export default withTranslation('common')(DesktopFooter);

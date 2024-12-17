import * as React from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';
import { WithTranslation } from 'next-i18next';
import Link from 'next/link';
import { PhoneIcon, FacebookIcon, LineIcon } from '@components/atoms/IconButton';
import { MobileWhiteAppLogo } from '@components/atoms/AppLogo';
import IconTextLink from '@components/molecules/IconTextLink';
import { Accordion, AccordionItem, AccordionContainer } from '@components/molecules/Accordion';
import { TextLabel } from '@components/atoms/Text';
import { CONTACT_PHONE } from '@constants/contact';
import { FooterUser } from './types';

const FooterTop = styled(AccordionContainer)`
  background-color: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.white};
`;

const FooterBottom = styled.div`
  background-color: #03112e;
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.space[3]};
  font-size: '17px';
  font-family: ${({ theme }) => theme.fonts.secondary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Contact = styled.div`
  display: flex;
`;

const Icons = styled.div`
  display: flex;
`;

export interface MobileFooterProps extends WithTranslation {
  user?: FooterUser;
}

const MobileFooter: React.FC<MobileFooterProps> = ({ t, user }: MobileFooterProps) => {
  const isSeller = user && !user.isBuyer;

  return (
    <>
      <FooterTop>
        <Accordion title={t('Shop')} variant="secondary">
          <AccordionItem>
            <Link href="/category">
              <a>
                <TextLabel color="white" variant="medium">
                  {t('Categories')}
                </TextLabel>
              </a>
            </Link>
          </AccordionItem>
          <AccordionItem>
            <Link href="/category">
              <a>
                <TextLabel color="white" variant="medium">
                  {t('Brands')}
                </TextLabel>
              </a>
            </Link>
          </AccordionItem>
          <AccordionItem>
            <Link href="/category">
              <a>
                <TextLabel color="white" variant="medium">
                  {t('Deals')}
                </TextLabel>
              </a>
            </Link>
          </AccordionItem>
        </Accordion>
        {isSeller && <Accordion href="/listing/add" title={t('Sell')} variant="secondary" />}
        <Accordion title={t('Truck2hand')} variant="secondary">
          <AccordionItem>
            <Link href="/about">
              <a>
                <TextLabel color="white" variant="medium">
                  {t('About us')}
                </TextLabel>
              </a>
            </Link>
          </AccordionItem>
          <AccordionItem>
            <Link href="/careers">
              <a>
                <TextLabel color="white" variant="medium">
                  {t('Careers')}
                </TextLabel>
              </a>
            </Link>
          </AccordionItem>
          <AccordionItem>
            <a href="https://blog.truck2hand.com" target="_blank" rel="noopener noreferrer">
              <TextLabel color="white" variant="medium">
                {t('Blog')}
              </TextLabel>
            </a>
          </AccordionItem>
          <AccordionItem>
            <Link href="/contact">
              <a>
                <TextLabel color="white" variant="medium">
                  {t('Contact us')}
                </TextLabel>
              </a>
            </Link>
          </AccordionItem>
        </Accordion>
        <Accordion title={t('Support')} variant="secondary">
          <AccordionItem>
            <Link href="/faq">
              <a>
                <TextLabel color="white" variant="medium">
                  {t('Help Center(FAQ)')}
                </TextLabel>
              </a>
            </Link>
          </AccordionItem>
          <AccordionItem>
            <Link href="/seller/register">
              <a>
                <TextLabel color="white" variant="medium">
                  {t('Become a seller')}
                </TextLabel>
              </a>
            </Link>
          </AccordionItem>
        </Accordion>
        <Accordion title={t('Legal')} variant="secondary">
          <AccordionItem>
            <Link href="/tos">
              <a>
                <TextLabel color="white" variant="medium">
                  {t('Terms of Service')}
                </TextLabel>
              </a>
            </Link>
          </AccordionItem>
          <AccordionItem>
            <Link href="/privacy">
              <a>
                <TextLabel color="white" variant="medium">
                  {t('Private Policy')}
                </TextLabel>
              </a>
            </Link>
          </AccordionItem>
          <AccordionItem>
            <Link href="/rule">
              <a>
                <TextLabel color="white" variant="medium">
                  {t('Rule')}
                </TextLabel>
              </a>
            </Link>
          </AccordionItem>
        </Accordion>
        <Icons>
          <IconTextLink icon={<FacebookIcon color="white" />} />
          &nbsp;
          <IconTextLink icon={<LineIcon color="white" />} />
        </Icons>
      </FooterTop>
      <FooterBottom>
        <Contact>
          <PhoneIcon color="white" size="15" />
          &nbsp;{CONTACT_PHONE}
        </Contact>
        <MobileWhiteAppLogo width={45} height={32} />
      </FooterBottom>
    </>
  );
};

export default withTranslation('common')(MobileFooter);

import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import InputSearch from '@components/organisms/InputSearch';
import { Accordion, AccordionItem, AccordionContainer } from '@components/molecules/Accordion';
import Link from 'next/link';
import { withTranslation } from 'react-i18next';
import { WithTranslation } from 'next-i18next';
import { TextLabel } from '@components/atoms/Text';

export interface SideBarProps extends WithTranslation {
  isVisible: boolean;
  isSeller: boolean;
}

const SideBarRoot = styled.div<{ isVisible?: boolean }>`
  position: absolute;
  left: 0;
  width: 100%;
  height: calc(100% - 48px);
  ${({ isVisible = false }) => (isVisible === true ? 'transform: translateX(0)' : 'transform: translateX(-105%)')};
  z-index: 999;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
`;

const SearchBoxContainer = styled.div`
  position: relative;
  width: 100%;
  height: 42px;
`;

const LanguageContainer = styled.div`
  cursor: pointer;
`;

const NavigationContainer = styled(AccordionContainer.withComponent('nav'))``;

const SideBar: React.FC<SideBarProps> = ({ t, i18n, isVisible, isSeller }: SideBarProps) => {
  const [text, setText] = useState('');

  const handleChange = useCallback((e) => {
    setText(e.target.value);
  }, []);

  const handleCancel = useCallback(() => {
    setText('');
  }, []);

  const onLanguageSwitch = React.useCallback(
    (lang: string) => () => {
      if (i18n.language === 'en' && lang === 'th') {
        i18n.changeLanguage('th');
      } else if (i18n.language === 'th' && lang === 'en') {
        i18n.changeLanguage('en');
      }
    },
    [i18n],
  );

  return (
    <SideBarRoot isVisible={isVisible}>
      <SearchBoxContainer>
        <InputSearch placeholder={t('Search by Listing ID, brand, make')} value={text} onCancel={handleCancel} onChange={handleChange} />
      </SearchBoxContainer>
      <NavigationContainer>
        <Accordion title={t('Shop')}>
          <AccordionItem>
            <Link href="/category">
              <a>
                <TextLabel variant="medium">{t('Categories')}</TextLabel>
              </a>
            </Link>
          </AccordionItem>
          <AccordionItem>
            <Link href="/brand">
              <a>
                <TextLabel variant="medium">{t('Brands')}</TextLabel>
              </a>
            </Link>
          </AccordionItem>
          <AccordionItem>
            <Link href="/deal">
              <a>
                <TextLabel variant="medium">{t('Deals')}</TextLabel>
              </a>
            </Link>
          </AccordionItem>
        </Accordion>
        {isSeller && <Accordion href="/listing/add" title={t('Sell')} />}
        <Accordion title={t('Truck2hand')}>
          <AccordionItem>
            <Link href="/about">
              <a>
                <TextLabel variant="medium">{t('About us')}</TextLabel>
              </a>
            </Link>
          </AccordionItem>
          <AccordionItem>
            <Link href="/career">
              <a>
                <TextLabel variant="medium">{t('Careers')}</TextLabel>
              </a>
            </Link>
          </AccordionItem>
          <AccordionItem>
            <Link href="/blog">
              <a>
                <TextLabel variant="medium">{t('Blog')}</TextLabel>
              </a>
            </Link>
          </AccordionItem>
          <AccordionItem>
            <Link href="/contact">
              <a>
                <TextLabel variant="medium">{t('Contact us')}</TextLabel>
              </a>
            </Link>
          </AccordionItem>
        </Accordion>
        <Accordion title={t('Support')}>
          <AccordionItem>
            <Link href="/faq">
              <a>
                <TextLabel variant="medium">{t('Help Center(FAQ)')}</TextLabel>
              </a>
            </Link>
          </AccordionItem>
          <AccordionItem>
            <Link href="/seller/register">
              <a>
                <TextLabel variant="medium">{t('Become a seller')}</TextLabel>
              </a>
            </Link>
          </AccordionItem>
        </Accordion>
        <Accordion title={t('Legal')}>
          <AccordionItem>
            <Link href="/tos">
              <a>
                <TextLabel variant="medium">{t('Terms of Service')}</TextLabel>
              </a>
            </Link>
          </AccordionItem>
          <AccordionItem>
            <Link href="/privacy">
              <a>
                <TextLabel variant="medium">{t('Private Policy')}</TextLabel>
              </a>
            </Link>
          </AccordionItem>
          <AccordionItem>
            <Link href="/rule">
              <a>
                <TextLabel variant="medium">{t('Rule')}</TextLabel>
              </a>
            </Link>
          </AccordionItem>
        </Accordion>
        <Accordion title={t('Language')}>
          <AccordionItem>
            <LanguageContainer onClick={onLanguageSwitch('th')}>
              <TextLabel variant="medium">{t('Thai')}</TextLabel>
            </LanguageContainer>
          </AccordionItem>
          <AccordionItem>
            <LanguageContainer onClick={onLanguageSwitch('en')}>
              <TextLabel variant="medium">{t('English')}</TextLabel>
            </LanguageContainer>
          </AccordionItem>
        </Accordion>
      </NavigationContainer>
    </SideBarRoot>
  );
};

export default withTranslation('common')(SideBar);

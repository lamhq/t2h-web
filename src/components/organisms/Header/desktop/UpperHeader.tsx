import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';
import { WithTranslation } from 'next-i18next';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import { TextLabel } from '@components/atoms/Text';
import { PhoneIcon } from '@components/atoms/IconButton';
import { CONTACT_PHONE } from '@constants/contact';
import LanguageSwitcher from '@components/molecules/LanguageSwitcher';

const PointerBox = styled.div`
  cursor: pointer;
`;
const UpperHeaderContainer = styled(Flex)`
  height: 30px;
  background: #f6f7f9;
  box-shadow: 0 -1px 0px 0px #ececec inset;
`;
const StyledTextLabel = ({ children }: { children: React.ReactNode }) => {
  return (
    <TextLabel variant="small" lineHeight="20px" fontFamily="secondary">
      {children}
    </TextLabel>
  );
};

interface UpperHeaderProps extends WithTranslation {}

const UpperHeader = ({ t }: UpperHeaderProps) => {
  return (
    <UpperHeaderContainer alignItems="center">
      <Box ml="auto">
        <Link href="/faq">
          <a>
            <StyledTextLabel>{t(`Support`)}</StyledTextLabel>
          </a>
        </Link>
      </Box>

      <Box ml="17px">
        <Link href="/contact">
          <a>
            <StyledTextLabel>{t(`Contact us`)}</StyledTextLabel>
          </a>
        </Link>
      </Box>
      <PointerBox>
        <LanguageSwitcher size={'22px'} isAnchor={true} />
      </PointerBox>

      <a href={`tel:${CONTACT_PHONE.replace(' ', '')}`}>
        <Flex ml="21px" mr="16px" alignItems="center">
          <PhoneIcon color="text" size="15" />
          <Box ml="9px">
            <StyledTextLabel>{CONTACT_PHONE}</StyledTextLabel>
          </Box>
        </Flex>
      </a>
    </UpperHeaderContainer>
  );
};

export default withTranslation('common')(UpperHeader);

import React from 'react';
import styled from 'styled-components';
import { color, ColorProps, SpaceProps } from 'styled-system';
import { withTranslation } from 'react-i18next';
import { WithTranslation } from 'next-i18next';
import Flex from '@components/layouts/Flex';
import { MenuItemLink } from '@components/atoms/MenuItem';
import { MonetizationOnIcon, ChevronRightIcon } from '@components/atoms/IconButton';
import { Text } from '@components/atoms/Text';

interface CoinMenuItemProps extends SpaceProps, WithTranslation {
  amount: string;
  description: string;
  price: string;
  label?: string;
  href?: string;
}

const CoinMenuItemContainer = styled(Flex)<ColorProps>`
  ${color}
  width: 100%;
  position: relative;
  padding: 16px 12px 16px 7px;
  box-sizing: border-box;
  border-radius: 4px;
`;

const LabelContainer = styled(Flex)`
  height: 29px;
`;

const Label = styled(Flex)`
  position: absolute;
  background-color: #f42b24;
  top: 8px;
  left: -8px;
  padding-left: 15px;
  padding-right: 10px;
  box-sizing: border-box;
  border-radius: 0 6px 6px 0;
  z-index: 1;
`;

const Cuffs = styled.div`
  position: absolute;
  left: -8px;
  top: 35px;

  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-top: 2px solid #b41711;
`;

const CoinMenuItem = (props: CoinMenuItemProps) => {
  const { t, amount, description, price, label, href, ...rest } = props;
  const item = (
    <CoinMenuItemContainer backgroundColor="text">
      <Flex flexDirection="column">
        {label && (
          <LabelContainer>
            <Label>
              <Text my={0} color="white" fontSize="19px" lineHeight="27px" letterSpacing={3} fontWeight="bold">
                {label}
              </Text>
            </Label>
            <Cuffs />
          </LabelContainer>
        )}
        <Flex alignItems="center" mt="2px">
          <MonetizationOnIcon size="24px" color="boost" />
          <Flex ml={2} flexDirection="column">
            <Text my={0} color="white" fontFamily="secondary" fontWeight="bold">
              {amount}
            </Text>
            <Text my={0} variant="extraSmall" color="rgba(255,255,255,0.5)" fontFamily="secondary">
              {description}
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Flex ml="auto" mt="auto" mb="auto" flexDirection="column">
        <Text my={0} variant="small" color="white" fontFamily="secondary" textAlign="right">
          {t(`Buy for`)}
        </Text>
        <Text my={0} variant="small" color="white" fontFamily="secondary" textAlign="right">
          {price}
        </Text>
      </Flex>
      <Flex ml="13px" mt="auto" mb="auto">
        {href && <ChevronRightIcon size="16px" color="white" />}
      </Flex>
    </CoinMenuItemContainer>
  );

  return href ? (
    <MenuItemLink href={href} {...rest} p={0}>
      {item}
    </MenuItemLink>
  ) : (
    item
  );
};

export default withTranslation('common')(CoinMenuItem);

import React from 'react';
import styled from 'styled-components';
import Flex from '@components/layouts/Flex';
import { MonetizationOnIcon } from '@components/atoms/IconButton';
import { Text } from '@components/atoms/Text';
import { safeKey } from '@common/utils';

export type BalanceVariant = 'small' | 'normal';

const variants = {
  small: {
    amountStyle: {
      fontSize: '19px',
      lineHeight: '23px',
      fontFamily: 'primary',
      fontWeight: 'bold',
    },
    iconStyle: {
      size: '18px',
    },
  },
  normal: {
    amountStyle: {
      fontSize: '52px',
      lineHeight: '54px',
      letterSpacing: '0.2px',
      fontFamily: 'primary',
      fontWeight: 'bold',
    },
    captionStyle: {
      variant: 'mediumLarge',
      letterSpacing: '0.09px',
      fontFamily: 'secondary',
    },
    iconStyle: {
      size: '24px',
    },
  },
};

const BalanceContainer = styled.div<{ iconSize: string }>`
  position: relative;
  padding-left: ${({ iconSize }) => `calc(${iconSize} + 2px)`};
  box-sizing: border-box;
`;

const IconContainer = styled.div<{ amountSize: string; iconSize: string }>`
  position: absolute;
  top: ${({ amountSize, iconSize }) => `calc((${amountSize} - ${iconSize})/2)`};
  left: 0px;
`;

const TextContainer = styled(Flex)`
  position: relative;
  display: inline-block;
`;

interface BalanceProps {
  amount: number;
  caption?: string;
  variant: BalanceVariant;
  iconColor: string;
}

const Balance = (props: BalanceProps) => {
  const { amount, caption, variant, iconColor } = props;

  const style = variants[safeKey(variant)];
  const iconStyle = style?.iconStyle;
  const amountStyle = style?.amountStyle;
  const captionStyle = style?.captionStyle;

  return (
    <BalanceContainer iconSize={iconStyle?.size}>
      <IconContainer amountSize={amountStyle?.lineHeight} iconSize={iconStyle?.size}>
        <MonetizationOnIcon {...iconStyle} color={iconColor} />
      </IconContainer>
      <TextContainer flexDirection="column" alignItems="center">
        <Text mt={0} mb={0} textAlign="center" {...amountStyle}>
          {amount.toLocaleString()}
        </Text>
        {caption && (
          <Text mt={0} mb={0} textAlign="center" {...captionStyle}>
            {caption}
          </Text>
        )}
      </TextContainer>
    </BalanceContainer>
  );
};

Balance.defaultProps = {
  iconColor: 'yellow',
  textColor: 'text',
  variant: 'normal',
};

export default Balance;

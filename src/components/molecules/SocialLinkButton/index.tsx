import * as React from 'react';
import Flex from '@components/layouts/Flex';
import { Text, TextProps } from '@components/atoms/Text';
import { ButtonLink, ButtonVariant } from '@components/atoms/Button';
import styled from 'styled-components';

interface SocialLinkButtonProps {
  variant: ButtonVariant;
  href?: string;

  leftIcon: React.ReactNode;
  rightIcon?: React.ReactNode;
  name: string;
  text: string;

  textProps?: Omit<TextProps, 'color'> & { color: string };
}

const SocialLinkButtonContainer = styled(ButtonLink)`
  height: 62px;
  display: flex;
  padding: ${({ theme }) => theme.space[2]};
  box-sizing: border-box;
`;

const LeftIconContainer = styled(Flex)`
  width: 40px;
  height: 100%;
`;

const RightIconContainer = styled(Flex)`
  width: 20px;
  height: 100%;
`;

const SocialLinkButton: React.FC<SocialLinkButtonProps> = (props: SocialLinkButtonProps) => {
  const { leftIcon, rightIcon, name, text, textProps, ...rest } = props;

  return (
    <SocialLinkButtonContainer {...rest}>
      <LeftIconContainer alignItems="center" justifyContent="center">
        {leftIcon}
      </LeftIconContainer>
      <Flex flexDirection="column" ml={2}>
        <Text mt={0} mb={0} textAlign="left" color="white" fontFamily="secondary" {...textProps}>
          {name}
        </Text>
        <Text mt={0} mb={0} textAlign="left" color="white" fontFamily="secondary" {...textProps}>
          {text}
        </Text>
      </Flex>
      {rightIcon && (
        <RightIconContainer ml="auto" mr={0} alignItems="center" justifyContent="center">
          {rightIcon}
        </RightIconContainer>
      )}
    </SocialLinkButtonContainer>
  );
};

SocialLinkButton.displayName = 'SocialLinkButton';

export default SocialLinkButton;

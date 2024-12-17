import React from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';
import { WithTranslation } from 'next-i18next';
import { TextLabel } from '@components/atoms/Text';
import Image from '@components/atoms/Image';
import Box from '@components/layouts/Box';
import LetterAvatar from '@components/atoms/LetterAvatar';

interface MyAccountProfileProps extends WithTranslation {
  user: {
    profileImageUrl?: string;
    firstName: string;
    lastName: string;
    displayName: string;
    membership: string;
  };
}

const MyAccountProfileWrapper = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.space[3]};
`;

const MyAccountProfileInfo = styled.a`
  display: block;
  margin-left: ${({ theme }) => theme.space[3]};
`;

// TODO: Change MenuItem depending on user membership
const MyAccountProfile: React.FC<MyAccountProfileProps> = (props: MyAccountProfileProps) => {
  const { t, user } = props;
  const width = 60,
    height = 60;

  return (
    <MyAccountProfileWrapper>
      {user.profileImageUrl ? (
        <Image width="60px" shape="circle" src={user.profileImageUrl}></Image>
      ) : (
        <LetterAvatar firstName={user.firstName} lastName={user.lastName} width={width} height={height} />
      )}
      <MyAccountProfileInfo>
        <Box>
          <TextLabel lineHeight="26px" variant="mediumLarge">
            {user.displayName}
          </TextLabel>
        </Box>
        <Box>
          <TextLabel lineHeight="26px" fontWeight="bold" variant="extraSmall">
            {t(user.membership || 'buyer')}
          </TextLabel>
        </Box>
      </MyAccountProfileInfo>
    </MyAccountProfileWrapper>
  );
};

export default withTranslation('common')(MyAccountProfile);

import React from 'react';
import styled from 'styled-components';
import { WithTranslation, withTranslation } from 'react-i18next';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import { SubTitle } from '@components/atoms/Title';
import { TextLink, TextLabel } from '@components/atoms/Text';
import { useAuthContext } from '@hocs/withAuth';
import InputLabel from '@components/atoms/InputLabel';

const EditTextLinkWrapper = styled.div``;

interface MobileEditFormProps extends WithTranslation {
  requestOtpUrl: string;
}

const MobileEditForm: React.FC<MobileEditFormProps> = ({ requestOtpUrl, t }: MobileEditFormProps) => {
  const user = useAuthContext();

  return (
    <Box>
      <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
        <SubTitle>{t('Mobile')}</SubTitle>
        <EditTextLinkWrapper>
          <TextLink href={requestOtpUrl}>{t('Edit')}</TextLink>
        </EditTextLinkWrapper>
      </Flex>
      <InputLabel>{t('Mobile')}</InputLabel>
      <TextLabel variant="medium" color="inputText" lineHeight="38px">
        {user.mobile}
      </TextLabel>
    </Box>
  );
};

MobileEditForm.displayName = 'MobileEditForm';

export default withTranslation('common')(MobileEditForm);

import React from 'react';
import styled from 'styled-components';
import { WithTranslation, withTranslation } from 'react-i18next';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import { SubTitle } from '@components/atoms/Title';
import { TextLink, TextLabel } from '@components/atoms/Text';
import { useAuthContext } from '@hocs/withAuth';
import InputLabel from '@components/atoms/InputLabel';
import { FormControl } from '@components/layouts/FormGroup';

const EditTextLinkWrapper = styled.div``;

interface IndentityEditFormProps extends WithTranslation {
  editIndentityUrl: string;
}

const IndentityEditForm: React.FC<IndentityEditFormProps> = ({ editIndentityUrl, t }: IndentityEditFormProps) => {
  const user = useAuthContext();

  const renderLabelAndValue = (label: string, value: string) => {
    return (
      <FormControl>
        <InputLabel>{label}</InputLabel>
        <Box mt={2} mb={3}>
          <TextLabel variant="medium" color="inputText">
            {value}
          </TextLabel>
        </Box>
      </FormControl>
    );
  };

  return (
    <Box>
      <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
        <SubTitle>{t('Identity')}</SubTitle>
        <EditTextLinkWrapper>
          <TextLink href={editIndentityUrl}>{t('Edit')}</TextLink>
        </EditTextLinkWrapper>
      </Flex>
      {user.nationalId && renderLabelAndValue(t('Thai National ID'), user.nationalId)}
      {user.passportNo && renderLabelAndValue(t('Passport Number'), user.passportNo)}
      {user.province && renderLabelAndValue(t('Provice'), user.province)}
      {user.address && renderLabelAndValue(t('Address'), user.address)}
      {user.companyName && renderLabelAndValue(t('Company Name'), user.companyName)}
      {user.companyTaxId && renderLabelAndValue(t('TAX ID'), user.companyTaxId)}
      {user.bankAcc && (
        <React.Fragment>
          {/* TODO: change by language setings */}
          {renderLabelAndValue(t('Bank Name'), `${user.bankAcc.bankThaiName} / ${user.bankAcc.bankEnglishName}`)}
          {renderLabelAndValue(t('Bank account number'), user.bankAcc.accountNumber)}
        </React.Fragment>
      )}
    </Box>
  );
};

IndentityEditForm.displayName = 'IndentityEditForm';

export default withTranslation('common')(IndentityEditForm);

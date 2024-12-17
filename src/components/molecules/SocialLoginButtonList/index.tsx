import * as React from 'react';
import styled from 'styled-components';
import { ButtonLink } from '@components/atoms/Button';
import Box from '@components/layouts/Box';
import { withTranslation } from 'react-i18next';
import { WithTranslation } from 'next-i18next';

interface SocialButtonListProps extends WithTranslation {
  facebookAuthUrl: string;
  lineAuthUrl: string;
}

const SocialLoginButtonListRoot = styled.div``;

const SociaButton = styled(ButtonLink)`
  &:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.space[2]};
  }
`;

const SocialLoginButtonList: React.FC<SocialButtonListProps> = (props: SocialButtonListProps) => {
  const { facebookAuthUrl, lineAuthUrl, t } = props;

  return (
    <SocialLoginButtonListRoot>
      <Box mb={3} width="100%">
        <SociaButton variant="facebook" href={facebookAuthUrl}>
          {t('Continue with Facebook')}
        </SociaButton>
      </Box>
      <Box width="100%">
        <SociaButton variant="line" href={lineAuthUrl}>
          {t('Continue with LINE')}
        </SociaButton>
      </Box>
    </SocialLoginButtonListRoot>
  );
};

export default withTranslation('common')(SocialLoginButtonList);

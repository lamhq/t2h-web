import React from 'react';
import styled from 'styled-components';
import InputText from '@components/molecules/InputText';
import { Button } from '@components/atoms/Button';
import { Text, TextLink } from '@components/atoms/Text';
import Flex from '@components/layouts/Flex';
import { FormControl } from '@components/layouts/FormGroup';
import { withTranslation } from 'react-i18next';
import { WithTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { SubTitle } from '@components/atoms/Title';

const ForgotPasswordTextLink = styled(TextLink)`
  float: right;
`;

interface LoginFormProps extends WithTranslation {
  username?: string;
  password?: string;
  passwordResetUrl: string;
  onSubmit: (data: { username: string; password: string }) => void;
}

const LoginForm: React.FC<LoginFormProps> = (props: LoginFormProps) => {
  const { t, onSubmit } = props;
  const { register, handleSubmit } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      username: props.username ?? '',
      password: props.password ?? '',
    },
  });

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SubTitle mt={0}>{t('Login')}</SubTitle>
        <Text variant="small" m={0}>
          {t('Email, username or phone number')}
        </Text>
        <Flex flexWrap="wrap" mt={1}>
          <FormControl>
            <InputText ref={register} type="text" name="username" autoComplete="username" placeholder={t('Email')} />
          </FormControl>
          <FormControl>
            <InputText ref={register} type="password" name="password" autoComplete="current-password" placeholder={t('Password')} />
          </FormControl>
          <FormControl>
            <ForgotPasswordTextLink href={props.passwordResetUrl} variant="small">
              {t('Forgot password')}
            </ForgotPasswordTextLink>
          </FormControl>
          <FormControl mt={1} mb={0}>
            <Button variant="primary" type="submit">
              {t('Log in')}
            </Button>
          </FormControl>
        </Flex>
      </form>
    </React.Fragment>
  );
};

export default withTranslation('common')(LoginForm);

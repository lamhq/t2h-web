import * as React from 'react';
import { useForm } from 'react-hook-form';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Button } from '@components/atoms/Button';
import { Text, TextLink } from '@components/atoms/Text';
import { FormControl, FormGroup } from '@components/layouts/FormGroup';
import InputText from '@components/molecules/InputText';
import Flex from '@components/layouts/Flex';
import { isUsernameValid, isEmailValid, isMobileNumberValid, getPasswordStrongth, PasswordStrongth } from '@common/utils/validation';
import { InputThaiMobilePhone } from '@components/molecules/InputNumber';

export interface SignupFormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
}

interface SignupFormProps extends WithTranslation {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  password?: string;

  onSubmit: (data: SignupFormData) => void;
  checkAvailability?: (key: string, value: string) => Promise<boolean | string>;
}

// eslint-disable-next-line complexity
const SignupForm: React.FC<SignupFormProps> = (props: SignupFormProps) => {
  const { t, onSubmit, checkAvailability } = props;
  const { register, handleSubmit, errors, formState } = useForm({
    mode: 'onChange',
    defaultValues: {
      username: props.username,
      firstName: props.firstName,
      lastName: props.lastName,
      email: props.email,
      mobile: props.mobile,
      password: props.password,
    },
  });

  const [passwordStrongth, setPasswordStrongth] = React.useState(null);
  const buttonPrimary = formState.isValid ? 'primary' : 'disabled';

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex flexWrap="wrap" my={3}>
          <FormGroup>
            <FormControl>
              <InputText
                ref={register({ required: { value: true, message: `${t(`First name`)} ${t('is required')}` } })}
                type="text"
                label={`${t(`First name`)} *`}
                name="firstName"
                hasError={!!errors.firstName}
                helperText={errors.firstName && `${t(`First name`)} ${t('is required')}`}
              />
            </FormControl>
            <FormControl>
              <InputText
                ref={register({ required: { value: true, message: `${t(`First name`)} ${t('is required')}` } })}
                type="text"
                label={`${t(`Last name`)} *`}
                name="lastName"
                hasError={!!errors.lastName}
                helperText={errors.lastName && `${t(`Last name`)} ${t('is required')}`}
              />
            </FormControl>
            <FormControl>
              <InputText
                ref={register({
                  required: { value: true, message: `${t(`Username`)} ${t('is required')}` },
                  validate: async (username) => {
                    if (!isUsernameValid(username)) {
                      return t('Please input correct format').toString();
                    }

                    if (username === props.username) return true;

                    if (!checkAvailability) return true;

                    return await checkAvailability('username', username);
                  },
                })}
                type="text"
                label={`${t(`Username`)} *`}
                name="username"
                hasError={!!errors.username}
                helperText={errors.username && t(errors.username.message.toString())}
              />
            </FormControl>
          </FormGroup>

          <FormGroup>
            <FormControl>
              <InputText
                ref={register({
                  required: { value: true, message: t('Email is required') },
                  validate: async (email) => {
                    if (!isEmailValid(email)) {
                      return t('Please input correct format').toString();
                    }

                    if (email === props.email) return true;

                    if (!checkAvailability) return true;

                    return await checkAvailability('email', email);
                  },
                })}
                type="email"
                label={`${t(`Email`)} *`}
                name="email"
                hasError={!!errors.email}
                helperText={errors.email && t(errors.email.message.toString())}
              />
            </FormControl>
            <FormControl>
              <InputThaiMobilePhone
                ref={register({
                  required: { value: true, message: `${t(`Mobile`)} ${t('is required')}` },
                  validate: async (mobile) => {
                    if (!isMobileNumberValid(mobile)) {
                      return t('Please input correct format').toString();
                    }

                    if (mobile === props.mobile) return true;

                    if (!checkAvailability) return true;

                    return await checkAvailability('mobile', mobile);
                  },
                })}
                type="text"
                label={`${t(`Mobile`)} *`}
                name="mobile"
                hasError={!!errors.mobile}
                helperText={errors.mobile && t(errors.mobile.message.toString())}
              />
            </FormControl>
          </FormGroup>

          <FormGroup>
            <FormControl>
              <InputText
                ref={register({
                  required: { value: true, message: `${t(`Password`)} ${t('is required')}` },
                  validate: (password) => getPasswordStrongth(password) !== PasswordStrongth.Invalid,
                })}
                type="password"
                label={`${t(`Password`)} *`}
                name="password"
                hasError={!!errors.password}
                helperText={errors.password && t('Password is invalid')}
                onChange={(password) => {
                  setPasswordStrongth(getPasswordStrongth(password.target.value));
                }}
              />
              <Text my={1} variant="small" color="passwordStrength" fontFamily="secondary">
                {`${t(`Password strength`)}: ${passwordStrongth ?? ''}`}
              </Text>
              <Text my={1} variant="small" color="passwordRule" fontFamily="secondary">
                {t(`Password must be between 6-32 characters, at least 1 letter and 1 number.`)}
              </Text>
            </FormControl>
          </FormGroup>

          <FormGroup mt={3}>
            <Button variant={buttonPrimary} type="submit" disabled={!formState.isValid}>
              {t(`Continue`)}
            </Button>
          </FormGroup>

          <FormGroup mt={3}>
            <Text my={0} fontFamily="secondary" textAlign="center">
              {`${t(`By click continue you agreed to Truck2hand.com's`)} `}
              <TextLink variant="medium" fontWeight="bold" color="text">{`${t(`Privacy Policy`)}`}</TextLink>
              {` ${t(`and`)} `}
              <TextLink variant="medium" fontWeight="bold" color="text">{`${t(`Terms & Conditions`)}`}</TextLink>
            </Text>
          </FormGroup>
        </Flex>
      </form>
    </React.Fragment>
  );
};

export default withTranslation('common')(SignupForm);

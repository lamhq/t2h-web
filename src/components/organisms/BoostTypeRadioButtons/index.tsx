import React from 'react';
import RichRadioButton from '@components/organisms/RichRadioButton';
import RadioGroup from '@components/molecules/RadioGroup';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Text } from '@components/atoms/Text';
import { SubTitle } from '@components/atoms/Title';
import Box from '@components/layouts/Box';
import Flex from '@components/layouts/Flex';

export enum BoostType {
  Instant = 'instant',
  OneDay = '1',
  TwoDays = '2',
  FiveDays = '5',
  SevenDays = '7',
}

const BOOST_TYPES = [
  { value: BoostType.OneDay, label: '1 days', amount: '40 coins' },
  { value: BoostType.TwoDays, label: '2 days', amount: '50 coins', comment: 'Save 10 coins' },
  { value: BoostType.FiveDays, label: '5 days', amount: '80 coins', comment: 'Save 20 coins' },
  { value: BoostType.SevenDays, label: '7 days', amount: '100 coins', comment: 'Save 40 coins' },
];

interface BoostTypeRadioButtonsProps extends WithTranslation {
  boostType: string;
  onBoostTypeChange: (value: string | number) => void;
}

const BoostTypeRadioButtons: React.FC<BoostTypeRadioButtonsProps> = (props: BoostTypeRadioButtonsProps) => {
  const { t, boostType, onBoostTypeChange } = props;

  return (
    <RadioGroup flexDirection="column" value={boostType} onChange={onBoostTypeChange}>
      <RichRadioButton value={BoostType.Instant} selectedBackgroundColor="boost" selectedFontColor="white">
        <Flex width="100%" ml={1} flexDirection="row" alignItems="center" justifyContent="space-between">
          <Box>{t('Instant')}</Box>
          <Text ml="auto" my={0} color="inherit" textAlign="right" lineHeight="16px">
            {t(`20 Coins`)}
          </Text>
        </Flex>
      </RichRadioButton>

      <SubTitle mt={3} mb={0} color="menuText" fontSize="19px" lineHeight="23px" textAlign="left">
        {t(`Schedule`)}
      </SubTitle>

      {BOOST_TYPES.map((type) => {
        return (
          <Box key={type.value} mt={2}>
            <RichRadioButton value={type.value} selectedBackgroundColor="boost" selectedFontColor="white">
              <Flex width="100%" ml={1} flexDirection="row" alignItems="center" justifyContent="space-between">
                <Box>{t(type.label)}</Box>
                <Flex flexDirection="column">
                  <Text my={0} color="inherit" textAlign="right" lineHeight="16px">
                    {t(type.amount)}
                  </Text>
                  {type.comment !== undefined && (
                    <Text my={0} variant="extraSmall" color="inherit" fontFamily="secondary" textAlign="right" lineHeight="12px">
                      {t(type.comment)}
                    </Text>
                  )}
                </Flex>
              </Flex>
            </RichRadioButton>
          </Box>
        );
      })}
    </RadioGroup>
  );
};

BoostTypeRadioButtons.displayName = 'BoostTypeRadioButtons';

export default withTranslation('common')(BoostTypeRadioButtons);

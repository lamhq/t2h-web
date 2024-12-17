import React from 'react';
import styled from 'styled-components';
import { Text } from '@components/atoms/Text';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import { RadioValueContext } from '@components/molecules/RadioButton';
import RichRadioButton from './index';

export default { title: 'Organisms|RichRadioButton' };

const Container = styled.div`
  width: 288px;
  margin: 20px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
`;

export const Standard = () => {
  const [value, setValue] = React.useState<string>('');
  const handleChange = (value: string) => {
    setValue(value);
  };

  return (
    <Container>
      <RadioValueContext.Provider value={{ value, onChange: handleChange }}>
        <RichRadioButton value="instant" selectedBackgroundColor="boost" selectedFontColor="white">
          <Flex width="100%" ml={1} flexDirection="row" alignItems="center" justifyContent="space-between">
            <Box>Instant</Box>
            <Text my={0} color="inherit" textAlign="right" lineHeight="16px">
              20 Coins
            </Text>
          </Flex>
        </RichRadioButton>

        <RichRadioButton value="1day" selectedBackgroundColor="boost" selectedFontColor="white">
          <Flex width="100%" ml={1} flexDirection="row" alignItems="center" justifyContent="space-between">
            <Box>1 day</Box>
            <Text my={0} color="inherit" textAlign="right" lineHeight="16px">
              40 Coins
            </Text>
          </Flex>
        </RichRadioButton>

        <RichRadioButton value="2day" selectedBackgroundColor="boost" selectedFontColor="white">
          <Flex width="100%" ml={1} flexDirection="row" alignItems="center" justifyContent="space-between">
            <Box>2 day</Box>
            <Flex flexDirection="column">
              <Text my={0} color="inherit" textAlign="right" lineHeight="16px">
                50 Coins
              </Text>
              <Text my={0} variant="extraSmall" color="inherit" fontFamily="secondary" textAlign="right" lineHeight="12px">
                Save 10 coins
              </Text>
            </Flex>
          </Flex>
        </RichRadioButton>

        <RichRadioButton value="5days" selectedBackgroundColor="boost" selectedFontColor="white">
          <Flex width="100%" ml={1} flexDirection="row" alignItems="center" justifyContent="space-between">
            <Box>5 day</Box>
            <Flex flexDirection="column">
              <Text my={0} color="inherit" textAlign="right" lineHeight="16px">
                80 Coins
              </Text>
              <Text my={0} variant="extraSmall" color="inherit" fontFamily="secondary" textAlign="right" lineHeight="12px">
                Save 20 coins
              </Text>
            </Flex>
          </Flex>
        </RichRadioButton>

        <RichRadioButton value="7days" selectedBackgroundColor="boost" selectedFontColor="white">
          <Flex width="100%" ml={1} flexDirection="row" alignItems="center" justifyContent="space-between">
            <Box>7 day</Box>
            <Flex flexDirection="column">
              <Text my={0} color="inherit" textAlign="right" lineHeight="16px">
                100 Coins
              </Text>
              <Text my={0} variant="extraSmall" color="inherit" fontFamily="secondary" textAlign="right" lineHeight="12px">
                Save 40 coins
              </Text>
            </Flex>
          </Flex>
        </RichRadioButton>
      </RadioValueContext.Provider>
    </Container>
  );
};

import * as React from 'react';
import styled from 'styled-components';
import Flex from '@components/layouts/Flex';
import Card from '@components/atoms/Card';
import Image from '@components/atoms/Image';
import { Title } from '@components/atoms/Title';
import { Text } from '@components/atoms/Text';
import { RadioValueContext } from '@components/molecules/RadioButton';
import { RadioButtonUncheckedIcon, RadioButtonCheckedIcon } from '@components/atoms/IconButton';

const SellerTypeCardContainer = styled(Card)`
  border-radius: 6px;
  background-color: #f0f4f7;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding-top: 17px;
  padding-bottom: 19px;
  box-sizing: border-box;
`;

interface SellerTypeCardProps {
  value: string | number;
  imageSrc: string;
  title: string;
  description: string;
}

const SellerTypeCard: React.FC<SellerTypeCardProps> = (props: React.PropsWithChildren<SellerTypeCardProps>) => {
  const { imageSrc, title, description, value } = props;
  const contextValue = React.useContext(RadioValueContext);

  if (!contextValue) {
    throw new Error('RadioGroup Component is missing');
  }

  const isChecked = contextValue.value == value;
  const Icon = isChecked ? RadioButtonCheckedIcon : RadioButtonUncheckedIcon;
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    contextValue.onChange(value);
  };

  return (
    <SellerTypeCardContainer onClick={handleClick}>
      <Flex justifyContent="center">
        <Image src={imageSrc} alt={title} height={{ _: '73px', md: '93px' }} />
      </Flex>
      <Title mt={{ _: '17px', md: '7px' }} mb={0} color="text" fontSize="19px" lineHeight="27px" letterSpacing={3}>
        {title}
      </Title>
      <Text
        mx={{ _: 1, md: '30px' }}
        mt={{ _: '7px', md: '5px' }}
        mb={0}
        textAlign="center"
        variant="small"
        fontFamily="secondary"
        color="inputText"
      >
        {description}
      </Text>
      <Flex justifyContent="center" mt={{ _: '12px', md: '9px' }}>
        <Icon />
      </Flex>
    </SellerTypeCardContainer>
  );
};

SellerTypeCard.displayName = 'SellerTypeCard';

export default SellerTypeCard;

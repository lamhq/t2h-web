import React from 'react';
import styled from 'styled-components';
import { color, layout, ColorProps, LayoutProps } from 'styled-system';
import Flex from '@components/layouts/Flex';
import { RadioValueContext, RadioButtonProps } from '@components/molecules/RadioButton';
import { theme } from '@components/global/theme';
import { RadioButtonUncheckedIcon, RadioButtonCheckedIcon } from '@components/atoms/IconButton';

type ColorType = keyof typeof theme.colors;

interface RichRadioButtonProps extends RadioButtonProps {
  selectedBackgroundColor: ColorType;
  selectedFontColor: ColorType;
  height?: string;
}

const Container = styled(Flex)<ColorProps & LayoutProps & { border: string }>`
  ${color}
  ${layout}
  border: ${({ border }) => border};
  border-radius: 8px;
  padding: 6px 8px 6px 9px;
  box-sizing: border-box;
  cursor: pointer;
`;

const TextContainer = styled(Flex)<{ fontColor: string }>`
  color: ${({ fontColor }) => fontColor};
  width: 100%;
`;

const RichRadioButton: React.FC<RichRadioButtonProps> = (props: React.PropsWithChildren<RichRadioButtonProps>) => {
  const { value, height, children, selectedBackgroundColor, selectedFontColor, ...rest } = props;

  const contextValue = React.useContext(RadioValueContext);

  if (!contextValue) {
    throw new Error('RadioGroup Component is missing');
  }

  const isChecked = contextValue.value == value;
  const border = !isChecked && '1px solid #dfdfdf';
  const backgroundColor = isChecked ? selectedBackgroundColor : undefined;
  const fontColor = isChecked ? selectedFontColor : undefined;
  const Icon = isChecked ? RadioButtonCheckedIcon : RadioButtonUncheckedIcon;
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isChecked) {
      contextValue.onChange(value);
    }
  };

  return (
    <Container alignItems="center" backgroundColor={backgroundColor} border={border} height={height} onClick={handleClick}>
      <Icon color={fontColor} {...rest} />
      <TextContainer fontColor={fontColor}>{children}</TextContainer>
    </Container>
  );
};

RichRadioButton.displayName = 'RichRadioButton';

RichRadioButton.defaultProps = {
  selectedBackgroundColor: 'boost',
  selectedFontColor: 'white',
  height: '40px',
};

export default RichRadioButton;

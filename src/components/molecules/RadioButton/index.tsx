import React from 'react';
import styled from 'styled-components';
import { TextLabel } from '@components/atoms/Text';
import Flex from '@components/layouts/Flex';
import { RadioButtonUncheckedIcon, RadioButtonCheckedIcon } from '@components/atoms/IconButton';
import { IconButtonProps } from '@components/atoms/IconButton/buttons';

export interface ContextRadioValue {
  value?: string | number;
  onChange?: (value: string | number) => void;
}

export const RadioValueContext = React.createContext<ContextRadioValue | null>(null);

export interface RadioButtonProps extends IconButtonProps {
  value: string | number;
  label?: string;
  id?: string;
}

const Label = styled.label`
  cursor: pointer;
  margin-left: ${({ theme }) => theme.space[2]};
`;

const RadioButton: React.FC<RadioButtonProps> = (props: React.PropsWithChildren<RadioButtonProps>) => {
  const { label, value, ...rest } = props;
  const contextValue = React.useContext(RadioValueContext);

  if (!contextValue) {
    throw new Error('RadioGroup Component is missing');
  }

  const isChecked = contextValue.value == value;
  const Icon = isChecked ? RadioButtonCheckedIcon : RadioButtonUncheckedIcon;
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isChecked) {
      contextValue.onChange && contextValue.onChange(value);
    }
  };

  return (
    <Flex alignItems="center" onClick={handleClick}>
      <Icon {...rest} />
      {label && label.length > 0 && (
        <Label htmlFor={props.id}>
          <TextLabel ml={1} color={props.color} fontFamily="secondary">
            {label}
          </TextLabel>
        </Label>
      )}
    </Flex>
  );
};

RadioButton.displayName = 'RadioButton';

RadioButton.defaultProps = {
  size: '20px',
};

export default RadioButton;

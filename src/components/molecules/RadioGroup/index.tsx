import * as React from 'react';
import Flex, { FlexProps } from '@components/layouts/Flex';
import { RadioValueContext, ContextRadioValue } from '@components/molecules/RadioButton';

export interface RadioGroupProps extends FlexProps, ContextRadioValue {
  defaultValue?: string | number;
}

const RadioGroup: React.FC<RadioGroupProps> = (props: React.PropsWithChildren<RadioGroupProps>) => {
  const { value, defaultValue, onChange, children, ...rest } = props;
  const contextValue = {
    value: value ?? defaultValue,
    onChange,
  };

  return (
    <Flex {...rest}>
      <RadioValueContext.Provider value={contextValue}>{children}</RadioValueContext.Provider>
    </Flex>
  );
};

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;

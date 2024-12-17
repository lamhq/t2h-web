import * as React from 'react';
import Flex, { FlexProps } from '@components/layouts/Flex';
import { Text } from '@components/atoms/Text';

interface StepperProps extends FlexProps {
  formName?: string;
  stepName: string;
  currentStep: number;
  numOfSteps: number;
  boxShadow?: string;
}

const Stepper: React.FC<StepperProps> = (props: StepperProps) => {
  const { formName, stepName, currentStep, numOfSteps, ...rest } = props;

  return (
    <Flex {...rest}>
      <Flex flexDirection="column">
        {formName && (
          <Text mt={0} mb={0} variant="extraSmall" color="inputText" fontFamily="secondary">
            {formName}
          </Text>
        )}
        {stepName && (
          <Text mb={0} mt="3px" color="text" fontSize="19px" lineHeight="27px" letterSpacing="0.09px" fontWeight="bold">
            {stepName}
          </Text>
        )}
      </Flex>
      <Text
        my={'auto'}
        ml={'auto'}
        mr={3}
        color="text"
        fontSize="19px"
        lineHeight="27px"
        letterSpacing="0.09px"
        fontWeight="bold"
      >{`${currentStep} of ${numOfSteps}`}</Text>
    </Flex>
  );
};

Stepper.displayName = 'Stepper';

export default Stepper;

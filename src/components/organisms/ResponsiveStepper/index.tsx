import React from 'react';
import Box from '@components/layouts/Box';
import Stepper from '@components/molecules/Stepper';
import HorizontalStepper from '@components/molecules/HorizontalStepper';
import { safeKey } from '@common/utils';

interface ResponsiveStepperProps {
  title: string;
  steps: string[];
  currentStep: number;
}

const ResponsiveStepper = (props: ResponsiveStepperProps) => {
  const { title, steps, currentStep } = props;
  const stepName = steps[safeKey(currentStep)];

  return (
    <>
      <Box display={{ _: 'block', md: 'none' }}>
        <Stepper formName={title} stepName={stepName} currentStep={currentStep + 1} numOfSteps={steps.length} />
      </Box>
      <Box display={{ _: 'none', md: 'block' }}>
        <HorizontalStepper currentStep={currentStep} title={title} steps={steps} />
      </Box>
    </>
  );
};

export default ResponsiveStepper;

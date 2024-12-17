import React from 'react';
import HorizontalStepper from '.';

export default { title: 'Molecules|HorizontalStepper' };

export function Standard() {
  const currentStep = 1;
  const steps = ['Personal details', 'Bank details', 'Submit application'];

  return <HorizontalStepper title="Seller registration" currentStep={currentStep} steps={steps} />;
}

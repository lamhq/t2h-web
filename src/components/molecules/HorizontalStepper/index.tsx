/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-restricted-imports */
import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import MuiStepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepConnector from '@material-ui/core/StepConnector';
import { StepIconProps } from '@material-ui/core/StepIcon';
import { CheckIcon } from '@components/atoms/IconButton';
import { Text } from '@components/atoms/Text';
import Flex from '@components/layouts/Flex';

const CustomStepper = withStyles({
  root: {
    flexGrow: 1,
    padding: 0,
  },
})(MuiStepper);

const CustomConnector = withStyles({
  alternativeLabel: {
    top: 12,
    left: 'calc(-50% + 14px)',
    right: 'calc(50% + 13px)',
  },
  active: {
    '& $line': {
      borderColor: '#1D3461',
    },
  },
  completed: {
    '& $line': {
      borderColor: '#1D3461',
    },
  },
  line: {
    borderColor: '#CDD6E7',
    borderTopWidth: 2,
  },
})(StepConnector);

const useCustomStepIconStyles = makeStyles({
  root: {
    borderRadius: '100%',
    border: '2px solid #CDD6E7',
    width: '23px',
    height: '23px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundColor: '#fff',
    borderColor: '#1D3461',
  },
  completed: {
    backgroundColor: '#1D3461',
    borderColor: '#1D3461',
  },
});

function CustomStepIcon(props: StepIconProps) {
  const classes = useCustomStepIconStyles();
  const { active, completed } = props;
  const className = `${classes.root} ${active && classes.active} ${completed && classes.completed}`;

  return <div className={className}>{completed && <CheckIcon color="white" size="20px" />}</div>;
}

interface StepperProps {
  currentStep: number;
  steps: string[];
  title: string;
}

const HorizontalStepper: React.FC<StepperProps> = (props: React.PropsWithChildren<StepperProps>) => {
  const { steps, currentStep, title } = props;

  return (
    <Flex alignItems="center">
      <Text mt={0} mb={0} color="#1D3461" fontSize="23px" fontWeight="bold">
        {title}
      </Text>
      <CustomStepper activeStep={currentStep} alternativeLabel connector={<CustomConnector />}>
        {steps.map((label, index) => {
          return (
            <Step key={label} completed={currentStep > index}>
              <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
            </Step>
          );
        })}
      </CustomStepper>
    </Flex>
  );
};

export default HorizontalStepper;

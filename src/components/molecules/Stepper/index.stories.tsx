import React from 'react';
import styled from 'styled-components';
import Stepper from './';

export default { title: 'Molecules|Stepper' };

const Container = styled.div`
  padding: 20px;
  width: 320px;

  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
`;

export const Standard = () => (
  <Container>
    <Stepper formName="Seller registration" stepName="Personal Details" currentStep={1} numOfSteps={3} />
    <Stepper formName="Seller registration" stepName="Bank Details" currentStep={2} numOfSteps={3} />
    <Stepper formName="Seller registration" stepName="Submit Applications" currentStep={3} numOfSteps={3} />
  </Container>
);

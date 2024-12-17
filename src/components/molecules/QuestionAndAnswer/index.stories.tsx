import React from 'react';
import styled from 'styled-components';
import { Text } from '@components/atoms/Text';
import QuestionAndAnswer from './index';

export default { title: 'Molecules|QuestionAndAnswer' };

const Container = styled.div`
  width: 288px;
  margin: 20px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
`;

export const Standard = () => {
  return (
    <Container>
      <QuestionAndAnswer title="An example of a truck2hand FAQ question">
        <Text my={0} color="darkGrey">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>

        <Text my={0} mt={4} color="darkGrey">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
      </QuestionAndAnswer>

      <QuestionAndAnswer title="What is Truck 2 Hand and how do you get started?">
        <Text my={0} color="darkGrey">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>

        <Text my={0} mt={4} color="darkGrey">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
      </QuestionAndAnswer>
    </Container>
  );
};

import React from 'react';
import styled from 'styled-components';
import ListingQuestionAndAnswer from './';

const Container = styled.div`
  padding: 20px;
  width: 288px;
`;

export default { title: 'Molecules|ListingQuestionAndAnswer' };

export const Standard = () => {
  return (
    <Container>
      <ListingQuestionAndAnswer
        questionerIconUrl={'/static/images/1.jpg'}
        questionerName={'Ivan Holloway'}
        questionDate={'5 days ago'}
        question={`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`}
        linkForQuestioner={'/'}
        linkForReport={'/'}
      />
    </Container>
  );
};

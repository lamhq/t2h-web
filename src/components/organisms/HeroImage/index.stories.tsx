import React from 'react';
import styled from 'styled-components';
import HeroImage from './index';

export default { title: 'Organisms|HeroImage' };

const Container = styled.div`
  margin: 16px;
  width: 500px;
  height: 1000px;
`;

const imageUrls = ['/static/images/1.jpg', '/static/images/2.jpg', '/static/images/3.jpg'];

export const Edit = () => {
  const [title, setTitle] = React.useState('theTRUCKCOMPANY');
  const [description, setDescription] = React.useState('YOUR WORLDWIDE PARTNER FOR ALL YOUR TRUCKING NEEDS');

  return (
    <Container>
      <HeroImage
        title={title}
        description={description}
        urls={imageUrls}
        isEditable={true}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
      />
    </Container>
  );
};

export const View = () => {
  const [title, setTitle] = React.useState('theTRUCKCOMPANY');
  const [description, setDescription] = React.useState('YOUR WORLDWIDE PARTNER FOR ALL YOUR TRUCKING NEEDS');

  return (
    <Container>
      <HeroImage
        title={title}
        description={description}
        urls={imageUrls}
        isEditable={false}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
      />
    </Container>
  );
};

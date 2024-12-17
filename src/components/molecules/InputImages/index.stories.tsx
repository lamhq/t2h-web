import React from 'react';
import styled from 'styled-components';
import InputImages, { ImageData } from './';

export default { title: 'Molecules|InputImages' };

const Container = styled.div`
  width: 288px;
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr;
`;

export const Standard = () => {
  const [images, setImages] = React.useState<ImageData[]>([]);

  const onImagesAdd = React.useCallback(
    (images: ImageData[]) => {
      setImages((prevImages: ImageData[]) => [...prevImages, ...images]);
    },
    [setImages],
  );

  const onImageRemove = React.useCallback(
    (image: ImageData) => {
      setImages((images) => {
        return images.filter((img: ImageData) => img.file !== image.file);
      });
    },
    [setImages],
  );

  return (
    <Container>
      <InputImages images={images} onImageRemove={onImageRemove} onImagesAdd={onImagesAdd} maximumNumber={2} />
    </Container>
  );
};

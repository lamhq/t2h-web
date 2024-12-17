import React from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';
import Dropzone from '@components/molecules/Dropzone';
import ImagePreview from './';

export default { title: 'Molecules|ImagePreview' };

const Container = styled.div`
  width: 288px;
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr;
`;

interface Image {
  file?: File;
  src?: string;
}

export const Standard = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [images, setImages] = React.useState<Image[]>([]);

  React.useEffect(() => {
    const newImages = [...images];

    for (const f of files) {
      const index = newImages.findIndex((img: Image) => img.file === f);

      if (index === -1) {
        newImages.push({
          file: f,
          src: URL.createObjectURL(f),
        });
      }
    }
    setImages(newImages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const onRemove = React.useCallback(
    (src: string) => {
      action('onRemove')(src);

      const image = images.find((img: Image) => img.src === src);

      if (image !== undefined) {
        setImages((images) => images.filter((img) => img.src !== image.src));
        setFiles((files) => files.filter((file: File) => file !== image.file));
      }
    },
    [images, setFiles],
  );

  return (
    <Container>
      <Dropzone value={files} onDrop={(fileList) => setFiles(fileList)} />
      {images.map((image, i) => (
        <ImagePreview key={i} src={image.src} onRemove={onRemove} />
      ))}
    </Container>
  );
};

import React from 'react';
import styled from 'styled-components';
import Flex from '@components/layouts/Flex';
import Dropzone from '@components/molecules/Dropzone';
import ImagePreview from '@components/molecules/ImagePreview';

const InputImagesContainer = styled(Flex)`
  & > *:not(:first-child) {
    margin-top: 8px;
  }
`;

const DropzoneWrapper = styled.div``;

export interface ImageData {
  src?: string;
  hashId?: string;
  file?: File;
}

interface InputImagesProps {
  ref?: React.Ref<HTMLInputElement>;
  name?: string;
  images: ImageData[];
  maximumNumber?: number;
  hasError?: boolean;

  onImageRemove: (image: ImageData) => void;
  onImagesAdd: (images: ImageData[]) => void;
}

const InputImages = (props: InputImagesProps) => {
  const { images, maximumNumber, name, hasError, onImageRemove, onImagesAdd } = props;
  const files = React.useMemo(() => images.filter((img: ImageData) => img.file).map((img: ImageData) => img.file), [images]);
  const isDropzoneDisplay = !maximumNumber || images.length < maximumNumber ? 'block' : 'none';

  const onRemove = React.useCallback(
    (src: string) => {
      const image = images.find((img: ImageData) => img.src === src);

      if (image) {
        if (image.file && image.src) {
          URL.revokeObjectURL(image.src);
          delete image.src;
        }

        if (onImageRemove) {
          onImageRemove(image);
        }
      }
    },
    [images, onImageRemove],
  );

  const onDrop = React.useCallback(
    (files: File[]) => {
      const newImages = [];

      for (const file of files) {
        const img = images.find((img: ImageData) => img.file === file);

        if (!img && (!maximumNumber || images.length + newImages.length < maximumNumber)) {
          newImages.push({ file, src: URL.createObjectURL(file) });
        }
      }
      onImagesAdd(newImages);
    },
    [images, maximumNumber, onImagesAdd],
  );

  return (
    <InputImagesContainer flexDirection="column">
      {images &&
        images.map((img, index) => {
          return <ImagePreview key={index} src={img.src} height={{ _: '141px', md: '285px' }} onRemove={onRemove} />;
        })}
      {/* use css display for react hook form */}
      <DropzoneWrapper style={{ display: isDropzoneDisplay }}>
        <Dropzone
          name={name}
          height={{ _: '141px', md: '285px' }}
          acceptedFileTypes={['image/gif', 'image/jpeg', 'image/jpg', 'image/png']}
          value={files}
          onDrop={onDrop}
          hasError={hasError}
          isMultiple
        />
      </DropzoneWrapper>
    </InputImagesContainer>
  );
};

InputImages.displayName = 'InputImages';

export default InputImages;

interface StandardInputImagesProps {
  value?: ImageData[];
  onChange: (data: ImageData[]) => void;
  maximumNumber?: number;
}

export const StandardInputImages: React.FC<StandardInputImagesProps> = ({
  value,
  onChange,
  maximumNumber = 1,
  ...rest
}: React.PropsWithChildren<StandardInputImagesProps>) => {
  const onImagesAdd = (images: ImageData[]) => {
    onChange([...value, ...images]);
  };

  const onImageRemove = (image: ImageData) => {
    onChange(value.filter((img: ImageData) => img.file !== image.file));
  };

  return <InputImages images={value} onImageRemove={onImageRemove} onImagesAdd={onImagesAdd} maximumNumber={maximumNumber} {...rest} />;
};

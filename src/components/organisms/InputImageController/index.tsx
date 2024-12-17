import React, { useCallback, useState } from 'react';
import InputImages, { ImageData } from '@components/molecules/InputImages';

type ImagePreview = { id?: string; src: string; file?: File };

type InputImageControllerProps = {
  ref?: React.Ref<HTMLInputElement>;
  name?: string;
  maximumNumber?: number;
  defaultImages: ImageData[];
  hasError?: boolean;
  onChange?: (images: ImageData[]) => void;
};

const InputImageController: React.FC<InputImageControllerProps> = React.forwardRef(
  (props: InputImageControllerProps, ref: React.Ref<HTMLInputElement>) => {
    const { defaultImages, maximumNumber, name, hasError, onChange } = props;
    const [images, setImages] = useState<ImageData[]>(defaultImages);
    const handleImagesAdd = useCallback(
      (addedImages: ImageData[]) => {
        const newImages = [...images, ...addedImages];

        setImages(newImages);
        onChange && onChange(newImages);
      },
      [images, onChange],
    );
    const handleImageRemove = React.useCallback(
      (removedImage: ImageData) => {
        const newImages = images.filter((img: ImageData) => img !== removedImage);

        setImages(newImages);
        onChange && onChange(newImages);
      },
      [images, onChange],
    );

    return (
      <InputImages
        ref={ref}
        name={name}
        images={images}
        hasError={hasError}
        onImagesAdd={handleImagesAdd}
        onImageRemove={handleImageRemove}
        maximumNumber={maximumNumber}
      />
    );
  },
);

InputImageController.displayName = 'InputImageController';

InputImageController.defaultProps = {
  maximumNumber: 1,
  defaultImages: [],
};

export default InputImageController;

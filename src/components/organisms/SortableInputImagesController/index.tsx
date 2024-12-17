import React, { useCallback, useState } from 'react';
import { GridSortableInputImages } from '@components/organisms/SortableInputImages';
import { ImageData } from '@components/molecules/InputImages';

type SortableInputImagesControllerProps = {
  ref?: React.Ref<HTMLInputElement>;
  name?: string;
  maximumNumber?: number;
  defaultImages: ImageData[];
  mainImageTitle?: string;
  hasError?: boolean;
  onChange?: (images: ImageData[]) => void;
};

const SortableInputImagesController: React.FC<SortableInputImagesControllerProps> = React.forwardRef(
  (props: SortableInputImagesControllerProps, ref: React.Ref<HTMLInputElement>) => {
    const { defaultImages, maximumNumber, mainImageTitle, name, hasError, onChange } = props;
    const [images, setImages] = useState<ImageData[]>(defaultImages);
    const handleChange = useCallback(
      (images: ImageData[]) => {
        setImages(images);
        onChange && onChange(images);
      },
      [setImages, onChange],
    );

    return (
      <GridSortableInputImages
        ref={ref}
        name={name}
        mainImageTitle={mainImageTitle}
        images={images}
        onChange={handleChange}
        maximumNumber={maximumNumber}
        hasError={hasError}
      />
    );
  },
);

SortableInputImagesController.displayName = 'SortableInputImagesController';

SortableInputImagesController.defaultProps = {
  maximumNumber: 1,
  defaultImages: [],
};

export default SortableInputImagesController;

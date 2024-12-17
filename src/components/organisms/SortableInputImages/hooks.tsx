import React from 'react';
import { ImageData } from '@components/molecules/InputImages';
import { safeKey } from '@common/utils';

export const useSortableInputImagesState = (images: ImageData[], onChange: (images: ImageData[]) => void, maximumNumber: number) => {
  const onDrop = React.useCallback(
    (files: File[]) => {
      const newImages = [...images];

      for (const file of Array.from(files)) {
        const img = images.find((img: ImageData) => img.file === file);

        if (!img && (!maximumNumber || newImages.length < maximumNumber)) {
          newImages.push({ file, src: URL.createObjectURL(file) });
        }
      }
      onChange(newImages);
    },
    [images, maximumNumber, onChange],
  );

  const onRemove = React.useCallback(
    (index: number) => {
      const image = images[safeKey(index)];

      if (image) {
        if (image.file && image.src) {
          URL.revokeObjectURL(image.src);
        }
      }

      const newImages = images.filter((_, i) => i !== index);

      onChange(newImages);
    },
    [images, onChange],
  );

  const [isSorting, setIsSorting] = React.useState(false);
  const onSortStart = React.useCallback(() => setIsSorting(true), [setIsSorting]);
  const onSortEnd = React.useCallback(() => setIsSorting(false), [setIsSorting]);

  const isDropzoneVisible = !maximumNumber || images.length < maximumNumber;
  const files = React.useMemo(() => images.filter((img: ImageData) => img.file).map((img: ImageData) => img.file), [images]);

  return { onDrop, onRemove, isSorting, onSortStart, onSortEnd, isDropzoneVisible, files };
};

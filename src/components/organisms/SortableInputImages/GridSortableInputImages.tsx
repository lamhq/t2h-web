import React from 'react';
import styled from 'styled-components';
import { grid, GridProps, LayoutProps } from 'styled-system';
import { ReactSortable } from 'react-sortablejs';
import Box from '@components/layouts/Box';
import Dropzone from '@components/molecules/Dropzone';
import ImagePreview from '@components/molecules/ImagePreview';
import { ImageData } from '@components/molecules/InputImages';
import { useSortableInputImagesState } from './hooks';

interface SortableInputImagesProps extends GridProps {
  ref?: React.Ref<HTMLInputElement>;
  images: ImageData[];
  onChange?: (images: ImageData[]) => void;
  name?: string;
  hasError?: boolean;
  maximumNumber?: number;
  mainImageTitle?: string;
  subImageTitle?: string;
  mainImageHeight?: LayoutProps['maxHeight'];
  subImageHeight?: LayoutProps['maxHeight'];
}

const GridSortableImagesContainer = styled(ReactSortable)<GridProps>`
  width: 100%;
  display: grid;
  ${grid}
  gap: 16px;

  > *:first-child {
    grid-column-start: 1;
    grid-column-end: 3;
    margin-left: auto;
    margin-right: auto;

    @media screen and (min-width: ${({ theme }) => theme.breakpoints['md']}) {
      grid-column-end: 4;
    }
  }
  overflow-x: hidden;
  overflow-y: hidden;
`;

const SortableImageWrapper = styled.div`
  display: flex;
  box-sizing: border-box;
  align-self: center;
  justify-self: center;

  ${grid}

  &.sortable-ghost {
    background-color: #c8ebfb;
  }
`;

const GridSortableInputImages: React.FC<SortableInputImagesProps> = React.forwardRef(
  (props: SortableInputImagesProps, ref: React.Ref<HTMLInputElement>) => {
    const { images, onChange, hasError, maximumNumber, mainImageTitle, subImageTitle, mainImageHeight, subImageHeight, ...rest } = props;
    const gridProps = rest as GridProps;

    const { onDrop, onRemove, isSorting, onSortStart, onSortEnd, isDropzoneVisible, files } = useSortableInputImagesState(
      images,
      onChange,
      maximumNumber,
    );

    return (
      <Box mt={2}>
        <GridSortableImagesContainer
          list={images}
          setList={onChange}
          animation={200}
          onStart={onSortStart}
          onEnd={onSortEnd}
          {...gridProps}
        >
          {images.map((image, index) => {
            const title = !isSorting ? (index === 0 ? mainImageTitle : subImageTitle) : '';
            const height = index === 0 ? mainImageHeight : subImageHeight;

            return (
              <SortableImageWrapper key={index}>
                <ImagePreview src={image.src} title={title} height={height} onRemove={() => onRemove(index)} />
              </SortableImageWrapper>
            );
          })}
        </GridSortableImagesContainer>
        {isDropzoneVisible && (
          <Box mt={3}>
            <Dropzone
              ref={ref}
              height={subImageHeight}
              acceptedFileTypes={['image/gif', 'image/jpeg', 'image/jpg', 'image/png']}
              value={files}
              onDrop={onDrop}
              hasError={hasError}
              isMultiple
            />
          </Box>
        )}
      </Box>
    );
  },
);

GridSortableInputImages.displayName = 'GridSortableInputImages';

GridSortableInputImages.defaultProps = {
  mainImageHeight: { _: '215px', md: '374px' },
  subImageHeight: { _: '101px', md: '116px' },
  gridTemplateColumns: { _: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
};

export default GridSortableInputImages;

import React, { DragEvent, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { getFilesFromEvent } from '@common/utils';
import { isIeOrEdge } from '@common/utils/browser';
import { withTranslation, WithTranslation } from 'react-i18next';
import { CloudUploadIcon, AddIcon } from '@components/atoms/IconButton';
import { layout, LayoutProps, HeightProps, WidthProps } from 'styled-system';

type FileType = 'image/png' | 'image/jpeg' | 'image/jpg' | 'image/gif' | 'application/pdf';

export enum DropzoneIconVariant {
  Small = 'small',
  Normal = 'normal',
}

interface DropzoneProps extends WithTranslation, LayoutProps {
  ref?: React.Ref<HTMLInputElement>;
  value?: File[];
  name?: string;
  label?: string;
  unexpectedFileTypeMessage?: string;
  acceptedFileTypes?: FileType[];
  isMultiple?: boolean;
  onDrop?: (files: File[]) => void;
  onChange?: (files: File[]) => void;
  variant?: DropzoneIconVariant;
  width?: LayoutProps['width'];
  height?: LayoutProps['height'];
  hasError?: boolean;
}

type DropzoneRootProps = { isFocused: boolean; hasError: boolean } & LayoutProps;

const DropzoneRoot = styled.div<DropzoneRootProps>`
  border: 1px dashed
    ${({ theme, isFocused, hasError }) => {
      if (hasError) {
        return theme.colors.danger;
      } else if (isFocused) {
        return theme.colors.borderFocused;
      } else {
        return theme.colors.border;
      }
    }};
  border-radius: 8px;
  cursor: pointer;
  ${layout}
`;

DropzoneRoot.defaultProps = {
  width: '100%',
  height: '144px',
};

const DropzoneContent = styled.div<HeightProps & WidthProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${layout}
`;

DropzoneContent.defaultProps = {
  width: '100%',
  height: '144px',
};

const DropzoneInputFile = styled.input`
  display: none;
`;

const Dropzone: React.FC<DropzoneProps> = (props: DropzoneProps) => {
  const {
    onDrop,
    onChange,
    t,
    value,
    name,
    label,
    acceptedFileTypes,
    unexpectedFileTypeMessage,
    variant,
    isMultiple,
    hasError,
    ...rest
  } = props;
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  // Fn for opening the file dialog programmatically
  const openFileDialog = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, [inputRef]);

  const handleChange = useCallback(
    (e) => {
      setIsFocused(false);

      const files = value.concat(getFilesFromEvent(e).filter((f) => acceptedFileTypes.includes(f.type as FileType)));

      onDrop && onDrop(files);
      onChange && onChange(files);
    },
    [value, acceptedFileTypes, onDrop, onChange],
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsFocused(false);

      const files = value.concat(getFilesFromEvent(e).filter((f) => acceptedFileTypes.includes(f.type as FileType)));

      if (files.length == 0) {
        return window.alert(
          `${unexpectedFileTypeMessage ?? t('Please specify the following file types.')} (${acceptedFileTypes.join(' ,')})`,
        );
      }

      onDrop && onDrop(files);
      onChange && onChange(files);
    },
    [value, t, onDrop, onChange, unexpectedFileTypeMessage, acceptedFileTypes],
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFocused(false);
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFocused(true);
  }, []);

  const handleClick = useCallback(() => {
    // In IE11/Edge the file-browser dialog is blocking, therefore, use setTimeout()
    // to ensure React can handle state changes
    // See: https://github.com/react-dropzone/react-dropzone/issues/450
    if (isIeOrEdge()) {
      setTimeout(openFileDialog, 0);
    } else {
      openFileDialog();
    }
  }, [openFileDialog]);

  return (
    <React.Fragment>
      <DropzoneRoot
        ref={rootRef}
        isFocused={isFocused}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDragEnter={handleDragEnter}
        onClick={handleClick}
        hasError={hasError}
        {...rest}
      >
        <DropzoneInputFile
          ref={inputRef}
          type="file"
          name={name}
          accept={acceptedFileTypes.join(',')}
          onChange={handleChange}
          multiple={isMultiple}
        />
        <DropzoneContent width={rest.width} height={rest.height}>
          {variant === DropzoneIconVariant.Normal ? (
            <>
              <CloudUploadIcon size="24px" />
              <span style={{ textAlign: 'center' }}>{label ?? t('Upload from device')}</span>
            </>
          ) : (
            <AddIcon size="18px" />
          )}
        </DropzoneContent>
      </DropzoneRoot>
    </React.Fragment>
  );
};

Dropzone.displayName = 'Dropzone';

Dropzone.defaultProps = {
  acceptedFileTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'application/pdf'],
  variant: DropzoneIconVariant.Normal,
  hasError: false,
};

export default withTranslation('common', { withRef: true })(Dropzone);

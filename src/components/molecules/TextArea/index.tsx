import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import InputLabel from '@components/atoms/InputLabel';
import InputHelperText from '@components/atoms/InputHelperText';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: React.Ref<HTMLTextAreaElement>;
  label?: string;
  helperText?: string;
  hasError?: boolean;
  minRows?: number;
  maxRows?: number;
}

const TextAreaWapper = styled.div``;

const StyledTextArea = styled.textarea<{ hasError: boolean; ref: any }>`
  color: ${({ theme }) => theme.colors.inputText};
  border: 1px solid ${({ theme, hasError }) => (hasError ? theme.colors.danger : theme.colors.border)};
  border-radius: 5px;
  box-sizing: border-box;
  outline: none;
  width: 100%;
  font-size: 14px;
  line-height: 24px;
  padding: 9px 12px 10px 12px;
  resize: none;
  overflow: auto;
  height: auto;

  &::placeholder {
    color: ${({ theme }) => theme.colors.placeholder};
  }
`;

// eslint-disable-next-line complexity
const TextArea: React.FC<TextAreaProps> = React.forwardRef((props: TextAreaProps, ref: React.Ref<HTMLTextAreaElement>) => {
  const { rows, minRows, maxRows, label, helperText, hasError, children, onChange, ...rest } = props;
  const [textareaRows, setTextareaRows] = useState(Math.min(rows, minRows));

  console.assert(!(rows < minRows), 'TextArea: rows should be greater than minRows.');

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const textareaLineHeight = 24;
      const previousRows = e.target.rows;

      e.target.rows = minRows; // reset number of rows in textarea

      const currentRows = Math.floor(e.target.scrollHeight / textareaLineHeight);

      if (currentRows === previousRows) {
        e.target.rows = currentRows;
      }

      if (currentRows >= maxRows) {
        e.target.rows = maxRows;
        e.target.scrollTop = e.target.scrollHeight;
      }

      setTextareaRows(currentRows < maxRows ? currentRows : maxRows);
      onChange && onChange(e);
    },
    [onChange, minRows, maxRows],
  );

  return (
    <React.Fragment>
      {label && label.length > 0 && <InputLabel>{label}</InputLabel>}
      <TextAreaWapper>
        <StyledTextArea
          ref={ref}
          hasError={hasError}
          onChange={handleChange}
          aria-label={label || rest.placeholder}
          rows={textareaRows}
          {...rest}
        >
          {children}
        </StyledTextArea>
        {helperText && helperText.length > 0 && <InputHelperText hasError={hasError}>{helperText}</InputHelperText>}
      </TextAreaWapper>
    </React.Fragment>
  );
});

TextArea.displayName = 'TextArea';
TextArea.defaultProps = {
  rows: 5,
  minRows: 5,
  maxRows: 10,
};

export default TextArea;

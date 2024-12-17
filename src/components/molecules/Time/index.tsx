/* eslint-disable no-restricted-imports */
import * as React from 'react';
import {
  KeyboardDatePicker,
  KeyboardDateTimePicker,
  KeyboardTimePicker,
  KeyboardDatePickerProps,
  KeyboardDateTimePickerProps,
  KeyboardTimePickerProps,
} from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import AccessTimeIcon from '@material-ui/icons/AccessTime';

const useInputStyles = makeStyles({
  root: {
    height: '38px',
    padding: '11px 12px 12px 9px',
    boxSizing: 'border-box',
  },
});

const useInputContainerStyles = makeStyles({
  root: {
    paddingRight: 0,
    borderRadius: '5px',
    borderColor: '#ddd',
    '&$focused $notchedOutline': {
      borderColor: '#ddd',
      borderWidth: 1,
    },
    '&:hover $notchedOutline': {
      borderColor: '#ddd',
    },
  },
  focused: {},
  notchedOutline: {},
});

export const InputDate: React.FC<KeyboardDatePickerProps> = (props: KeyboardDatePickerProps) => {
  const { onChange, ...rest } = props;
  const inputClasses = useInputStyles();
  const inputProps = { className: inputClasses.root };
  const inputContainerClasses = useInputContainerStyles();
  const inputContainerProps = { classes: inputContainerClasses };

  function handleChange(value) {
    value && onChange(value.toDate());
  }

  return <KeyboardDatePicker onChange={handleChange} inputProps={inputProps} InputProps={inputContainerProps} {...rest} />;
};

InputDate.defaultProps = {
  format: 'DD/MM/YYYY',
  disableToolbar: true,
  fullWidth: true,
  variant: 'inline',
  margin: 'none',
  inputVariant: 'outlined',
};

//Important: For material-ui-pickers v3 use v1.x version of @date-io adapters.
export const InputDateTime: React.FC<KeyboardDateTimePickerProps> = (props: KeyboardDateTimePickerProps) => {
  const { onChange, ...rest } = props;
  const inputClasses = useInputStyles();
  const inputProps = { className: inputClasses.root };
  const inputContainerClasses = useInputContainerStyles();
  const inputContainerProps = { classes: inputContainerClasses };

  function handleChange(value) {
    value && onChange(value.toDate());
  }

  return <KeyboardDateTimePicker onChange={handleChange} inputProps={inputProps} InputProps={inputContainerProps} {...rest} />;
};

InputDateTime.defaultProps = {
  format: 'DD/MM/YYYY hh:mm a',
  fullWidth: true,
  margin: 'none',
  inputVariant: 'outlined',
};

//Important: For material-ui-pickers v3 use v1.x version of @date-io adapters.
export const InputTime: React.FC<KeyboardTimePickerProps> = (props: KeyboardTimePickerProps) => {
  const inputClasses = useInputStyles();
  const inputProps = { className: inputClasses.root };
  const inputContainerClasses = useInputContainerStyles();
  const inputContainerProps = { classes: inputContainerClasses };

  return <KeyboardTimePicker inputProps={inputProps} InputProps={inputContainerProps} {...props} />;
};

InputTime.defaultProps = {
  format: 'hh:mm a',
  disableToolbar: true,
  fullWidth: true,
  variant: 'inline',
  margin: 'none',
  inputVariant: 'outlined',
  keyboardIcon: <AccessTimeIcon />,
};

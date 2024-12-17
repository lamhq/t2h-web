import React, { useState, useEffect } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { FormControl } from '@components/layouts/FormGroup';
import { TextLabel } from '@components/atoms/Text';
import InputLabel from '@components/atoms/InputLabel';
import Box from '@components/layouts/Box';

export interface EditableFormControlProps extends WithTranslation {
  isEditable: boolean;
  getValues: Function;
  children?: React.ReactElement<{ label: string; value: string; name: string; type: string }>;
}

const EditableFormControl: React.FC<EditableFormControlProps> = ({ isEditable, getValues, t, children }: EditableFormControlProps) => {
  const { label, name } = children.props;
  const [value, setValue] = useState(getValues(name));

  console.assert(label && name, 'You have to set a child with label and name');

  const renderNonEditableInput = (label, value) => {
    const hasValue = !!value;

    return (
      <React.Fragment>
        <InputLabel>{label}</InputLabel>
        <Box mt={2} mb={3}>
          <TextLabel variant="medium" color={hasValue ? 'inputText' : 'lightGrey'}>
            {hasValue ? value : t('Please enter')}
          </TextLabel>
        </Box>
      </React.Fragment>
    );
  };

  useEffect(() => {
    setValue(getValues(name));
  }, [getValues, name, isEditable]);

  return <FormControl>{isEditable ? children : renderNonEditableInput(label, value)}</FormControl>;
};

EditableFormControl.displayName = 'EditableFormControl';

EditableFormControl.defaultProps = {
  isEditable: false,
};

export default withTranslation('common')(EditableFormControl);

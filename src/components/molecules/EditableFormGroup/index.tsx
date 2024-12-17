import * as React from 'react';
import { FormGroup } from '@components/layouts/FormGroup';

export interface EditableFormGroupProps {
  children?: React.ReactNode;
}

const EditableFormGroup: React.FC<EditableFormGroupProps> = ({ children }: EditableFormGroupProps) => {
  return <FormGroup>{children}</FormGroup>;
};

export default EditableFormGroup;

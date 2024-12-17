import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import EditableFormControl from '@components/molecules/EditableFormControl';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import InputText from '@components/molecules/InputText';
import { TextLink } from '@components/atoms/Text';
import { SubTitle } from '@components/atoms/Title';
import { Button } from '@components/atoms/Button';
import EditableFormGroup from './index';

export default { title: 'Molecules|EditableForm' };

export const Standard: React.FC = () => {
  const [isEditable, setIsEditable] = useState(false);
  const handleEditLinkClick = useCallback(() => {
    setIsEditable(!isEditable);
  }, [isEditable]);
  const { register, getValues } = useForm({
    mode: 'onChange',
    defaultValues: {
      username: 'taketo',
      email: 'taketo@truck2hand.com',
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setIsEditable(false);
      }}
    >
      <EditableFormGroup>
        <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
          <SubTitle>Editable Form</SubTitle>
          <div>
            <TextLink onClick={handleEditLinkClick}>Edit</TextLink>
          </div>
        </Flex>
        <EditableFormControl getValues={getValues} isEditable={isEditable}>
          <InputText ref={register} type="text" name="username" label="Username" />
        </EditableFormControl>
        <EditableFormControl getValues={getValues} isEditable={isEditable}>
          <InputText ref={register} type="text" name="email" label="Email" />
        </EditableFormControl>
        {isEditable && (
          <Box mt={3}>
            <Box mb={2}>
              <Button type="submit" variant="primary">
                Update
              </Button>
            </Box>
            <Box>
              <Button type="submit" variant="transparent" onClick={handleEditLinkClick}>
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </EditableFormGroup>
    </form>
  );
};

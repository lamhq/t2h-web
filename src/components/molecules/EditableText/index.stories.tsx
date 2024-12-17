import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import EditableText from './index';

export default { title: 'Molecules|EditableText' };

export const Standard: React.FC = () => {
  const { getValues, control } = useForm({
    mode: 'onChange',
    defaultValues: {
      text1: 'Single Line',
      text2: 'Multiline',
      text3: 'Centerized',
    },
  });

  const [isEditable, setIsEditable] = React.useState([true, true, false]);
  const updateIsEditable = React.useCallback(
    (index: number, value: boolean) => {
      const newIsEditable = [...isEditable];

      // eslint-disable-next-line security/detect-object-injection
      newIsEditable[index] = value;
      setIsEditable(newIsEditable);
    },
    [isEditable],
  );

  return (
    <form>
      <Flex flexDirection="column" mx={3} px={3}>
        <Box my={3} width="200px">
          <Controller
            control={control}
            as={EditableText}
            name="text1"
            defaultValue={getValues('text1')}
            isEditable={isEditable[0]}
            isEditIconVisible={true}
            isMultiline={false}
            onEditIconClick={() => updateIsEditable(0, !isEditable[0])}
            inputProps={{ mt: 0, mb: 0, ml: 2, mr: 3, variant: 'large', color: 'black', fontWeight: 'bold' }}
            containerProps={{ borderWidth: '1px', borderStyle: 'solid', borderColor: 'black' }}
          />
        </Box>
        <Box my={3} width="400px">
          <Controller
            control={control}
            as={EditableText}
            name="text2"
            defaultValue={getValues('text2')}
            isEditIconVisible={true}
            isEditable={isEditable[1]}
            isMultiline={true}
            onEditIconClick={() => updateIsEditable(1, !isEditable[1])}
            inputProps={{ mt: 0, mb: 0, ml: 2, mr: 3, variant: 'large', color: 'black', fontWeight: 'bold' }}
            containerProps={{ borderWidth: '1px', borderStyle: 'solid', borderColor: 'black' }}
          />
        </Box>

        <Box my={3} width="400px">
          <Controller
            control={control}
            as={EditableText}
            name="text3"
            defaultValue={getValues('text3')}
            isEditIconVisible={true}
            isEditable={isEditable[2]}
            isMultiline={true}
            onEditIconClick={() => updateIsEditable(2, !isEditable[2])}
            inputProps={{ mt: 0, mb: 0, ml: 2, mr: 3, variant: 'large', color: 'black', fontWeight: 'bold', textAlign: 'center' }}
            containerProps={{ borderWidth: '1px', borderStyle: 'solid', borderColor: 'black' }}
          />
        </Box>
      </Flex>
    </form>
  );
};

/*
        <Box my={3} width="200px">
          <EditableText
            ref={register}
            isEditable={isEditable[1]}
            getValues={getValues}
            onEditIconClick={() => updateIsEditable(1, !isEditable[1])}
            inputProps={{ name: 'text2', mt: 0, mb: 0, mx: 2, variant: 'large', color: 'black', fontWeight: 'bold' }}
            borderWidth="1px"
            borderStyle="solid"
            borderColor="white"
          />
        </Box>
        <Box my={3} width="200px">
          <EditableText
            ref={register}
            isEditable={isEditable[2]}
            getValues={getValues}
            onEditIconClick={() => updateIsEditable(2, !isEditable[2])}
            inputProps={{ name: 'text2', mt: 0, mb: 0, mx: 2, variant: 'large', color: 'black', fontWeight: 'bold' }}
            borderWidth="1px"
            borderStyle="solid"
            borderColor="white"
          />
        </Box>
        */

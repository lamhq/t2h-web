import * as React from 'react';
import { TFunction } from 'next-i18next';
import styled from 'styled-components';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import { Text } from '@components/atoms/Text';
import { Button } from '@components/atoms/Button';

const CancelChangeText = styled(Text)`
  text-decoration: underline;
  cursor: pointer;
`;

interface OwnerHeaderProps {
  t: TFunction;
  isEditing: boolean;
  onEditClick: React.MouseEventHandler;
  onCancelChangeClick: React.MouseEventHandler;
  onUpdateClick: React.MouseEventHandler;
}

const OwnerHeader = (props: OwnerHeaderProps) => {
  const { t, isEditing, onEditClick, onCancelChangeClick, onUpdateClick } = props;

  return (
    <Flex height="71px" mx={3} alignItems="center">
      {isEditing === true ? (
        <>
          <CancelChangeText variant="small" color="link" fontFamily="secondary" onClick={onCancelChangeClick}>
            {t(`Cancel changes`)}
          </CancelChangeText>
          <Box width="120px" ml="auto">
            <Button variant="update" onClick={onUpdateClick}>
              {t(`Update`)}
            </Button>
          </Box>
        </>
      ) : (
        <Box width="120px" ml="auto">
          <Button variant="transparent" onClick={onEditClick}>
            {t(`Edit profile`)}
          </Button>
        </Box>
      )}
    </Flex>
  );
};

export default OwnerHeader;

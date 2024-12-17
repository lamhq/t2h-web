import React from 'react';
import styled from 'styled-components';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import { Text } from '@components/atoms/Text';
import { ExpandMoreIcon, ExpandLessIcon } from '@components/atoms/IconButton';
import { space, SpaceProps } from 'styled-system';

const Container = styled.div<{ isOpen: boolean } & SpaceProps>`
  ${space}
  border-radius: 6px;
  background-color: ${({ isOpen }) => (isOpen ? '#F0F4F7' : '#F9F9F9')};
`;

const TitleContainer = styled(Flex)`
  cursor: pointer;
  box-sizing: border-box;
  padding: 8px 20px 9px 8px;
`;

const ContentContainer = styled.div`
  box-sizing: border-box;
  padding: 0px 8px 19px 8px;
`;

interface QuestionAndAnswerProps extends SpaceProps {
  title: string;
  children?: React.ReactNode;
}

const QuestionAndAnswer: React.FC<QuestionAndAnswerProps> = (props: QuestionAndAnswerProps) => {
  const { title, children, ...rest } = props;

  const [isOpen, setIsOpen] = React.useState(false);

  const onTitleClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsOpen((isOpen) => !isOpen);
    },
    [setIsOpen],
  );

  return (
    <Container isOpen={isOpen} {...rest}>
      <TitleContainer alignItems="center" onClick={onTitleClick}>
        <Text my={0} ml={0} mr="18px" textAlign="left" fontFamily="secondary" fontWeight="bold" color="text">
          {title}
        </Text>
        <Box ml="auto">{isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}</Box>
      </TitleContainer>
      {isOpen && children && <ContentContainer>{children}</ContentContainer>}
    </Container>
  );
};

QuestionAndAnswer.defaultProps = {
  mb: 3,
};

export default QuestionAndAnswer;

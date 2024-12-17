import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import Image from '@components/atoms/Image';
import { Text, TextLink } from '@components/atoms/Text';
import { withTranslation } from 'react-i18next';
import { WithTranslation, TFunction } from 'next-i18next';

const QuestionerContainer = styled(Flex)<{ isLink?: boolean }>`
  cursor: ${({ isLink }) => (isLink ? 'pointer' : '')};
`;

interface QuestionerHeaderProps {
  t: TFunction;
  questionerIconUrl?: string;
  questionerName: string;
  questionDate: string;
  linkForQuestioner?: string;
  linkForReport: string;
}

const QuestionerHeader = (props: QuestionerHeaderProps) => {
  const { t, questionerIconUrl, questionerName, questionDate, linkForQuestioner, linkForReport } = props;
  const isLink = !!linkForQuestioner;

  return (
    <Flex alignItems="center">
      {isLink ? (
        <Link href={linkForQuestioner}>
          <QuestionerContainer alignItems="center" isLink={isLink}>
            {questionerIconUrl && <Image src={questionerIconUrl} shape="circle" width="18px" height="18px" />}
            <Text mt={0} mb={0} ml={questionerIconUrl ? 1 : 0} color="#010101" fontWeight="bold" fontFamily="secondary">
              {questionerName}
            </Text>
          </QuestionerContainer>
        </Link>
      ) : (
        <QuestionerContainer alignItems="center" isLink={isLink}>
          {questionerIconUrl && <Image src={questionerIconUrl} shape="circle" width="18px" height="18px" />}
          <Text mt={0} mb={0} ml={questionerIconUrl ? 1 : 0} color="#010101" fontWeight="bold" fontFamily="secondary">
            {questionerName ?? t('Anonymous')}
          </Text>
        </QuestionerContainer>
      )}
      <Text mt={0} mb={0} ml="9px" variant="small" color="#a9a9a9" fontFamily="secondary">
        {questionDate}
      </Text>

      <Box display={{ _: 'none', md: 'block' }} ml="auto">
        <TextLink href={linkForReport} my={0}>
          {t(`Report`)}
        </TextLink>
      </Box>
    </Flex>
  );
};

interface ListingQuestionAndAnswerProps extends WithTranslation {
  questionerIconUrl?: string;
  questionerName: string;
  questionDate: string;
  question: string;
  linkForReport: string;
  linkForQuestioner?: string;
}

const ListingQuestionAndAnswer: React.FC<ListingQuestionAndAnswerProps> = (props: ListingQuestionAndAnswerProps) => {
  const { t, questionerIconUrl, questionerName, questionDate, question, linkForReport, linkForQuestioner } = props;

  return (
    <Flex flexDirection="column">
      <Flex mx={2} flexDirection="column">
        <QuestionerHeader
          t={t}
          questionerIconUrl={questionerIconUrl}
          questionerName={questionerName}
          questionDate={questionDate}
          linkForQuestioner={linkForQuestioner}
          linkForReport={linkForReport}
        />
        <Text my={0} mt={1} color="description" fontFamily="secondary">
          {question}
        </Text>
        <Flex display={{ _: 'block', md: 'none' }} mt={2}>
          <Box ml="auto">
            <TextLink href={linkForReport} my={0}>
              {t(`Report`)}
            </TextLink>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default withTranslation('common')(ListingQuestionAndAnswer);

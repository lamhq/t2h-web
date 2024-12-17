import * as React from 'react';
import styled from 'styled-components';
import { Text } from '@components/atoms/Text';
import { InfoOutlinedIcon } from '@components/atoms/IconButton';
import Flex from '@components/layouts/Flex';
import { SpaceProps } from 'styled-system';

const Content = styled.div`
  flex-grow: 1;
  margin-left: 8px;
`;

interface AnnotationProps extends SpaceProps {
  title: string;
}

const Annotation: React.FC<AnnotationProps> = (props: React.PropsWithChildren<AnnotationProps>) => {
  const { title, children, ...spaceProps } = props;

  return (
    <Flex {...spaceProps}>
      <InfoOutlinedIcon color="lightGrey" size="18px" />
      <Content>
        <Text fontWeight="bold" color="#8898aa" mt={0} fontSize={0} lineHeight={0}>
          {title}
        </Text>
        {children}
      </Content>
    </Flex>
  );
};

Annotation.defaultProps = {
  mb: 3,
};

export default Annotation;

import * as React from 'react';
import styled from 'styled-components';
import { variant, typography, TypographyProps } from 'styled-system';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';

const Container = styled.div`
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: solid 1px #f4f4f4;
`;

const Message = styled.h4<TypographyProps & NotificationVariantProps>`
  ${typography}
  font-size: bold;
  margin: 0;
  ${variant({
    variants: {
      success: {
        color: 'success',
      },
      warning: {
        color: 'warning',
      },
      danger: {
        color: 'danger',
      },
    },
  })}
`;

Message.defaultProps = {
  fontSize: 1,
};

const Description = styled.div`
  margin-top: 8px;
  &:empty {
    margin-top: 0;
  }
`;

const Time = styled(Box)`
  font-size: 10px;
  color: #989898;
`;

export type NotificationVariant = 'success' | 'warning' | 'danger';

interface NotificationVariantProps {
  variant?: NotificationVariant;
}

interface NotificationItemProps extends NotificationVariantProps {
  title: string;
  time: string;
}

const NotificationItem: React.FC<NotificationItemProps> = (props: React.PropsWithChildren<NotificationItemProps>) => {
  const { title, time, children, variant } = props;

  return (
    <Container>
      <Flex alignItems="center" justifyContent="space-between" as="header">
        <Message variant={variant}>{title}</Message>
        <Time ml={2}>{time}</Time>
      </Flex>
      <Description>{children}</Description>
    </Container>
  );
};

export default NotificationItem;

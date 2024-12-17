import React from 'react';
import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';

interface CoinHistoryListItemProps extends SpaceProps {
  cost: string;
  description: string;
  title: string;
  icon?: React.ReactNode;
}

const Container = styled.div<SpaceProps>`
  ${space}
  border-top: solid 1px #efefef;
  padding-top: 5px;
  display: flex;
`;

Container.defaultProps = {
  mb: 3,
};

const Icon = styled.div`
  padding-top: 3px;
`;

const Content = styled.div`
  flex-grow: 1;
  padding-left: 5px;
`;

const Title = styled.h3`
  line-height: 22px;
  font-size: 12px;
  color: #989898;
  margin: 0;
`;

const Description = styled.div`
  font-size: 16px;
  color: #333333;
`;

const Cost = styled.div`
  align-self: center;
  font-size: 16px;
  min-width: 70px;
  text-align: right;
`;

const CoinHistoryListItem: React.FC<CoinHistoryListItemProps> = (props: CoinHistoryListItemProps) => {
  const { cost, icon, title, description, ...rest } = props;

  return (
    <Container {...rest}>
      <Icon>{icon}</Icon>
      <Content>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </Content>
      <Cost>{cost}</Cost>
    </Container>
  );
};

export default CoinHistoryListItem;

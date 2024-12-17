import React from 'react';
import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';
import { ChevronRightIcon, ChevronLeftIcon } from '@components/atoms/IconButton';
import { withTranslation } from 'react-i18next';
import { WithTranslation } from 'next-i18next';

interface PaginationProps extends SpaceProps, WithTranslation {
  totalCount: number;
  page: number;
  pageSize: number;
  onChange: (page: number) => void;
}

const Container = styled.div<SpaceProps>`
  ${space}
  display: flex;
  align-items: center;
`;

Container.defaultProps = {
  mb: 3,
};

const Pagination: React.FC<PaginationProps> = (props: React.PropsWithChildren<PaginationProps>) => {
  const { totalCount, pageSize, page, t, onChange, ...rest } = props;
  const to = page * pageSize;
  const from = to - pageSize + 1;

  function onNextClick() {
    onChange(page + 1);
  }

  function onPrevClick() {
    onChange(page - 1);
  }

  return (
    <Container {...rest}>
      {t('pagination_info', { from, to, total: totalCount })}
      {page > 1 && <ChevronLeftIcon ml="10px" onClick={onPrevClick} />}
      {page < Math.ceil(totalCount / pageSize) && <ChevronRightIcon onClick={onNextClick} />}
    </Container>
  );
};

Pagination.defaultProps = {
  page: 0,
  pageSize: 10,
};

export default withTranslation('common')(Pagination);

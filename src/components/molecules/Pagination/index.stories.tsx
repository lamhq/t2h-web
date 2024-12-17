import React from 'react';
import styled from 'styled-components';
import Pagination from './index';

export default { title: 'Molecules|Pagination' };

const Page = styled.div`
  width: 320px;
  padding: 16px;
`;

export const Standard: React.FC = () => {
  const [page, setPage] = React.useState(1);

  return (
    <Page>
      <Pagination page={page} pageSize={10} totalCount={100} onChange={setPage} />
    </Page>
  );
};

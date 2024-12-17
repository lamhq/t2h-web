import React from 'react';
import styled from 'styled-components';
import ListingDescription from './';

const Container = styled.div`
  padding: 20px;
  width: 288px;
`;

export default { title: 'Molecules|ListingDescription' };

export const Standard = () => {
  return (
    <Container>
      <ListingDescription
        title={`ขายรถขุด KOMATSU PC200LC-8 แม่เหล็ก นำเข้าเองจากญี่ปุ่น สภาพสวยพร้อมใช้งาน มีVDOการทำงานครับ`}
        description={`Premium grade A +++ wheel loader, KOMATSU WA320-7, imported from Japan, sell cheap.

        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`}
      />
    </Container>
  );
};

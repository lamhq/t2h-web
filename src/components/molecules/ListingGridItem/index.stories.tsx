import React from 'react';
import styled from 'styled-components';
import { FavoriteBorderIcon, GreenCheckIcon } from '@components/atoms/IconButton';
import ListingItem, { ListingGridItemMini } from '.';

export default { title: 'Molecules|ListingGridItem' };

const Container = styled.div`
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 16px;
  row-gap: 16px;
`;

export const Standard = () => (
  <Container>
    <ListingItem
      imageUrl="/static/images/1.jpg"
      title="ขายรถตักล้อยาง HITACHI"
      tags={['2017', 'Manual', '8.5L']}
      price="470,000 THB"
      rightTopElement={<GreenCheckIcon />}
      rightBottomElement={<FavoriteBorderIcon size="18px" color="lightGrey" />}
      photoCount={15}
    />

    <ListingItem
      imageUrl="/static/images/2.jpg"
      title="ขายรถขุด KOMATSU PC200LC-8 แม่เหล็ก นำเข้าเองจากญี่ปุ่น สภาพสวยพร้อมใช้งาน มีVDOการทำงานครับ"
      tags={['Year', 'Trans']}
      rightBottomElement={<FavoriteBorderIcon size="18px" color="lightGrey" />}
      price="470,000 THB"
      photoCount={16}
    />

    <ListingItem
      imageUrl="/static/images/3.jpg"
      title="ขายรถเครน TADANO TR250M-6 (ขนาด 25 ตัน) ปี 1999 นำเข้าเองจากญี่ปุ่น สภาพสวยพร้อมใช้ มีVDOการทำงานครับ"
      tags={['2017', 'Manual', '8.5L']}
      price="470,000 THB"
      rightTopElement={<GreenCheckIcon />}
      rightBottomElement={<FavoriteBorderIcon size="18px" color="lightGrey" />}
      photoCount={22}
    />

    <ListingItem
      imageUrl="/static/images/1.jpg"
      title="ขายรถเครน TADANO TR250M-6 (ขนาด 25 ตัน) ปี 1999 นำเข้าเองจากญี่ปุ่น สภาพสวยพร้อมใช้ มีVDOการทำงานครับ"
      tags={['2017', 'Manual', '8.5L']}
      price="470,000 THB"
      rightTopElement={<GreenCheckIcon />}
      rightBottomElement={<FavoriteBorderIcon size="18px" color="lightGrey" />}
      photoCount={15}
    />

    <ListingItem
      imageUrl="/static/images/1.jpg"
      title="ขายรถตักล้อยาง HITACHI"
      tags={['2017', 'Manual', '8.5L']}
      price="470,000 THB"
      rightTopElement={<GreenCheckIcon />}
      rightBottomElement={<FavoriteBorderIcon size="18px" color="lightGrey" />}
      photoCount={15}
    />

    <ListingItem
      imageUrl="/static/images/2.jpg"
      title="ขายรถขุด KOMATSU PC200LC-8 แม่เหล็ก นำเข้าเองจากญี่ปุ่น สภาพสวยพร้อมใช้งาน มีVDOการทำงานครับ"
      tags={['Year', 'Trans']}
      rightBottomElement={<FavoriteBorderIcon size="18px" color="lightGrey" />}
      price="470,000 THB"
      photoCount={16}
    />

    <ListingItem
      imageUrl="/static/images/3.jpg"
      title="ขายรถเครน TADANO TR250M-6 (ขนาด 25 ตัน) ปี 1999 นำเข้าเองจากญี่ปุ่น สภาพสวยพร้อมใช้ มีVDOการทำงานครับ"
      tags={['2017', 'Manual', '8.5L']}
      price="470,000 THB"
      rightTopElement={<GreenCheckIcon />}
      rightBottomElement={<FavoriteBorderIcon size="18px" color="lightGrey" />}
      photoCount={22}
    />

    <ListingItem
      imageUrl="/static/images/1.jpg"
      title="ขายรถเครน TADANO TR250M-6 (ขนาด 25 ตัน) ปี 1999 นำเข้าเองจากญี่ปุ่น สภาพสวยพร้อมใช้ มีVDOการทำงานครับ"
      tags={['2017', 'Manual', '8.5L']}
      price="470,000 THB"
      rightTopElement={<GreenCheckIcon />}
      rightBottomElement={<FavoriteBorderIcon size="18px" color="lightGrey" />}
      photoCount={15}
    />
  </Container>
);

const ContainerMini = styled.div`
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  column-gap: 16px;
  row-gap: 16px;
`;

export const Mini = () => (
  <ContainerMini>
    <ListingGridItemMini
      imageUrl="/static/images/1.jpg"
      title="ขายรถตักล้อยาง HITACHI"
      seller="The Truck Company"
      price="470,000 THB"
      rightTopElement={<GreenCheckIcon />}
      rightBottomElement={<FavoriteBorderIcon size="18px" color="lightGrey" />}
      photoCount={15}
    />

    <ListingGridItemMini
      imageUrl="/static/images/2.jpg"
      title="ขายรถขุด KOMATSU PC200LC-8 แม่เหล็ก นำเข้าเองจากญี่ปุ่น สภาพสวยพร้อมใช้งาน มีVDOการทำงานครับ"
      seller="The Truck Company"
      rightBottomElement={<FavoriteBorderIcon size="18px" color="lightGrey" />}
      price="470,000 THB"
      photoCount={16}
    />

    <ListingGridItemMini
      imageUrl="/static/images/3.jpg"
      title="ขายรถเครน TADANO TR250M-6 (ขนาด 25 ตัน) ปี 1999 นำเข้าเองจากญี่ปุ่น สภาพสวยพร้อมใช้ มีVDOการทำงานครับ"
      seller="The Truck Company"
      price="470,000 THB"
      rightTopElement={<GreenCheckIcon />}
      rightBottomElement={<FavoriteBorderIcon size="18px" color="lightGrey" />}
      photoCount={22}
    />

    <ListingGridItemMini
      imageUrl="/static/images/1.jpg"
      title="ขายรถเครน TADANO TR250M-6 (ขนาด 25 ตัน) ปี 1999 นำเข้าเองจากญี่ปุ่น สภาพสวยพร้อมใช้ มีVDOการทำงานครับ"
      seller="The Truck Company"
      price="470,000 THB"
      rightTopElement={<GreenCheckIcon />}
      rightBottomElement={<FavoriteBorderIcon size="18px" color="lightGrey" />}
      photoCount={15}
    />

    <ListingGridItemMini
      imageUrl="/static/images/1.jpg"
      title="ขายรถตักล้อยาง HITACHI"
      seller="The Truck Company"
      price="470,000 THB"
      rightTopElement={<GreenCheckIcon />}
      rightBottomElement={<FavoriteBorderIcon size="18px" color="lightGrey" />}
      photoCount={15}
    />

    <ListingGridItemMini
      imageUrl="/static/images/2.jpg"
      title="ขายรถขุด KOMATSU PC200LC-8 แม่เหล็ก นำเข้าเองจากญี่ปุ่น สภาพสวยพร้อมใช้งาน มีVDOการทำงานครับ"
      seller="The Truck Company"
      rightBottomElement={<FavoriteBorderIcon size="18px" color="lightGrey" />}
      price="470,000 THB"
      photoCount={16}
    />

    <ListingGridItemMini
      imageUrl="/static/images/3.jpg"
      title="ขายรถเครน TADANO TR250M-6 (ขนาด 25 ตัน) ปี 1999 นำเข้าเองจากญี่ปุ่น สภาพสวยพร้อมใช้ มีVDOการทำงานครับ"
      seller="The Truck Company"
      price="470,000 THB"
      rightTopElement={<GreenCheckIcon />}
      rightBottomElement={<FavoriteBorderIcon size="18px" color="lightGrey" />}
      photoCount={22}
    />

    <ListingGridItemMini
      imageUrl="/static/images/1.jpg"
      title="ขายรถเครน TADANO TR250M-6 (ขนาด 25 ตัน) ปี 1999 นำเข้าเองจากญี่ปุ่น สภาพสวยพร้อมใช้ มีVDOการทำงานครับ"
      seller="The Truck Company"
      price="470,000 THB"
      rightTopElement={<GreenCheckIcon />}
      rightBottomElement={<FavoriteBorderIcon size="18px" color="lightGrey" />}
      photoCount={15}
    />
  </ContainerMini>
);

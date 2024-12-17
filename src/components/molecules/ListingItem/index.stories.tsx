import React from 'react';
import styled from 'styled-components';
import { StarBorderIcon, StarIcon, FavoriteBorderIcon, EventIcon, MoreVertIcon, GreenCheckIcon } from '@components/atoms/IconButton';
import ListingItem from './';

export default { title: 'Molecules|ListingItem' };

const Badge = styled.div`
  border-radius: 25px;
  border: solid 1px #222;
  padding: 6px;
  display: flex;
  align-items: center;
  font-size: 12px;
`;

const DayBadge = () => (
  <Badge>
    <EventIcon size="12px" />
    &nbsp;7 days
  </Badge>
);

const Container = styled.div`
  padding: 20px;
  width: 320px;
`;

export const Standard = () => (
  <Container>
    <ListingItem
      imageUrl="/static/images/1.jpg"
      title="ขายรถตักล้อยาง HITACHI"
      tags={['Year', 'Trans']}
      price="470,000 THB"
      rightTopElement={<StarBorderIcon size="18px" color="lightGrey" />}
    />

    <ListingItem
      imageUrl="/static/images/2.jpg"
      title="ขายรถขุด KOMATSU PC200LC-8 แม่เหล็ก นำเข้าเองจากญี่ปุ่น สภาพสวยพร้อมใช้งาน มีVDOการทำงานครับ"
      tags={['Year', 'Trans']}
      rightBottomElement={<FavoriteBorderIcon size="18px" color="lightGrey" />}
      price="470,000 THB"
    />

    <ListingItem
      imageUrl="/static/images/3.jpg"
      title="ขายรถเครน TADANO TR250M-6 (ขนาด 25 ตัน) ปี 1999 นำเข้าเองจากญี่ปุ่น สภาพสวยพร้อมใช้ มีVDOการทำงานครับ"
      tags={['2017', 'Manual', '8.5L']}
      price="470,000 THB"
      hasBorder
      leftTopElement={<GreenCheckIcon />}
      rightTopElement={<MoreVertIcon size="18px" />}
    />

    <ListingItem
      imageUrl="/static/images/1.jpg"
      title="ขายรถเครน TADANO TR250M-6 (ขนาด 25 ตัน) ปี 1999 นำเข้าเองจากญี่ปุ่น สภาพสวยพร้อมใช้ มีVDOการทำงานครับ"
      tags={['2017', 'Manual', '8.5L']}
      price="470,000 THB"
      hasBorder
      leftTopElement={<GreenCheckIcon />}
      rightTopElement={<StarIcon size="18px" color="yellow" />}
      rightBottomElement={<DayBadge />}
    />

    <ListingItem
      imageUrl="/static/images/1.jpg"
      companyName="The Truck Company"
      title="ขายรถเครน TADANO TR250M-6 (ขนาด 25 ตัน) ปี 1999 นำเข้าเองจากญี่ปุ่น สภาพสวยพร้อมใช้ มีVDOการทำงานครับ"
      price="470,000 THB"
      hasBorder
      leftTopElement={<GreenCheckIcon />}
      rightBottomElement={<StarIcon size="18px" color="yellow" />}
    />
  </Container>
);

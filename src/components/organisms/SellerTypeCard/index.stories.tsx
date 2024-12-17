import React from 'react';
import RadioGroup from '@components/molecules/RadioGroup';
import { ApplicationType } from '@services/types';
import Box from '@components/layouts/Box';
import SellerTypeCard from './index';

export default { title: 'Organisms|SellerTypeCard' };

export const Standard = () => {
  const [selected, setSelected] = React.useState(null);

  return (
    <RadioGroup justifyContent="center" value={selected} onChange={setSelected}>
      <Box>
        <SellerTypeCard
          imageSrc="/static/images/seller/register/individual.png"
          title="Individual"
          description="Selling personal vehicles that belong to you."
          value={ApplicationType.Individual}
        />
      </Box>
      <Box ml={3}>
        <SellerTypeCard
          imageSrc="/static/images/seller/register/company.png"
          title="Company"
          description="Selling personal vehicles that belong to you."
          value={ApplicationType.Corporation}
        />
      </Box>
    </RadioGroup>
  );
};

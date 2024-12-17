import React from 'react';
import ChargeListItem from './index';

export default { title: 'Molecules|ChargeListItem' };

export const Standard = () => (
  <React.Fragment>
    <ChargeListItem title="Membership silver package" description="Sample" cost="100 THB" />
    <ChargeListItem title="Membership silver package" description="Sample" cost="100 THB" />
    <ChargeListItem title="Membership silver package" description="Sample" cost="100 THB" />
  </React.Fragment>
);

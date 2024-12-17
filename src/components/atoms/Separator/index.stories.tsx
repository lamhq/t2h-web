import React from 'react';
import Separator from './index';

export default { title: 'Atoms|Separator' };

export const Standard = () => (
  <React.Fragment>
    <Separator>or</Separator>
    <Separator>and</Separator>
    <Separator />
  </React.Fragment>
);

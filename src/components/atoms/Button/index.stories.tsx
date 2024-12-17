import React from 'react';
import { action } from '@storybook/addon-actions';
import { Button } from './index';

export default { title: 'Atoms|Button' };

export const Standard = () => (
  <React.Fragment>
    <Button variant="primary" onClick={action('clicked')}>
      Primary Button
    </Button>
    <Button variant="secondary" onClick={action('clicked')}>
      Secondary Button
    </Button>
    <Button variant="transparent" onClick={action('clicked')}>
      Transparent Button
    </Button>
    <Button variant="facebook" onClick={action('clicked')}>
      Facebook Button
    </Button>
    <Button variant="line" onClick={action('clicked')}>
      Line Button
    </Button>
    <Button variant="omise" onClick={action('clicked')}>
      Omise Button
    </Button>
    <Button variant="boosted" onClick={action('clicked')}>
      Boosted Button
    </Button>
  </React.Fragment>
);

export const Disabled = () => (
  <React.Fragment>
    <Button variant="disabled" onClick={action('clicked')}>
      Primary Button is disabled
    </Button>
  </React.Fragment>
);

export const Emoji = () => (
  <Button onClick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);

export const AutoWidth = () => (
  <Button block={false} onClick={action('clicked')}>
    Submit
  </Button>
);

import React from 'react';
import { action } from '@storybook/addon-actions';
import InputImage from './';

export default { title: 'Molecules|InputImage' };

interface InputImageWrapperProps {
  src?: string;
  onChange?: () => void;
}

const InputImageWrapper = (props: InputImageWrapperProps) => {
  const [src, setSrc] = React.useState(props.src);
  const onChange = React.useCallback(
    ({ src }) => {
      setSrc(src);
      if (props.onChange) {
        props.onChange();
      }
    },
    [props],
  );

  return <InputImage value={{ src }} onChange={props.onChange && onChange} />;
};

export const NoImage = () => (
  <React.Fragment>
    <p>Without callback</p>
    <InputImageWrapper />
    <p>With Click Callback on Button</p>
    <InputImageWrapper onChange={action('Button Clicked')} />
  </React.Fragment>
);

export const Image = () => (
  <React.Fragment>
    <p>Without callback</p>
    <InputImageWrapper src="/static/images/1.jpg" />
    <p>With Click Callback on Button</p>
    <InputImageWrapper src="/static/images/2.jpg" onChange={action('Button Clicked')} />
  </React.Fragment>
);

import React, { useState, useCallback } from 'react';
import TextArea from './index';

export default { title: 'Molecules|TextArea' };

export const Normal = () => {
  const [text, setText] = useState('');

  const handleChange = useCallback((e) => {
    setText(e.target.value);
  }, []);

  return (
    <TextArea placeholder="Description" onChange={handleChange}>
      {text}
    </TextArea>
  );
};

export const MinRowTwo = () => {
  const [text, setText] = useState('');

  const handleChange = useCallback((e) => {
    setText(e.target.value);
  }, []);

  return (
    <TextArea placeholder="Description" minRows={2} onChange={handleChange}>
      {text}
    </TextArea>
  );
};

export const MaxRowSix = () => {
  const [text, setText] = useState('');

  const handleChange = useCallback((e) => {
    setText(e.target.value);
  }, []);

  return (
    <TextArea placeholder="Description" maxRows={6} onChange={handleChange}>
      {text}
    </TextArea>
  );
};

export const Label = () => {
  const [text, setText] = useState('');

  const handleChange = useCallback((e) => {
    setText(e.target.value);
  }, []);

  return (
    <TextArea placeholder="Description" label="Description" onChange={handleChange}>
      {text}
    </TextArea>
  );
};

export const Error = () => {
  const [text, setText] = useState('');
  const [errorHelperText, setErrorHelperText] = useState('');

  const handleChange = useCallback((e) => {
    const text = e.target.value;

    setText(text);
    setErrorHelperText(text.length > 10 ? 'Text should be less than or equal to 10' : '');
  }, []);

  return (
    <TextArea
      placeholder="Description"
      label="Description"
      hasError={errorHelperText.length > 0}
      helperText={errorHelperText}
      onChange={handleChange}
    >
      {text}
    </TextArea>
  );
};

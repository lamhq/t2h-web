import React, { useState, useCallback } from 'react';
import InputText from './index';

export default { title: 'Molecules|InputText' };

export const Normal = () => {
  const [text, setText] = useState('');

  const handleChange = useCallback((e) => {
    setText(e.target.value);
  }, []);

  return <InputText type="text" placeholder="Username or Email" value={text} onChange={handleChange} />;
};

export const Password = () => {
  const [text, setText] = useState('');

  const handleChange = useCallback((e) => {
    setText(e.target.value);
  }, []);

  return <InputText type="password" placeholder="Password" value={text} onChange={handleChange} />;
};

export const Label = () => {
  const [text, setText] = useState('');

  const handleChange = useCallback((e) => {
    setText(e.target.value);
  }, []);

  return <InputText type="text" placeholder="Username" label="Username" value={text} onChange={handleChange} />;
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
    <InputText
      type="text"
      placeholder="Username"
      label="Username"
      hasError={errorHelperText.length > 0}
      value={text}
      helperText={errorHelperText}
      onChange={handleChange}
    />
  );
};

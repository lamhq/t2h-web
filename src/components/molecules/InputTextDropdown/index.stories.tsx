import React, { useState, useCallback } from 'react';
import InputTextDropdown from './index';

export default { title: 'Molecules|InputTextDropdown' };

export const Normal = () => {
  const [text, setText] = useState('');

  const handleChange = useCallback((e) => {
    setText(e.target.value);
  }, []);

  return <InputTextDropdown type="text" placeholder="Brand" value={text} items={['ISUZU', 'HINO']} onChange={handleChange} />;
};

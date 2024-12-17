import React, { useState, useCallback } from 'react';
import InputSearch from './index';

export default { title: 'Organisms|InputSearch' };

export const Normal = () => {
  const [text, setText] = useState('');

  const handleChange = useCallback((e) => {
    setText(e.target.value);
  }, []);

  const handleCancel = useCallback(() => {
    setText('');
  }, []);

  return <InputSearch placeholder="Search by Listing ID, brand or model" value={text} onCancel={handleCancel} onChange={handleChange} />;
};

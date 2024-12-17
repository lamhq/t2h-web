import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import fetch from 'isomorphic-unfetch';
import { Button } from '@components/atoms/Button';
import Box from '@components/layouts/Box';
import Dropzone from './index';

export default { title: 'Molecules|Dropzone' };

export const Standard = () => {
  const [files, setFiles] = useState([]);
  const handleDrop = useCallback((files) => {
    setFiles(files);
  }, []);

  return (
    <React.Fragment>
      <Dropzone value={files} acceptedFileTypes={['image/gif', 'image/jpeg', 'image/jpg', 'image/png']} onDrop={handleDrop} />
      {files.map((f, i) => (
        <img src={URL.createObjectURL(f)} width="100" key={i} />
      ))}
    </React.Fragment>
  );
};

export const WithControl = () => {
  const [files, setFiles] = useState([]);
  const handleDrop = useCallback((files) => {
    setFiles(files);
  }, []);

  const fetchData = useCallback(async () => {
    const res = await fetch('/static/images/1.jpg');
    const blob = await res.blob();
    const file = new File([blob], '1.png', blob);

    setFiles([...files, file]);
  }, [files]);

  const clearImages = useCallback(() => {
    setFiles([]);
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <Box mb={1}>
        <Dropzone
          height="200px"
          acceptedFileTypes={['image/gif', 'image/jpeg', 'image/jpg', 'image/png']}
          value={files}
          onDrop={handleDrop}
        />
      </Box>
      <Box mb={2}>
        {files.map((f, i) => (
          <img src={URL.createObjectURL(f)} width="100" key={i} />
        ))}
      </Box>
      <Box mb={1}>
        <Button onClick={fetchData}>Add an image</Button>
      </Box>
      <Box>
        <Button variant="transparent" onClick={clearImages}>
          clear all images
        </Button>
      </Box>
    </React.Fragment>
  );
};

export const WithFormHook = () => {
  const { control, watch, handleSubmit } = useForm();
  const filelist = watch('filelist', []);

  const onSubmit = useCallback((form) => {
    console.log(form);
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box mb={1}>
        <Controller
          as={<Dropzone height="200px" acceptedFileTypes={['image/gif', 'image/jpeg', 'image/jpg', 'image/png']} />}
          name="filelist"
          control={control}
          onChange={(changes) => {
            // Place your logic here
            return changes[0];
          }}
        />
      </Box>
      <Box mb={2}>
        {Array.from(filelist || []).map((f, i) => (
          <img src={URL.createObjectURL(f)} width="100" key={i} />
        ))}
      </Box>
      <Box>
        <Button type="submit">Submit</Button>
      </Box>
    </form>
  );
};

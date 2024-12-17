/* eslint-disable no-restricted-imports */
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Tabs, Tab, TabPanel } from './index';

export default { title: 'Molecules|Tab' };

export const Standard = () => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Yearly" />
        <Tab label="Monthly" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Box p={3}>
          <Typography>Item One</Typography>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Box p={3}>
          <Typography>Item Two</Typography>
        </Box>
      </TabPanel>
    </>
  );
};

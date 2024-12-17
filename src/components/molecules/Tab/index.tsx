/* eslint-disable no-restricted-imports */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CoreTabs from '@material-ui/core/Tabs';
import CoreTab from '@material-ui/core/Tab';
import Box from '@components/layouts/Box';
import { ResponsiveValue, Theme } from 'styled-system';

export const Tabs = withStyles({
  root: {
    borderBottom: '1px solid #cacaca',
    marginBottom: '16px',
    width: '100%',
  },
  indicator: {
    backgroundColor: '#000',
  },
})(CoreTabs);

export const Tab = withStyles({
  root: {
    flexGrow: 1,
    textTransform: 'none',
    maxWidth: 'unset',
    fontWeight: 'normal',
    marginRight: 0,
    '&:hover': {
      opacity: 1,
    },
    '&$selected': {
      fontWeight: 'normal',
    },
  },
  selected: {},
  wrapper: {
    textTransform: 'none',
  },
})(CoreTab);

interface TabPanelProps {
  index: any;
  value: any;
  width?: ResponsiveValue<React.ReactText, Required<Theme<React.ReactText>>>;
}

export const TabPanel: React.FC<TabPanelProps> = (props: React.PropsWithChildren<TabPanelProps>) => {
  const { width, children, value, index, ...other } = props;

  return (
    <Box
      width={width}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </Box>
  );
};

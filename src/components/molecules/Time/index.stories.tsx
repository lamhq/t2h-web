import React from 'react';
import styled from 'styled-components';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { InputDate, InputDateTime, InputTime } from './index';

const Page = styled.div`
  width: 320px;
  padding: 16px;
`;

const Container: React.FC = ({ children }: { children: React.ReactNode }) => {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Page>{children}</Page>
    </MuiPickersUtilsProvider>
  );
};

export default { title: 'Molecules|Time' };

export const DatePicker: React.FC = () => {
  const [value, setValue] = React.useState(new Date());

  function handleChange(newVal) {
    setValue(newVal);
  }

  return (
    <Container>
      <InputDate value={value} onChange={handleChange} />
    </Container>
  );
};

export const DateTimePicker: React.FC = () => {
  const [value, setValue] = React.useState(new Date());

  function handleChange(newVal) {
    setValue(newVal);
  }

  return (
    <Container>
      <InputDateTime value={value} onChange={handleChange} />
    </Container>
  );
};

export const TimePicker: React.FC = () => {
  const [value, setValue] = React.useState(new Date());

  function handleChange(newVal) {
    setValue(newVal);
  }

  return (
    <Container>
      <InputTime value={value} onChange={handleChange} />
    </Container>
  );
};

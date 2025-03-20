import React from 'react';
import { Box } from '@mui/material';
import Header from './sections/Header';
import Problem from './sections/Problem';
import Guide from './sections/Guide';
import Plan from './sections/Plan';
import CallToAction from './sections/CallToAction';
import Success from './sections/Success';
import Failure from './sections/Failure';

const ConsumerRights: React.FC = () => {
  return (
    <Box>
      <Header />
      <Problem />
      <Guide />
      <Plan />
      <CallToAction />
      <Success />
      <Failure />
    </Box>
  );
};

export default ConsumerRights; 
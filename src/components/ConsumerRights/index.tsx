import React from 'react';
import { Box } from '@mui/material';
import Navbar from './sections/Navbar';
import Header from './sections/Header';
import Problem from './sections/Problem';
import Guide from './sections/Guide';
import Plan from './sections/Plan';
import CallToAction from './sections/CallToAction';
import DarkCallToAction from './sections/DarkCallToAction';
import Footer from './sections/Footer';
import Success from './sections/Success';
import Failure from './sections/Failure';
import { colors } from './styles';

const ConsumerRights: React.FC = () => {
  return (
    <Box>
      <Navbar />
      <Box sx={{ bgcolor: colors.background.light }}>
        <Header />
        <Problem />
        <Guide />
        <Plan />
        <CallToAction />
        <DarkCallToAction />
        <Footer />
        {/* Success and Failure components are rendered conditionally based on form submission */}
      </Box>
    </Box>
  );
};

export default ConsumerRights; 
import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import Header from './sections/Header';
import Problem from './sections/Problem';
import DebtInheritance from './sections/DebtInheritance';
import Guide from './sections/Guide';
import Plan from './sections/Plan';
import DarkCallToAction from './sections/DarkCallToAction';
import DonationCta from './sections/DonationCta';
import Success from './sections/Success';
import Failure from './sections/Failure';
import { colors } from './styles';
import { Helmet } from 'react-helmet-async';

// Define motion variants for page sections
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.3,
      delayChildren: 0.2
    }
  }
};

const MotionBox = motion(Box);

const ConsumerRights: React.FC = () => {
  return (
    <Box>
      <Helmet>
        <title>Consumer Rights | ePSF</title>
        <meta
          name="description"
          content="Know your rights. Learn how to protect yourself from unfair timeshare practices and misleading contracts."
        />
      </Helmet>
      <MotionBox 
        initial="hidden"
        animate="visible"
        variants={pageVariants}
        sx={{ bgcolor: colors.background.light }}
      >
        <Header />
        <Problem />
        <DebtInheritance />
        <Guide />
        <Plan />
        <DonationCta />
        <DarkCallToAction />
        {/* Success and Failure components are rendered conditionally based on form submission */}
      </MotionBox>
    </Box>
  );
};

export default ConsumerRights; 
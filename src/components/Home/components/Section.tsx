import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { SectionProps } from '../common/types';

const Section = ({ children, className, sx }: SectionProps) => {
  return (
    <Box
      component={motion.section}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={className}
      sx={{
        py: { xs: 6, md: 8 },
        px: { xs: 2, sm: 4, md: 6 },
        width: '100%',
        maxWidth: '1440px',
        mx: 'auto',
        ...sx
      }}
    >
      {children}
    </Box>
  );
};

export default Section; 
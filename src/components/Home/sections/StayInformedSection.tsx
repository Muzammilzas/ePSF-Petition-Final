import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../common/animations';
import { RESOURCES } from '../common/constants';
import { ResourceCard } from '../components/ResourceCard';
import ArticleIcon from '@mui/icons-material/Article';
import DescriptionIcon from '@mui/icons-material/Description';
import WarningIcon from '@mui/icons-material/Warning';

const icons = [ArticleIcon, DescriptionIcon, WarningIcon];

const StayInformedSection: React.FC = () => {
  return (
    <Box 
      sx={{ 
        py: { xs: 8, md: 12 },
        bgcolor: 'background.default'
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Typography 
              variant="h2" 
              component="h2" 
              textAlign="center" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                mb: 4
              }}
            >
              Stay Informed. Stay Protected.
            </Typography>
            <Typography 
              variant="h5" 
              textAlign="center" 
              color="text.secondary"
              sx={{ 
                maxWidth: '800px',
                mx: 'auto',
                mb: 8
              }}
            >
              Most people don't know they're walking into a trap — until it's too late. That's why we created these quick, must-read fact sheets to help you avoid the most common timeshare scams.
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {RESOURCES.map((resource, index) => (
              <Grid item xs={12} md={4} key={index}>
                <ResourceCard
                  title={resource.title}
                  description={resource.description}
                  link={resource.link}
                  icon={icons[index]}
                  delay={index * 0.2}
                />
              </Grid>
            ))}
          </Grid>

          <motion.div variants={fadeInUp}>
            <Typography 
              variant="body1" 
              textAlign="center" 
              color="text.secondary"
              sx={{ 
                maxWidth: '800px',
                mx: 'auto',
                mt: 8,
                fontSize: '1.1rem'
              }}
            >
              These resources are free, easy to understand, and made to help you protect yourself and your family — especially if you're wondering how can you get rid of a timeshare or need a trusted timeshare attorney.
            </Typography>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default StayInformedSection; 
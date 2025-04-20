import React from 'react';
import { Box, Container, Typography, Grid, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer } from '../common/animations';
import { PETITION_CONTENT } from '../common/constants';
import GavelIcon from '@mui/icons-material/Gavel';

const PetitionSection: React.FC = () => {
  return (
    <Box 
      sx={{ 
        py: { xs: 8, md: 12 },
        bgcolor: 'background.paper'
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
              {PETITION_CONTENT.title}
            </Typography>
            <Typography 
              variant="h5" 
              textAlign="center" 
              color="text.secondary"
              sx={{ 
                maxWidth: '800px',
                mx: 'auto',
                mb: 6,
                fontSize: '1.2rem',
                lineHeight: 1.6
              }}
            >
              {PETITION_CONTENT.description}
            </Typography>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              {PETITION_CONTENT.callouts.map((callout, index) => (
                <Typography
                  key={index}
                  variant="h6"
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    fontSize: '1.3rem'
                  }}
                >
                  {callout}
                </Typography>
              ))}
            </Box>
          </motion.div>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={8} textAlign="center">
              <motion.div variants={fadeInUp}>
                <Button
                  component={Link}
                  to="/petition"
                  variant="contained"
                  size="large"
                  startIcon={<GavelIcon />}
                  sx={{
                    py: 2,
                    px: 6,
                    fontSize: '1.2rem',
                    borderRadius: 2,
                    textTransform: 'none',
                  }}
                >
                  {PETITION_CONTENT.cta}
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PetitionSection; 
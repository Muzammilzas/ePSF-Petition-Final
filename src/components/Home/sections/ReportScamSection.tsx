import React from 'react';
import { Box, Container, Typography, Grid, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer } from '../common/animations';
import { REPORT_CONTENT } from '../common/constants';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const ReportScamSection: React.FC = () => {
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
              {REPORT_CONTENT.title}
            </Typography>
            <Typography 
              variant="h5" 
              textAlign="center" 
              color="text.secondary"
              sx={{ 
                maxWidth: '800px',
                mx: 'auto',
                mb: 6
              }}
            >
              {REPORT_CONTENT.description}
            </Typography>
            <Typography 
              variant="h6" 
              textAlign="center" 
              color="text.primary"
              sx={{ 
                maxWidth: '800px',
                mx: 'auto',
                mb: 4,
                fontWeight: 600
              }}
            >
              {REPORT_CONTENT.subtitle}
            </Typography>
            <Box sx={{ maxWidth: '600px', mx: 'auto', mb: 6 }}>
              <List>
                {REPORT_CONTENT.points.map((point, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={point}
                      primaryTypographyProps={{
                        sx: { fontSize: '1.1rem' }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </motion.div>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={8} textAlign="center">
              <motion.div variants={fadeInUp}>
                <Button
                  component={Link}
                  to="/report-scam"
                  variant="contained"
                  size="large"
                  startIcon={<ReportProblemIcon />}
                  sx={{
                    py: 2,
                    px: 6,
                    fontSize: '1.2rem',
                    borderRadius: 2,
                    textTransform: 'none',
                  }}
                >
                  {REPORT_CONTENT.cta}
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ReportScamSection; 
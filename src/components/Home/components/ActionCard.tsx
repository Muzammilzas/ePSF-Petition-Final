import React from 'react';
import { Card, CardContent, Typography, Button, useTheme, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { ActionCardProps } from '../common/types';

export const ActionCard: React.FC<ActionCardProps> = ({ 
  title, 
  description, 
  buttonText, 
  onClick, 
  icon: Icon,
  delay = 0 
}) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          boxShadow: theme.shadows[4],
          borderRadius: 2,
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            boxShadow: theme.shadows[8],
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
              color: theme.palette.primary.main,
            }}
          >
            <Icon sx={{ fontSize: 32, mr: 1 }} />
            <Typography variant="h5" component="h3" fontWeight="bold">
              {title}
            </Typography>
          </Box>
          
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ mb: 3 }}
          >
            {description}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={onClick}
            sx={{
              mt: 'auto',
              textTransform: 'none',
              borderRadius: 2,
              py: 1,
              px: 3,
            }}
          >
            {buttonText}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}; 
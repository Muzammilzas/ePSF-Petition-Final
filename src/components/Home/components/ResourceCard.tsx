import React from 'react';
import { Card, CardContent, Typography, Link, useTheme, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { SvgIconComponent } from '@mui/icons-material';

interface ResourceCardProps {
  title: string;
  description: string;
  link: string;
  icon: SvgIconComponent;
  delay?: number;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  description,
  link,
  icon: Icon,
  delay = 0,
}) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Link 
        href={link} 
        underline="none" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <Card
          sx={{
            height: '100%',
            background: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: theme.shadows[2],
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.shadows[6],
              '& .icon': {
                color: theme.palette.primary.main,
                transform: 'scale(1.1)',
              },
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Icon 
                className="icon"
                sx={{ 
                  fontSize: 32, 
                  mr: 1,
                  color: theme.palette.text.secondary,
                  transition: 'all 0.2s ease-in-out',
                }} 
              />
              <Typography 
                variant="h6" 
                component="h3" 
                color="text.primary"
                fontWeight="bold"
              >
                {title}
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              color="text.secondary"
            >
              {description}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}; 
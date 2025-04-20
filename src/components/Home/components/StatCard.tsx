import { Card, CardContent, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { StatCardProps } from '../common/types';

export const StatCard = ({ stat: { value, label }, delay = 0 }: StatCardProps) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2,
          boxShadow: theme.shadows[4],
          p: 3,
          textAlign: 'center',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
        }}
      >
        <CardContent>
          <Typography
            variant="h3"
            component="div"
            gutterBottom
            fontWeight="bold"
            sx={{ mb: 1 }}
          >
            {value}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              opacity: 0.9,
              fontSize: '1.1rem',
            }}
          >
            {label}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
}; 
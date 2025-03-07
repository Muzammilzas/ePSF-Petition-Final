import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Container,
  LinearProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { usePetition } from '../context/PetitionContext';
import { supabase } from '../services/supabase';

const SharePetition: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentPetition, setCurrentPetition } = usePetition();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(!currentPetition);

  // Function to get the sign petition URL
  const getSignPetitionUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/sign/${id}`;
  };

  // Function to fetch current petition data
  const fetchPetitionData = async () => {
    try {
      const { data, error } = await supabase
        .from('petitions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        console.log('Updated petition data:', data);
        setCurrentPetition(data);
      }
    } catch (error) {
      console.error('Error fetching petition:', error);
    }
  };

  // Subscribe to real-time updates
  useEffect(() => {
    if (id) {
      // Subscribe to changes in the signatures table
      const channel = supabase.channel('petition-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'signatures',
            filter: `petition_id=eq.${id}`,
          },
          async () => {
            console.log('Signature change detected, fetching updated petition data');
            await fetchPetitionData();
          }
        )
        .subscribe((status) => {
          console.log('Realtime subscription status:', status);
        });

      return () => {
        channel.unsubscribe();
      };
    }
  }, [id]);

  // Initial fetch of petition data
  useEffect(() => {
    const fetchPetition = async () => {
      if (!currentPetition && id) {
        setLoading(true);
        try {
          await fetchPetitionData();
        } catch (error) {
          console.error('Error fetching petition:', error);
          setError('Failed to load petition');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPetition();
  }, [id, currentPetition]);

  const handleShare = (platform: string) => {
    const url = getSignPetitionUrl();
    const text = `Please sign this petition: ${currentPetition?.title}`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`);
        break;
    }
  };

  const handleCopyLink = async () => {
    try {
      const url = getSignPetitionUrl();
      await navigator.clipboard.writeText(url);
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  if (loading) {
    return (
      <Container>
        <LinearProgress />
        <Typography variant="h5" align="center" sx={{ mt: 2 }}>
          Loading petition...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!currentPetition) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          Petition not found
        </Alert>
      </Container>
    );
  }

  const progress = (currentPetition.signature_count / currentPetition.goal) * 100;

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Share Your Petition
        </Typography>
        
        <Typography variant="h5" gutterBottom align="center" color="primary">
          {currentPetition.title}
        </Typography>

        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          {currentPetition.story}
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Progress: {currentPetition.signature_count} / {currentPetition.goal} signatures
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 10, borderRadius: 5 }} 
          />
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom align="center">
            Share on Social Media
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <IconButton 
              onClick={() => handleShare('facebook')} 
              color="primary"
              size="large"
              sx={{
                '&:hover': {
                  color: '#E0AC3F',
                  '& .MuiSvgIcon-root': {
                    color: '#E0AC3F',
                  },
                },
              }}
            >
              <FacebookIcon fontSize="large" />
            </IconButton>
            <IconButton 
              onClick={() => handleShare('twitter')} 
              color="primary"
              size="large"
              sx={{
                '&:hover': {
                  color: '#E0AC3F',
                  '& .MuiSvgIcon-root': {
                    color: '#E0AC3F',
                  },
                },
              }}
            >
              <TwitterIcon fontSize="large" />
            </IconButton>
            <IconButton 
              onClick={() => handleShare('linkedin')} 
              color="primary"
              size="large"
              sx={{
                '&:hover': {
                  color: '#E0AC3F',
                  '& .MuiSvgIcon-root': {
                    color: '#E0AC3F',
                  },
                },
              }}
            >
              <LinkedInIcon fontSize="large" />
            </IconButton>
            <IconButton 
              onClick={handleCopyLink} 
              color="primary"
              size="large"
              sx={{
                '&:hover': {
                  color: '#E0AC3F',
                  '& .MuiSvgIcon-root': {
                    color: '#E0AC3F',
                  },
                },
              }}
            >
              <ContentCopyIcon fontSize="large" />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Link copied to clipboard!"
      />
    </Container>
  );
};

export default SharePetition; 
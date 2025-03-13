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
  const [loading, setLoading] = React.useState(true);
  const [signatureCount, setSignatureCount] = React.useState<number | null>(null);

  // Function to get the sign petition URL
  const getSignPetitionUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/sign/${id}`;
  };

  // Function to count signatures directly from the signatures table
  const countSignatures = async () => {
    try {
      console.log('Counting signatures for petition ID:', id);
      
      const { count, error } = await supabase
        .from('signatures')
        .select('*', { count: 'exact', head: true })
        .eq('petition_id', id);

      if (error) {
        console.error('Error counting signatures:', error);
        return null;
      }
      
      if (count !== null) {
        console.log(`Found ${count} signatures for petition ${id}`);
        setSignatureCount(count);
        return count;
      }
      
      return null;
    } catch (error) {
      console.error('Error in countSignatures:', error);
      return null;
    }
  };

  // Function to fetch current petition data
  const fetchPetitionData = async () => {
    try {
      console.log('Fetching updated petition data for ID:', id);
      
      const { data, error } = await supabase
        .from('petitions')
        .select('*')
        .eq('id', id);

      if (error) {
        console.error('Error fetching petition data:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        console.log('Updated petition data received:', data[0]);
        
        // Get the signature count directly from the signatures table
        const count = await countSignatures();
        
        // If we got a count, update the petition data with it
        if (count !== null) {
          console.log(`Updating displayed signature count to ${count}`);
          const updatedPetition = { ...data[0], signature_count: count };
          setCurrentPetition(updatedPetition);
        } else {
          console.log(`Using petition's signature count: ${data[0].signature_count}`);
          setCurrentPetition(data[0]);
        }
        
        setLoading(false);
      } else {
        console.error('No petition data found for ID:', id);
        setError('Petition not found');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error in fetchPetitionData:', error);
      setError('Failed to load petition data');
      setLoading(false);
    }
  };

  // Subscribe to real-time updates
  useEffect(() => {
    if (id) {
      console.log('Setting up real-time subscriptions for petition ID:', id);
      
      // Initial fetch of petition data
      fetchPetitionData();
      
      // Subscribe to changes in the signatures table
      const signaturesChannel = supabase.channel('signatures-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'signatures',
            filter: `petition_id=eq.${id}`,
          },
          async (payload) => {
            console.log('Signature change detected:', payload);
            await fetchPetitionData();
          }
        )
        .subscribe((status) => {
          console.log('Signatures subscription status:', status);
        });
        
      // Also subscribe to changes in the petitions table for this specific petition
      const petitionsChannel = supabase.channel('petitions-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'petitions',
            filter: `id=eq.${id}`,
          },
          async (payload) => {
            console.log('Petition change detected:', payload);
            await fetchPetitionData();
          }
        )
        .subscribe((status) => {
          console.log('Petitions subscription status:', status);
        });

      return () => {
        console.log('Cleaning up real-time subscriptions');
        signaturesChannel.unsubscribe();
        petitionsChannel.unsubscribe();
      };
    }
  }, [id]);

  const handleShare = (platform: string) => {
    const url = getSignPetitionUrl();
    const text = `Please sign this Timeshare Reform Petition`;
    
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

  // Use the most reliable signature count available
  const displaySignatureCount = signatureCount !== null ? signatureCount : 
    (currentPetition ? currentPetition.signature_count : 0);
  
  const progress = currentPetition ? 
    (displaySignatureCount / currentPetition.goal) * 100 : 0;

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Share Your Petition
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <img 
            src="/your-logo.png" 
            alt="ePSF Logo" 
            style={{ 
              height: '60px',
              width: 'auto',
            }} 
          />
        </Box>

        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          You're #{displaySignatureCount} of {currentPetition?.goal || 10000} supporters—your voice matters!
        </Typography>

        <Typography variant="body1" paragraph align="center" sx={{ mt: 3, mb: 4 }}>
          Your signature is a powerful step in helping ePublic Safety Foundation combat timeshare scams and secure reform for millions. Together, we're building a movement to protect consumers and pursue justice—share this petition to amplify our impact!
        </Typography>

        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h6" gutterBottom align="center">
            {displaySignatureCount} of {currentPetition?.goal || 10000} signatures collected
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 10, borderRadius: 5 }} 
          />
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <IconButton
            onClick={() => handleShare('facebook')}
            color="primary"
            aria-label="share on facebook"
          >
            <FacebookIcon />
          </IconButton>
          <IconButton
            onClick={() => handleShare('twitter')}
            color="primary"
            aria-label="share on twitter"
          >
            <TwitterIcon />
          </IconButton>
          <IconButton
            onClick={() => handleShare('linkedin')}
            color="primary"
            aria-label="share on linkedin"
          >
            <LinkedInIcon />
          </IconButton>
          <IconButton
            onClick={handleCopyLink}
            color="primary"
            aria-label="copy link"
          >
            <ContentCopyIcon />
          </IconButton>
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
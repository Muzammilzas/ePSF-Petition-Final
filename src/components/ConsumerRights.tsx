import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ConsumerRights: React.FC = () => {
  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ 
        bgcolor: 'primary.dark', 
        color: 'white', 
        py: 10,
        position: 'relative'
      }}>
        <Container>
          <Typography variant="h2" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
            Your Consumer Rights Matter
          </Typography>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Sign to Protect Timeshare Owners from Unfair Practices
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: 'md' }}>
            You're a timeshare owner who deserves fairness, not frustration. Yet, shady companies deny you basic consumer rights with scams, fraud, and contracts you can't escape. ePublic Safety Foundation is here to fight for you—sign our petition to demand the protections you're entitled to!
          </Typography>
          <Button
            component={Link}
            to="/sign-petition"
            variant="contained"
            color="secondary"
            size="large"
            sx={{ py: 1.5, px: 4 }}
          >
            Sign the Petition
          </Button>
        </Container>
      </Box>

      {/* The Problem Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container>
          <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold' }}>
            Timeshare Owners Denied Their Rights
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ mb: 3 }}>
                As a consumer, you have rights—to fair treatment, clear information, and the freedom to walk away. But timeshare companies often:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Push scams and fraud, tricking you into bad deals." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Limit cancellation rights, trapping you in unwanted contracts." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Offer a short rescission period, leaving no time to rethink." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Use aggressive promotions to hide the truth." />
                </ListItem>
              </List>
              <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
                This isn't right. You deserve better—and we're here to help.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ height: 250, width: '100%', bgcolor: 'grey.300', borderRadius: 1, mb: 2 }} />
                <Typography variant="subtitle1" color="text.secondary">
                  Rights Denied
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* The Guide Section */}
      <Box sx={{ py: 8 }}>
        <Container>
          <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
            ePublic Safety Foundation: Your Rights Advocate
          </Typography>
          <Box sx={{ maxWidth: 'md', mx: 'auto', textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 4 }}>
              At ePublic Safety Foundation, we're a nonprofit dedicated to defending consumer rights. We've seen how timeshare owners suffer from unfair practices, and we're stepping up with a powerful petition. With our expertise and your support, we'll demand the protections you deserve. Let us guide you to justice!
            </Typography>
            <Box sx={{ 
              width: 120, 
              height: 120, 
              borderRadius: '50%', 
              bgcolor: 'grey.200', 
              mx: 'auto',
              mb: 2 
            }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Defending Your Rights
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* The Plan Section */}
      <Box sx={{ bgcolor: 'primary.light', py: 8 }}>
        <Container>
          <Typography variant="h3" sx={{ mb: 6, fontWeight: 'bold', textAlign: 'center' }}>
            3 Steps to Reclaim Your Consumer Rights
          </Typography>
          <Grid container spacing={4} sx={{ maxWidth: 'lg', mx: 'auto' }}>
            {[
              {
                title: 'Sign Our Petition',
                description: 'Demand timeshare scam prevention and fair laws with one click.'
              },
              {
                title: 'Unite as Owners',
                description: 'Join our timeshare owners group to amplify your voice.'
              },
              {
                title: 'Secure Your Rights',
                description: 'Push for stronger cancellation rights and a fair rescission period.'
              }
            ].map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ 
                    width: 96, 
                    height: 96, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.main',
                    mx: 'auto',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    {index + 1}
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {step.title}
                  </Typography>
                  <Typography>
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              component={Link}
              to="/sign-petition"
              variant="contained"
              color="primary"
              size="large"
              sx={{ py: 1.5, px: 4 }}
            >
              Add Your Name
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 8 }}>
        <Container>
          <Box sx={{ maxWidth: 'md', mx: 'auto', textAlign: 'center' }}>
            <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
              Stand Up for Your Rights Today
            </Typography>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Sign the Timeshare Fraud Petition Now
            </Typography>
            <Typography sx={{ mb: 4 }}>
              Ready to reclaim your consumer rights? Sign the ePublic Safety Foundation petition to stop unfair timeshare practices. It's fast, secure, and makes a difference. Together, we'll tell lawmakers: consumers come first!
            </Typography>
            <Button
              component={Link}
              to="/sign-petition"
              variant="contained"
              color="secondary"
              size="large"
              sx={{ py: 1.5, px: 4 }}
            >
              Submit Signature
            </Button>
            <Typography variant="body2" sx={{ mt: 2, color: 'grey.400' }}>
              Your data is safe with ePSF, a nonprofit for consumer rights.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Success Section */}
      <Box sx={{ bgcolor: 'success.light', py: 8 }}>
        <Container>
          <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
            A Future Where Your Rights Win
          </Typography>
          <Box sx={{ maxWidth: 'md', mx: 'auto' }}>
            <List>
              {[
                'Timeshare scams are stopped cold.',
                'You have clear cancellation rights to exit bad deals.',
                'A longer rescission period protects your choices.',
                'Companies respect your consumer rights.'
              ].map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
            <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>
              Your signature makes this real. Join us to create a safer, fairer future for all timeshare owners!
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Failure Section */}
      <Box sx={{ bgcolor: 'error.light', py: 8 }}>
        <Container>
          <Box sx={{ maxWidth: 'md', mx: 'auto', textAlign: 'center' }}>
            <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold' }}>
              Without Action, Your Rights Fade
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              If we don't fight, timeshare companies will keep denying your rights. Scams will grow, cancellation will stay impossible, and owners will suffer. Don't let your consumer rights slip away—sign now to stop this injustice!
            </Typography>
            <Button
              component={Link}
              to="/sign-petition"
              variant="contained"
              color="error"
              size="large"
              sx={{ py: 1.5, px: 4 }}
            >
              Sign Before It's Too Late
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ConsumerRights; 
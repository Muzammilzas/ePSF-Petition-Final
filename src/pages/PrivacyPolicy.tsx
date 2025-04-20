import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

const PrivacyPolicy: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={0} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Last updated: {new Date().toLocaleDateString()}
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Introduction
        </Typography>
        <Typography paragraph>
          At ePublic Safety Foundation, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
          disclose, and safeguard your information when you use our services.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Data Collection
        </Typography>
        <Typography paragraph>
          We collect the following types of information:
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Personal Information"
              secondary="Name, email address, and other information you provide when using our services"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Technical Information"
              secondary="IP address, browser type, device information, and usage data"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Location Data"
              secondary="City, region, country, and approximate location based on IP address"
            />
          </ListItem>
        </List>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          How We Use Your Data
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Service Provision"
              secondary="To provide and maintain our services"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Communication"
              secondary="To send you important updates and newsletters (with your consent)"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Analytics"
              secondary="To improve our services and understand user behavior"
            />
          </ListItem>
        </List>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Data Storage and Retention
        </Typography>
        <Typography paragraph>
          We store your data securely and retain it only for as long as necessary to fulfill the purposes outlined in this policy:
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Form Submissions"
              secondary="Retained for 2 years unless you request deletion"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Newsletter Subscriptions"
              secondary="Retained until you unsubscribe or request deletion"
            />
          </ListItem>
        </List>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Your Rights Under GDPR
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Right to Access"
              secondary="You can request a copy of your personal data"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Right to Rectification"
              secondary="You can request correction of inaccurate data"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Right to Erasure"
              secondary="You can request deletion of your personal data"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Right to Object"
              secondary="You can object to processing of your personal data"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Right to Data Portability"
              secondary="You can request transfer of your data to another service"
            />
          </ListItem>
        </List>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Data Security
        </Typography>
        <Typography paragraph>
          We implement appropriate technical and organizational measures to protect your personal data against unauthorized 
          access, alteration, disclosure, or destruction.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Contact Us
        </Typography>
        <Typography paragraph>
          If you have any questions about this Privacy Policy or wish to exercise your rights under GDPR, please contact us at:
        </Typography>
        <Typography>
          Email: privacy@epublicsf.org
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography variant="body2" color="text.secondary">
          This Privacy Policy may be updated from time to time. We will notify you of any changes by posting the new Privacy 
          Policy on this page and updating the "Last updated" date.
        </Typography>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy; 
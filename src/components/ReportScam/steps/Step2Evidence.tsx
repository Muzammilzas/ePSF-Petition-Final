import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Grid,
} from '@mui/material';

interface Step2EvidenceProps {
  formData: {
    scammerName: string;
    companyName: string;
    scammerPhone: string;
    scammerEmail: string;
    scammerWebsite: string;
    evidence: File | null;
  };
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step2Evidence: React.FC<Step2EvidenceProps> = ({
  formData,
  onChange,
  onNext,
  onBack,
}) => {
  const [phoneError, setPhoneError] = useState<string>('');
  const [websiteError, setWebsiteError] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onChange('evidence', file);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Basic phone number regex that requires:
    // - Optional + at start
    // - 10-15 digits
    // - Can have spaces, dashes, or parentheses between numbers
    const phoneRegex = /^\+?[\d\s-()]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow digits, +, spaces, dashes, and parentheses
    const sanitizedValue = value.replace(/[^\d\s+()-]/g, '');
    
    if (value !== sanitizedValue) {
      setPhoneError('Please enter a valid phone number');
    } else if (sanitizedValue && !validatePhoneNumber(sanitizedValue)) {
      setPhoneError('Please enter a valid phone number (10-15 digits)');
    } else {
      setPhoneError('');
    }
    
    onChange('scammerPhone', sanitizedValue);
  };

  const validateWebsite = (url: string): boolean => {
    // Empty values are valid
    if (!url || !url.trim()) {
      return true;
    }

    try {
      let formattedUrl = url.trim();
      
      // Add https:// if no protocol is specified
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'https://' + formattedUrl;
      }

      // Basic URL validation
      new URL(formattedUrl);
      
      // Strict URL pattern validation
      const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
      if (!urlPattern.test(formattedUrl)) {
        console.log('Form validation - URL failed pattern:', {
          url: formattedUrl,
          pattern: urlPattern.source
        });
        return false;
      }

      // Additional validation to ensure URL has a valid domain
      const urlParts = formattedUrl.split('://');
      if (urlParts.length !== 2 || !urlParts[1].includes('.')) {
        console.log('Form validation - URL failed domain check:', {
          url: formattedUrl,
          parts: urlParts
        });
        return false;
      }

      return true;
    } catch (error) {
      console.log('Form validation - URL validation error:', {
        url,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  };

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value && !validateWebsite(value)) {
      setWebsiteError(
        'Please enter a valid website URL (e.g., https://example.com). ' +
        'The URL must start with http:// or https:// and contain a valid domain name. ' +
        'Leave empty if you don\'t have a website to report.'
      );
    } else {
      setWebsiteError('');
    }
    
    onChange('scammerWebsite', value);
  };

  const isValid = () => {
    return (
      (formData.scammerName.trim() !== '' ||
      formData.companyName.trim() !== '' ||
      (formData.scammerPhone.trim() !== '' && validatePhoneNumber(formData.scammerPhone)) ||
      formData.scammerEmail.trim() !== '' ||
      (formData.scammerWebsite.trim() !== '' && validateWebsite(formData.scammerWebsite)) ||
      formData.evidence !== null) &&
      (!formData.scammerPhone.trim() || validatePhoneNumber(formData.scammerPhone)) &&
      (!formData.scammerWebsite.trim() || validateWebsite(formData.scammerWebsite))
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Share Any Known Details
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        Scammer's name
      </Typography>
      <TextField
        fullWidth
        placeholder="Enter the scammer's name"
        value={formData.scammerName}
        onChange={(e) => onChange('scammerName', e.target.value)}
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle1" gutterBottom>
        Scammer's company name
      </Typography>
      <TextField
        fullWidth
        placeholder="Enter the company name"
        value={formData.companyName}
        onChange={(e) => onChange('companyName', e.target.value)}
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle1" gutterBottom>
        Phone Number Used by the Scammer
      </Typography>
      <TextField
        fullWidth
        type="tel"
        placeholder="Enter phone number (e.g., +1 234 567 8900)"
        value={formData.scammerPhone}
        onChange={handlePhoneChange}
        error={!!phoneError}
        helperText={phoneError}
        inputProps={{
          maxLength: 20
        }}
        sx={{ 
          mb: 3,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.87)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
            },
            '&.Mui-error fieldset': {
              borderColor: 'error.main',
            }
          }
        }}
      />

      <Typography variant="subtitle1" gutterBottom>
        Email Address Used by the Scammer (Optional)
      </Typography>
      <TextField
        fullWidth
        type="email"
        placeholder="If they contacted you by email, what was the sender's email address?"
        value={formData.scammerEmail}
        onChange={(e) => onChange('scammerEmail', e.target.value)}
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle1" gutterBottom>
        Website or Link Provided by the Scammer
      </Typography>
      <TextField
        fullWidth
        type="url"
        placeholder="If you were sent to a website or link, please share it here"
        value={formData.scammerWebsite}
        onChange={handleWebsiteChange}
        error={!!websiteError}
        helperText={websiteError}
        sx={{ mb: 3 }}
      />

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" gutterBottom>
        Upload any evidence you have (screenshots, contracts, emails, etc.):
      </Typography>
      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.eml"
        onChange={handleFileChange}
        style={{ marginBottom: '24px' }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{ 
            minWidth: '100px',
            color: 'secondary.main',
            borderColor: 'secondary.main',
            '&:hover': {
              borderColor: 'secondary.dark',
              color: 'white',
              backgroundColor: 'secondary.main'
            }
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={onNext}
          disabled={!isValid()}
          sx={{ 
            minWidth: '100px',
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            }
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default Step2Evidence; 
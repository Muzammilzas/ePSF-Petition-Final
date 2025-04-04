import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
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
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onChange('evidence', file);
  };

  const isValid = () => {
    // At least one field should be filled out
    return (
      formData.scammerName.trim() !== '' ||
      formData.companyName.trim() !== '' ||
      formData.scammerPhone.trim() !== '' ||
      formData.scammerEmail.trim() !== '' ||
      formData.scammerWebsite.trim() !== '' ||
      formData.evidence !== null
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
        placeholder="If the scammer contacted you by phone, what number did they use?"
        value={formData.scammerPhone}
        onChange={(e) => {
          // Remove any non-digit characters
          const numbersOnly = e.target.value.replace(/\D/g, '');
          // Limit to 10 digits
          const limitedNumbers = numbersOnly.slice(0, 10);
          onChange('scammerPhone', limitedNumbers);
        }}
        inputProps={{
          inputMode: 'numeric',
          pattern: '[0-9]*'
        }}
        sx={{ mb: 3 }}
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
        onChange={(e) => onChange('scammerWebsite', e.target.value)}
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
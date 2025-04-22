import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { parsePhoneNumber, AsYouType, getCountries, CountryCode, getCountryCallingCode } from 'libphonenumber-js';

interface Step2EvidenceProps {
  formData: {
    scammerName: string;
    companyName: string;
    scammerPhone: string;
    scammerPhoneCountryCode: string;
    scammerEmail: string;
    scammerWebsite: string;
    evidence: File | null;
  };
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const COUNTRY_LIST = getCountries().map(country => {
  try {
    const callingCode = getCountryCallingCode(country as CountryCode);
    return {
      code: country,
      name: new Intl.DisplayNames(['en'], { type: 'region' }).of(country) || country,
      callingCode: callingCode
    };
  } catch {
    return {
      code: country,
      name: new Intl.DisplayNames(['en'], { type: 'region' }).of(country) || country,
      callingCode: '0'
    };
  }
}).sort((a, b) => a.name.localeCompare(b.name));

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

  const handlePhoneChange = (value: string) => {
    try {
      if (!formData.scammerPhoneCountryCode) {
        onChange('scammerPhone', value);
        return;
      }
      const formatter = new AsYouType(formData.scammerPhoneCountryCode as CountryCode);
      const formattedNumber = formatter.input(value);
      onChange('scammerPhone', formattedNumber);
    } catch (error) {
      // If formatting fails, just use the raw value
      onChange('scammerPhone', value);
    }
  };

  const validatePhoneNumber = (phone: string, countryCode: string) => {
    if (!phone.trim()) return false;
    if (!countryCode) return false;
    try {
      const phoneNumber = parsePhoneNumber(phone, countryCode as CountryCode);
      return phoneNumber?.isValid() || false;
    } catch {
      return false;
    }
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
        inputProps={{
          pattern: '[0-9]*',
          inputMode: 'numeric',
          maxLength: 15
        }}
        placeholder="Enter the phone number"
        value={formData.scammerPhone}
        onChange={(e) => {
          const value = e.target.value;
          if (value === '' || /^[0-9]+$/.test(value)) {
            onChange('scammerPhone', value);
          }
        }}
        onKeyDown={(e) => {
          // Allow: backspace, delete, tab, escape, enter
          if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            return;
          }
          // Block any non-number
          if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
            (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
          }
        }}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#E0E0E0',
            },
            '&:hover fieldset': {
              borderColor: '#E0E0E0',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#E0E0E0',
            }
          },
          '& .MuiInputBase-input': {
            padding: '12px 16px',
            '&::placeholder': {
              color: '#757575',
              opacity: 1
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
        onChange={(e) => {
          let url = e.target.value.trim();
          // Add https:// if no protocol is specified
          if (url && !url.match(/^https?:\/\//)) {
            url = 'https://' + url;
          }
          onChange('scammerWebsite', url);
        }}
        error={!!formData.scammerWebsite && !formData.scammerWebsite.match(/^(https?:\/\/)?[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/\S*)?$/)}
        helperText={formData.scammerWebsite && !formData.scammerWebsite.match(/^(https?:\/\/)?[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/\S*)?$/) ? 
          "Please enter a valid website URL (e.g., https://example.com)" : ""}
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
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
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Country</InputLabel>
              <Select
                value={formData.scammerPhoneCountryCode || 'US'}
                label="Country"
                onChange={(e) => {
                  onChange('scammerPhoneCountryCode', e.target.value);
                  onChange('scammerPhone', ''); // Reset phone when country changes
                }}
              >
                {COUNTRY_LIST.map(country => (
                  <MenuItem key={country.code} value={country.code}>
                    {country.name} (+{country.callingCode})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              type="tel"
              placeholder="Enter the phone number"
              value={formData.scammerPhone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              error={formData.scammerPhone && !validatePhoneNumber(formData.scammerPhone, formData.scammerPhoneCountryCode) || undefined}
              helperText={(() => {
                if (!formData.scammerPhone) return '';
                if (!formData.scammerPhoneCountryCode) return 'Please select a country';
                return validatePhoneNumber(formData.scammerPhone, formData.scammerPhoneCountryCode) ? '' : 'Invalid phone number for selected country';
              })()}
            />
          </Grid>
        </Grid>
      </Box>

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
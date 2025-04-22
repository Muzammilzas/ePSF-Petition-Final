import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  InputLabel,
  Grid,
} from '@mui/material';
import { parsePhoneNumber, AsYouType, getCountries, CountryCode, getCountryCallingCode } from 'libphonenumber-js';

interface Step0PersonalProps {
  formData: {
    fullName: string;
    preferredContact: 'Email' | 'Phone' | 'Either' | 'None';
    email: string;
    phone: string;
    countryCode: string;
    city: string;
    state: string;
    ageRange: 'Under 30' | '30–45' | '46–60' | '61+' | '';
    speakWithTeam: boolean;
    shareAnonymously: boolean;
  };
  onChange: (field: string, value: any) => void;
  onNext: () => void;
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'DC', 'PR', 'VI', 'GU', 'MP', 'AS'
];

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

const Step0Personal: React.FC<Step0PersonalProps> = ({ formData, onChange, onNext }) => {
  const isValid = () => {
    // Basic validation
    if (!formData.fullName.trim()) return false;
    
    // Email validation
    if (!formData.email.trim()) return false;
    
    // City and state are required
    if (!formData.city.trim() || !formData.state.trim()) return false;
    
    return true;
  };

  const handlePhoneChange = (value: string) => {
    try {
      if (!formData.countryCode) {
        onChange('phone', value);
        return;
      }
      const formatter = new AsYouType(formData.countryCode as CountryCode);
      const formattedNumber = formatter.input(value);
      onChange('phone', formattedNumber);
    } catch (error) {
      // If formatting fails, just use the raw value
      onChange('phone', value);
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

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Your Information
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        Your Full Name *
      </Typography>
      <TextField
        fullWidth
        value={formData.fullName}
        onChange={(e) => onChange('fullName', e.target.value)}
        required
        error={!formData.fullName.trim()}
        helperText={!formData.fullName.trim() ? 'Full name is required' : ''}
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle1" gutterBottom>
        Email *
      </Typography>
      <TextField
        fullWidth
        type="email"
        value={formData.email}
        onChange={(e) => onChange('email', e.target.value)}
        required
        error={!formData.email.trim()}
        helperText={!formData.email.trim() ? 'Email is required' : ''}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            value={formData.city}
            onChange={(e) => onChange('city', e.target.value)}
            sx={{ mb: 3 }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="State"
            value={formData.state}
            onChange={(e) => onChange('state', e.target.value)}
            required
            placeholder="Enter your state"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Age Range (Optional)</InputLabel>
            <Select
              value={formData.ageRange}
              label="Age Range (Optional)"
              onChange={(e) => onChange('ageRange', e.target.value)}
            >
              <MenuItem value="Under 30">Under 30</MenuItem>
              <MenuItem value="30–45">30–45</MenuItem>
              <MenuItem value="46–60">46–60</MenuItem>
              <MenuItem value="61+">61+</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Typography variant="subtitle1" gutterBottom>
        Are you willing to speak with our team to help raise awareness or provide more details?
      </Typography>
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <RadioGroup
          value={formData.speakWithTeam ? "true" : "false"}
          onChange={(e) => onChange('speakWithTeam', e.target.value === 'true')}
        >
          <FormControlLabel value="true" control={<Radio />} label="Yes" />
          <FormControlLabel value="false" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>

      <Typography variant="subtitle1" gutterBottom>
        Can we share your story anonymously to help warn others?
      </Typography>
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <RadioGroup
          value={formData.shareAnonymously ? "true" : "false"}
          onChange={(e) => onChange('shareAnonymously', e.target.value === 'true')}
        >
          <FormControlLabel value="true" control={<Radio />} label="Yes, anonymously" />
          <FormControlLabel value="false" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
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

export default Step0Personal; 
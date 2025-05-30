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

interface Step0PersonalProps {
  formData: {
    fullName: string;
    email: string;
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

const Step0Personal: React.FC<Step0PersonalProps> = ({ formData, onChange, onNext }) => {
  const isValid = () => {
    // Basic validation
    if (!formData.fullName.trim()) return false;
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) return false;
    
    // City and state are required
    if (!formData.city.trim() || !formData.state.trim()) return false;
    
    return true;
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Your Information
      </Typography>

      <TextField
        fullWidth
        label="Your Full Name"
        value={formData.fullName}
        onChange={(e) => onChange('fullName', e.target.value)}
        sx={{ mb: 3 }}
        required
      />

      <TextField
        fullWidth
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => onChange('email', e.target.value)}
        sx={{ mb: 3 }}
        required
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            label="City"
            value={formData.city}
            onChange={(e) => onChange('city', e.target.value)}
            required
            placeholder="Enter your city"
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
        <Grid item xs={12} sm={4}>
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
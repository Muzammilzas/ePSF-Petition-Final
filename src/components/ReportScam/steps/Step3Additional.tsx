import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
} from '@mui/material';

interface Step3AdditionalProps {
  formData: {
    reportedElsewhere: boolean;
    reportedTo: string;
    wantUpdates: boolean;
  };
  onChange: (field: string, value: any) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const Step3Additional: React.FC<Step3AdditionalProps> = ({
  formData,
  onChange,
  onSubmit,
  onBack,
}) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Make Your Report Go Further
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        Have you reported this to any other agency or platform?
      </Typography>
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <RadioGroup
          value={formData.reportedElsewhere.toString()}
          onChange={(e) => onChange('reportedElsewhere', e.target.value === 'true')}
        >
          <FormControlLabel value="true" control={<Radio />} label="Yes" />
          <FormControlLabel value="false" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>

      {formData.reportedElsewhere && (
        <TextField
          fullWidth
          label="If yes, please list the name of the agency or platform"
          value={formData.reportedTo}
          onChange={(e) => onChange('reportedTo', e.target.value)}
          sx={{ mb: 3 }}
        />
      )}

      <Typography variant="subtitle1" gutterBottom>
        Would you like to receive scam awareness updates from us?
      </Typography>
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <RadioGroup
          value={formData.wantUpdates.toString()}
          onChange={(e) => onChange('wantUpdates', e.target.value === 'true')}
        >
          <FormControlLabel value="true" control={<Radio />} label="Yes" />
          <FormControlLabel value="false" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>

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
          onClick={onSubmit}
          sx={{ 
            minWidth: '100px',
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            }
          }}
        >
          Submit Report
        </Button>
      </Box>
    </Box>
  );
};

export default Step3Additional; 
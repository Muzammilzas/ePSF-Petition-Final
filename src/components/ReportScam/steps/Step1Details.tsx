import React from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  FormControl,
  RadioGroup,
  Radio,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { parsePhoneNumber, AsYouType, getCountries, CountryCode, getCountryCallingCode } from 'libphonenumber-js';

interface ScamType {
  selected: boolean;
  [key: string]: any;
}

interface ContactMethod {
  selected: boolean;
  [key: string]: any;
}

interface Step1DetailsProps {
  formData: {
    scamTypes: {
      fakeResale: ScamType & { claimedSaleAmount: string };
      upfrontFees: ScamType & { amount: string; promisedServices: string };
      highPressure: ScamType & { tactics: string; limitedTimeOrThreat: boolean };
      refundExit: ScamType & { promisedRefund: string; contactedAfterOtherCompany: boolean };
      other: ScamType & { description: string };
    };
    contactMethods: {
      phone: ContactMethod & { number: string; countryCode: string };
      email: ContactMethod & { address: string; evidence: File | null };
      socialMedia: ContactMethod & { platform: string; profileName: string };
      inPerson: ContactMethod & { location: string; eventType: string };
    };
    moneyLost: boolean;
    amountLost: string;
    dateOccurred: string;
  };
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const socialMediaPlatforms = ['Facebook', 'Instagram', 'WhatsApp', 'LinkedIn', 'Other'];

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

const Step1Details: React.FC<Step1DetailsProps> = ({ formData, onChange, onNext, onBack }) => {
  const handleScamTypeChange = (type: keyof typeof formData.scamTypes) => {
    onChange('scamTypes', {
      ...formData.scamTypes,
      [type]: {
        ...formData.scamTypes[type],
        selected: !formData.scamTypes[type].selected
      }
    });
  };

  const handleScamTypeDetailChange = (
    type: keyof typeof formData.scamTypes,
    field: string,
    value: any
  ) => {
    onChange('scamTypes', {
      ...formData.scamTypes,
      [type]: {
        ...formData.scamTypes[type],
        [field]: value
      }
    });
  };

  const handleContactMethodChange = (method: keyof typeof formData.contactMethods) => {
    onChange('contactMethods', {
      ...formData.contactMethods,
      [method]: {
        ...formData.contactMethods[method],
        selected: !formData.contactMethods[method].selected
      }
    });
  };

  const handleContactDetailChange = (
    method: keyof typeof formData.contactMethods,
    field: string,
    value: any
  ) => {
    onChange('contactMethods', {
      ...formData.contactMethods,
      [method]: {
        ...formData.contactMethods[method],
        [field]: value
      }
    });
  };

  const handleDateChange = (date: Date | null) => {
    onChange('dateOccurred', date ? date.toISOString().split('T')[0] : '');
  };

  const handlePhoneChange = (value: string) => {
    try {
      if (!formData.contactMethods.phone.countryCode) {
        handleContactDetailChange('phone', 'number', value);
        return;
      }
      const formatter = new AsYouType(formData.contactMethods.phone.countryCode as CountryCode);
      const formattedNumber = formatter.input(value);
      handleContactDetailChange('phone', 'number', formattedNumber);
    } catch (error) {
      // If formatting fails, just use the raw value
      handleContactDetailChange('phone', 'number', value);
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
    // Check if at least one scam type is selected with required fields filled
    const hasValidScamType = Object.entries(formData.scamTypes).some(([_, data]) => {
      if (!data.selected) return false;
      return Object.entries(data)
        .filter(([key]) => key !== 'selected')
        .every(([_, value]) => {
          if (typeof value === 'boolean') return true;
          return value.toString().trim() !== '';
        });
    });

    // Check if at least one contact method is selected with required fields filled
    const hasValidContactMethod = Object.entries(formData.contactMethods).some(([_, data]) => {
      if (!data.selected) return false;
      return Object.entries(data)
        .filter(([key]) => key !== 'selected' && key !== 'evidence')
        .every(([_, value]) => value.toString().trim() !== '');
    });

    return (
      hasValidScamType &&
      hasValidContactMethod &&
      formData.dateOccurred !== ''
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Tell Us What Happened (Select all that apply)
      </Typography>

      <FormGroup sx={{ mb: 3 }}>
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.scamTypes.fakeResale.selected}
                onChange={() => handleScamTypeChange('fakeResale')}
              />
            }
            label="Fake Resale Offers"
          />
          {formData.scamTypes.fakeResale.selected && (
            <TextField
              fullWidth
              label="What did the scammer claim they could sell your timeshare for?"
              value={formData.scamTypes.fakeResale.claimedSaleAmount}
              onChange={(e) => handleScamTypeDetailChange('fakeResale', 'claimedSaleAmount', e.target.value)}
              sx={{ mt: 1, ml: 3 }}
            />
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.scamTypes.upfrontFees.selected}
                onChange={() => handleScamTypeChange('upfrontFees')}
              />
            }
            label="Upfront Fees for Help"
          />
          {formData.scamTypes.upfrontFees.selected && (
            <Box sx={{ ml: 3 }}>
              <TextField
                fullWidth
                label="How much were you asked to pay upfront?"
                value={formData.scamTypes.upfrontFees.amount}
                onChange={(e) => handleScamTypeDetailChange('upfrontFees', 'amount', e.target.value)}
                sx={{ mt: 1, mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="What services were promised in return?"
                value={formData.scamTypes.upfrontFees.promisedServices}
                onChange={(e) => handleScamTypeDetailChange('upfrontFees', 'promisedServices', e.target.value)}
              />
            </Box>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.scamTypes.highPressure.selected}
                onChange={() => handleScamTypeChange('highPressure')}
              />
            }
            label="High-Pressure Sales"
          />
          {formData.scamTypes.highPressure.selected && (
            <Box sx={{ ml: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="What tactics did they use to pressure you?"
                value={formData.scamTypes.highPressure.tactics}
                onChange={(e) => handleScamTypeDetailChange('highPressure', 'tactics', e.target.value)}
                sx={{ mt: 1, mb: 2 }}
              />
              <Typography variant="subtitle1" gutterBottom>
                Did they claim a limited-time offer or threaten legal action?
              </Typography>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.scamTypes.highPressure.limitedTimeOrThreat}
                      onChange={(e) => handleScamTypeDetailChange('highPressure', 'limitedTimeOrThreat', true)}
                    />
                  }
                  label="Yes"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!formData.scamTypes.highPressure.limitedTimeOrThreat}
                      onChange={(e) => handleScamTypeDetailChange('highPressure', 'limitedTimeOrThreat', false)}
                    />
                  }
                  label="No"
                />
              </FormGroup>
            </Box>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.scamTypes.refundExit.selected}
                onChange={() => handleScamTypeChange('refundExit')}
              />
            }
            label="Refund or Exit Scam"
          />
          {formData.scamTypes.refundExit.selected && (
            <Box sx={{ ml: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="What refund or exit were you promised?"
                value={formData.scamTypes.refundExit.promisedRefund}
                onChange={(e) => handleScamTypeDetailChange('refundExit', 'promisedRefund', e.target.value)}
                sx={{ mt: 1, mb: 2 }}
              />
              <Typography variant="subtitle1" gutterBottom>
                Were you contacted after working with a different company?
              </Typography>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.scamTypes.refundExit.contactedAfterOtherCompany}
                      onChange={(e) => handleScamTypeDetailChange('refundExit', 'contactedAfterOtherCompany', true)}
                    />
                  }
                  label="Yes"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!formData.scamTypes.refundExit.contactedAfterOtherCompany}
                      onChange={(e) => handleScamTypeDetailChange('refundExit', 'contactedAfterOtherCompany', false)}
                    />
                  }
                  label="No"
                />
              </FormGroup>
            </Box>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.scamTypes.other.selected}
                onChange={() => handleScamTypeChange('other')}
              />
            }
            label="Other"
          />
          {formData.scamTypes.other.selected && (
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Please describe the scam in your own words"
              value={formData.scamTypes.other.description}
              onChange={(e) => handleScamTypeDetailChange('other', 'description', e.target.value)}
              sx={{ mt: 1, ml: 3 }}
            />
          )}
        </Box>
      </FormGroup>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        How did the scammer contact you?
      </Typography>
      <FormGroup sx={{ mb: 3 }}>
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.contactMethods.phone.selected}
                onChange={() => handleContactMethodChange('phone')}
              />
            }
            label="Phone"
          />
          {formData.contactMethods.phone.selected && (
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Country</InputLabel>
                    <Select
                      value={formData.contactMethods.phone.countryCode || 'US'}
                      label="Country"
                      onChange={(e) => {
                        handleContactDetailChange('phone', 'countryCode', e.target.value);
                        handleContactDetailChange('phone', 'number', ''); // Reset phone when country changes
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
                    label="Phone Number"
                    value={formData.contactMethods.phone.number}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    required={formData.contactMethods.phone.selected}
                    error={formData.contactMethods.phone.selected && formData.contactMethods.phone.number && !validatePhoneNumber(formData.contactMethods.phone.number, formData.contactMethods.phone.countryCode) || undefined}
                    helperText={(() => {
                      if (!formData.contactMethods.phone.selected) return '';
                      if (!formData.contactMethods.phone.number) return 'Phone number is required';
                      if (!formData.contactMethods.phone.countryCode) return 'Please select a country';
                      return validatePhoneNumber(formData.contactMethods.phone.number, formData.contactMethods.phone.countryCode) ? '' : 'Invalid phone number for selected country';
                    })()}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.contactMethods.email.selected}
                onChange={() => handleContactMethodChange('email')}
              />
            }
            label="Email"
          />
          {formData.contactMethods.email.selected && (
            <Box sx={{ ml: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                If they contacted you by email, what was the sender's email address?
              </Typography>
              <TextField
                fullWidth
                type="email"
                placeholder="Enter email address"
                value={formData.contactMethods.email.address}
                onChange={(e) => handleContactDetailChange('email', 'address', e.target.value)}
                sx={{ mt: 1, mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary" gutterBottom>
                If you have a copy of the email, you can upload it here (optional):
              </Typography>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt,.eml"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  handleContactDetailChange('email', 'evidence', file);
                }}
              />
            </Box>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.contactMethods.socialMedia.selected}
                onChange={() => handleContactMethodChange('socialMedia')}
              />
            }
            label="Social Media"
          />
          {formData.contactMethods.socialMedia.selected && (
            <Box sx={{ ml: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                If you were sent to a website or link, please share it here
              </Typography>
              <TextField
                fullWidth
                type="url"
                placeholder="Enter website URL"
                value={formData.contactMethods.socialMedia.platform}
                onChange={(e) => handleContactDetailChange('socialMedia', 'platform', e.target.value)}
                sx={{ mt: 1, mb: 2 }}
              />
            </Box>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.contactMethods.inPerson.selected}
                onChange={() => handleContactMethodChange('inPerson')}
              />
            }
            label="In Person"
          />
          {formData.contactMethods.inPerson.selected && (
            <Box sx={{ ml: 3 }}>
              <TextField
                fullWidth
                label="Where did the encounter take place?"
                value={formData.contactMethods.inPerson.location}
                onChange={(e) => handleContactDetailChange('inPerson', 'location', e.target.value)}
                sx={{ mt: 1, mb: 2 }}
              />
              <TextField
                fullWidth
                label="Was this during a seminar, resort stay, or public event?"
                value={formData.contactMethods.inPerson.eventType}
                onChange={(e) => handleContactDetailChange('inPerson', 'eventType', e.target.value)}
              />
            </Box>
          )}
        </Box>
      </FormGroup>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" gutterBottom>
        Did you lose money?
      </Typography>
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <RadioGroup
          value={formData.moneyLost.toString()}
          onChange={(e) => onChange('moneyLost', e.target.value === 'true')}
        >
          <FormControlLabel value="true" control={<Radio />} label="Yes" />
          <FormControlLabel value="false" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>

      {formData.moneyLost && (
        <TextField
          fullWidth
          label="If yes, how much?"
          value={formData.amountLost ? `$${Number(formData.amountLost).toLocaleString('en-US')}` : ''}
          onChange={(e) => {
            // Remove any non-numeric characters and commas
            const rawValue = e.target.value.replace(/[^\d]/g, '');
            onChange('amountLost', rawValue);
          }}
          placeholder="Enter amount (e.g. 1000)"
          sx={{ mb: 3 }}
        />
      )}

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Typography variant="subtitle1" gutterBottom>
          When did this happen?
        </Typography>
        <DatePicker
          label="Date"
          value={formData.dateOccurred ? new Date(formData.dateOccurred) : null}
          onChange={handleDateChange}
          slotProps={{ textField: { fullWidth: true, sx: { mb: 3 } } }}
        />
      </LocalizationProvider>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          disabled={true}
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

export default Step1Details; 
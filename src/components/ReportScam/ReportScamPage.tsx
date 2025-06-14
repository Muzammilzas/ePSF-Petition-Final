import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Stepper, Step, StepLabel, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Step0Personal from './steps/Step0Personal';
import Step1Details from './steps/Step1Details';
import Step2Evidence from './steps/Step2Evidence';
import Step3Additional from './steps/Step3Additional';
import SuccessMessage from './SuccessMessage';
import { submitScamReport, uploadEvidence, ScamReport, ScamTypeDetail, ContactMethod } from '../../services/scamReportService';
import { sendScamReportNotification, sendReporterConfirmation } from '../../services/emailService';
import { collectMetaDetails } from '../../utils/metaDetails';
import { supabase } from '../../services/supabase';

interface ScamTypeData {
  selected: boolean;
  claimedSaleAmount?: string;
  amount?: string;
  promisedServices?: string;
  tactics?: string;
  limitedTimeOrThreat?: boolean;
  promisedRefund?: string;
  contactedAfterOtherCompany?: boolean;
  description?: string;
}

interface ContactMethodData {
  selected: boolean;
  number?: string;
  address?: string;
  evidence?: File | null;
  platform?: string;
  profileName?: string;
  location?: string;
  eventType?: string;
}

interface ScamType {
  selected: boolean;
}

interface FormData {
  // Personal Information
  fullName: string;
  email: string;
  city: string;
  state: string;
  ageRange: 'Under 30' | '30–45' | '46–60' | '61+' | '';
  speakWithTeam: boolean;
  shareAnonymously: boolean;

  // Scam Types
  scamTypes: {
    fakeResale: ScamType & { claimedSaleAmount: string };
    upfrontFees: ScamType & { amount: string; promisedServices: string };
    highPressure: ScamType & { tactics: string; limitedTimeOrThreat: boolean };
    refundExit: ScamType & { promisedRefund: string; contactedAfterOtherCompany: boolean };
    other: ScamType & { description: string };
  };
  contactMethods: {
    phone: { selected: boolean; number: string; countryCode: string };
    email: { selected: boolean; address: string; evidence: File | null };
    socialMedia: { selected: boolean; platform: string; profileName: string };
    inPerson: { selected: boolean; location: string; eventType: string };
  };
  moneyLost: boolean;
  amountLost: string;
  dateOccurred: string;
  scammerName: string;
  companyName: string;
  scammerPhone: string;
  scammerPhoneCountryCode: string;
  scammerEmail: string;
  scammerWebsite: string;
  evidence: File | null;
  reportedElsewhere: boolean;
  reportedTo: string;
  wantUpdates: boolean;
}

const steps = ['Your Information', 'Tell Us What Happened', 'Share Any Known Details', 'Make Your Report Go Further'];

function formatWebsite(url: string): string | null {
  if (!url) return null;
  let formattedUrl = url.trim();
  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    formattedUrl = 'https://' + formattedUrl;
  }
  try {
    new URL(formattedUrl);
    return formattedUrl;
  } catch {
    return null;
  }
}

const ReportScamPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    // Personal Information
    fullName: '',
    email: '',
    city: '',
    state: '',
    ageRange: '',
    speakWithTeam: false,
    shareAnonymously: false,

    // Scam Types
    scamTypes: {
      fakeResale: {
        selected: false,
        claimedSaleAmount: '',
      },
      upfrontFees: {
        selected: false,
        amount: '',
        promisedServices: '',
      },
      highPressure: {
        selected: false,
        tactics: '',
        limitedTimeOrThreat: false,
      },
      refundExit: {
        selected: false,
        promisedRefund: '',
        contactedAfterOtherCompany: false,
      },
      other: {
        selected: false,
        description: '',
      }
    },
    contactMethods: {
      phone: { selected: false, number: '', countryCode: '+1' },
      email: { selected: false, address: '', evidence: null },
      socialMedia: { selected: false, platform: '', profileName: '' },
      inPerson: { selected: false, location: '', eventType: '' }
    },
    moneyLost: false,
    amountLost: '',
    dateOccurred: '',
    scammerName: '',
    companyName: '',
    scammerPhone: '',
    scammerPhoneCountryCode: '+1',
    scammerEmail: '',
    scammerWebsite: '',
    evidence: null,
    reportedElsewhere: false,
    reportedTo: '',
    wantUpdates: false,
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    setIsSubmitting(true);
    setError(null);

    try {
      // Collect meta details
      const metaDetails = await collectMetaDetails();
      console.log('Collected meta details:', metaDetails);

      const report: ScamReport = {
        reporter_name: formData.fullName.trim(),
        reporter_email: formData.email.trim(),
        reporter_city: formData.city.trim(),
        reporter_state: formData.state.trim(),
        reporter_age_range: formData.ageRange || undefined,
        speak_with_team: formData.speakWithTeam || false,
        share_anonymously: formData.shareAnonymously || false,
        money_lost: formData.moneyLost || false,
        amount_lost: formData.amountLost ? Math.max(0, parseFloat(formData.amountLost)) : undefined,
        date_occurred: formData.dateOccurred || new Date().toISOString().split('T')[0],
        scammer_name: (formData.scammerName || '').trim(),
        company_name: (formData.companyName || '').trim(),
        scammer_phone: (formData.scammerPhone || '').trim(),
        scammer_email: (formData.scammerEmail || '').trim(),
        scammer_website: formatWebsite(formData.scammerWebsite || ''),
        reported_elsewhere: formData.reportedElsewhere || false,
        reported_to: (formData.reportedTo || '').trim(),
        want_updates: formData.wantUpdates || false,
        evidence_file_url: undefined, // We'll update this after upload
        created_date: new Date().toLocaleString('en-US', { 
          timeZone: 'America/New_York',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).split(',')[0].replace(/\//g, '-'),
        created_time: new Date().toLocaleString('en-US', {
          timeZone: 'America/New_York',
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hourCycle: 'h12'
        })
      };

      // Validate required fields
      if (!report.reporter_name || !report.reporter_city || !report.reporter_state) {
        setError('Name, city, and state are required fields.');
        setIsSubmitting(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!report.reporter_email || !emailRegex.test(report.reporter_email.trim())) {
        setError('Please enter a valid email address.');
        setIsSubmitting(false);
        return;
      }

      // Prepare scam types
      const scamTypes: ScamTypeDetail[] = [];
      if (formData.scamTypes.fakeResale.selected) {
        scamTypes.push({
          scam_type: 'fake_resale',
          claimed_sale_amount: formData.scamTypes.fakeResale.claimedSaleAmount ? 
            parseFloat(formData.scamTypes.fakeResale.claimedSaleAmount) : undefined
        });
      }

      if (formData.scamTypes.upfrontFees.selected) {
        scamTypes.push({
          scam_type: 'upfront_fees',
          amount: formData.scamTypes.upfrontFees.amount ? 
            parseFloat(formData.scamTypes.upfrontFees.amount) : undefined,
          promised_services: formData.scamTypes.upfrontFees.promisedServices
        });
      }

      if (formData.scamTypes.highPressure.selected) {
        scamTypes.push({
          scam_type: 'high_pressure',
          tactics: formData.scamTypes.highPressure.tactics,
          limited_time_or_threat: formData.scamTypes.highPressure.limitedTimeOrThreat
        });
      }

      if (formData.scamTypes.refundExit.selected) {
        scamTypes.push({
          scam_type: 'refund_exit',
          promised_refund: formData.scamTypes.refundExit.promisedRefund,
          contacted_after_other_company: formData.scamTypes.refundExit.contactedAfterOtherCompany
        });
      }

      if (formData.scamTypes.other.selected) {
        scamTypes.push({
          scam_type: 'other',
          description: formData.scamTypes.other.description
        });
      }

      // Prepare contact methods
      const contactMethods: ContactMethod[] = [];
      if (formData.contactMethods.phone.selected) {
        contactMethods.push({
          method: 'phone',
          phone_number: `${formData.contactMethods.phone.countryCode}${formData.contactMethods.phone.number}`
        });
      }

      if (formData.contactMethods.email.selected) {
        contactMethods.push({
          method: 'email',
          email_address: formData.contactMethods.email.address
        });
      }

      if (formData.contactMethods.socialMedia.selected) {
        contactMethods.push({
          method: 'social_media',
          social_media_platform: formData.contactMethods.socialMedia.platform,
          social_media_profile: formData.contactMethods.socialMedia.profileName
        });
      }

      if (formData.contactMethods.inPerson.selected) {
        contactMethods.push({
          method: 'in_person',
          location: formData.contactMethods.inPerson.location,
          event_type: formData.contactMethods.inPerson.eventType
        });
      }

      // Upload evidence if provided
      if (formData.evidence) {
        const uploadResult = await uploadEvidence(formData.evidence, `evidence/${Date.now()}-${formData.evidence.name}`);
        if (!uploadResult.success) {
          let errMsg = 'Unknown error';
          if (uploadResult.error) {
            if (typeof uploadResult.error === 'object' && uploadResult.error !== null && 'message' in uploadResult.error) {
              errMsg = (uploadResult.error as any).message;
            } else if (typeof uploadResult.error === 'string') {
              errMsg = uploadResult.error;
            }
          }
          throw new Error(`Failed to upload evidence: ${errMsg}`);
        }
        report.evidence_file_url = uploadResult.url;
      }

      // Submit the report
      const { data: reportData, error: submitError } = await submitScamReport(report, scamTypes, contactMethods, metaDetails);
      if (submitError) {
        throw new Error(`Failed to submit report: ${submitError.message}`);
      }

      // Send email notifications
      try {
        console.log('Starting email notifications process...');
        
        // Send admin notification
        console.log('Attempting to send admin notification...');
        const adminNotifResult = await sendScamReportNotification({
          report: reportData,
          scamTypes,
          contactMethods: [],
          metaDetails
        });
        
        if (adminNotifResult.success) {
          console.log('Admin notification sent successfully:', adminNotifResult.data);
        } else {
          console.error('Admin notification failed:', {
            error: adminNotifResult.error,
            report: {
              id: reportData.id,
              reporter: reportData.reporter_name,
              email: reportData.reporter_email
            }
          });
        }

        // Send reporter confirmation if requested
        if (formData.wantUpdates) {
          console.log('Attempting to send reporter confirmation...');
          const reporterConfirmResult = await sendReporterConfirmation({
            report: reportData,
            scamTypes,
            contactMethods: []
          });
          
          if (reporterConfirmResult.success) {
            console.log('Reporter confirmation sent successfully:', reporterConfirmResult.data);
          } else {
            console.error('Reporter confirmation failed:', {
              error: reporterConfirmResult.error,
              email: reportData.reporter_email
            });
          }
        } else {
          console.log('Reporter did not request updates - skipping confirmation email');
        }
      } catch (error) {
        console.error('Failed to send notifications:', {
          error,
          reportId: reportData.id,
          adminEmail: 'zasprince007@gmail.com'
        });
        // Don't fail the submission if notifications fail
      }

      // Sync with Google Sheets
      try {
        console.log('Syncing with Google Sheets...');
        const sheetResponse = await fetch('/.netlify/functions/sync-scam-reports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!sheetResponse.ok) {
          const errorData = await sheetResponse.json();
          console.error('Google Sheets sync failed:', errorData);
          // Don't throw error here, continue with the rest of the submission
        } else {
          const syncResult = await sheetResponse.json();
          console.log('Google Sheets sync successful:', syncResult);
        }
      } catch (sheetError) {
        console.error('Error syncing with Google Sheets:', sheetError);
        // Don't throw error here, continue with the rest of the submission
      }

      // Show success message
      navigate('/report-scam/thank-you');
    } catch (error: any) {
      console.error('Error submitting report:', error);
      setError(error.message || 'An error occurred while submitting your report. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStepContent = (step: number) => {
    if (step >= steps.length) {
      return <SuccessMessage />;
    }

    switch (step) {
      case 0:
        return (
          <Step0Personal
            formData={formData}
            onChange={handleFormChange}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <Step1Details
            formData={formData}
            onChange={handleFormChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <Step2Evidence
            formData={formData}
            onChange={handleFormChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <Step3Additional
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  if (currentStep >= steps.length) {
    return <SuccessMessage />;
  }

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{
        minHeight: '100vh',
        py: 8,
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography variant="h3" component="h1" align="center" gutterBottom color="primary">
            Have You Been Targeted by a Timeshare Scam?
          </Typography>
          <Typography variant="h6" align="center" color="secondary" paragraph>
            You're not alone — and your story could help stop the next one.
          </Typography>
          <Typography variant="body1" align="center" paragraph sx={{ mb: 4 }}>
            At ePublic Safety Foundation, we believe no one should feel helpless after being scammed. 
            We're here to listen, support, and take action. Your report helps us document scams, 
            warn others, and protect more people just like you.
          </Typography>

          <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }} color="primary">
            Report the Scam
          </Typography>
          <Typography variant="body1" align="center" paragraph sx={{ mb: 4 }}>
            Complete the steps below to submit your report.
          </Typography>

          {currentStep < steps.length && (
            <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}

          {getStepContent(currentStep)}
        </Paper>
      </Container>
    </Box>
  );
};

export default ReportScamPage; 
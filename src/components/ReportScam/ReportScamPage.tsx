import React, { useState, useEffect } from 'react';
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
import { saveAbandonedForm, markFormCompleted } from '../../services/abandonedFormService';
import { collectMetaDetails } from '../../utils/metaDetails';
import { v4 as uuidv4 } from 'uuid';

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

const ReportScamPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [sessionId, setSessionId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const navigate = useNavigate();

  // Move hasFormData to component scope
  const hasFormData = () => {
    // Consider any form interaction as potentially abandoned
    const hasPersonalInfo = !!(
      formData.fullName ||
      formData.city ||
      formData.state ||
      formData.ageRange ||
      formData.speakWithTeam ||
      formData.shareAnonymously
    );

    const hasScamTypes = Object.values(formData.scamTypes).some(type => type.selected);
    
    const hasScammerInfo = !!(
      formData.scammerName ||
      formData.companyName ||
      formData.scammerEmail ||
      formData.scammerPhone ||
      formData.scammerWebsite
    );

    const hasIncidentDetails = !!(
      formData.moneyLost ||
      formData.amountLost ||
      formData.dateOccurred ||
      formData.evidence ||
      formData.reportedElsewhere ||
      formData.reportedTo
    );

    // Return true if ANY section has data
    return hasPersonalInfo || hasScamTypes || hasScammerInfo || hasIncidentDetails;
  };

  // Initialize session ID
  useEffect(() => {
    // Generate a new session ID for each form start
    const newSessionId = `${uuidv4()}_${Date.now()}`;
    setSessionId(newSessionId);
    console.log('New session started:', newSessionId);
  }, []);

  // Track last saved form data to prevent duplicate saves
  const [lastSavedData, setLastSavedData] = useState<string>('');

  // Save form data periodically and when user leaves
  useEffect(() => {
    if (!sessionId) return;

    const saveFormData = async () => {
      try {
        // Only save if we have data and it has changed
        if (hasFormData()) {
          const currentFormDataString = JSON.stringify(formData);
          
          // Check if the form data has actually changed
          if (currentFormDataString !== lastSavedData) {
            console.log('Form data changed, saving...', {
              sessionId,
              currentStep: activeStep,
              hasPersonalInfo: !!(formData.fullName || formData.city || formData.state),
              hasScamTypes: Object.values(formData.scamTypes).some(type => type.selected),
              hasScammerInfo: !!(formData.scammerName || formData.companyName),
              step: activeStep,
              timestamp: new Date().toLocaleString('en-US', {
                timeZone: 'America/New_York',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
              })
            });

            const { data, error } = await saveAbandonedForm(
              formData,
              activeStep.toString(),
              sessionId
            );
            
            if (error) {
              console.error('Error saving abandoned form:', error);
              return;
            }
            
            // Update last saved data after successful save
            setLastSavedData(currentFormDataString);
            console.log('Form data saved successfully', { data });
          }
        }
      } catch (error) {
        console.error('Exception saving abandoned form:', error);
      }
    };

    // Save form data every 30 seconds (increased from 15 to reduce frequency)
    const saveInterval = setInterval(saveFormData, 30000);

    // Save form data when user leaves the page
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      if (hasFormData()) {
        e.preventDefault();
        e.returnValue = '';
        await saveFormData();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(saveInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (hasFormData()) {
        saveFormData();
      }
    };
  }, [formData, activeStep, sessionId, lastSavedData]);

  // Save whenever the step changes
  useEffect(() => {
    if (!sessionId) return;
    
    const saveFormData = async () => {
      if (hasFormData()) {
        try {
          const currentFormDataString = JSON.stringify(formData);
          
          // Only save if data has changed
          if (currentFormDataString !== lastSavedData) {
            const { error } = await saveAbandonedForm(formData, activeStep.toString(), sessionId);
            if (error) {
              console.error('Error saving form on step change:', error);
            } else {
              setLastSavedData(currentFormDataString);
              console.log('Form saved on step change');
            }
          }
        } catch (error) {
          console.error('Exception saving form on step change:', error);
        }
      }
    };

    saveFormData();
  }, [activeStep, sessionId, formData, lastSavedData]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.fullName || !formData.city || !formData.state) {
        setError('Name, city, and state are required fields.');
        setIsSubmitting(false);
        return;
      }

      // Collect meta details
      const metaDetails = await collectMetaDetails();

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

      // Prepare report data
      const report: ScamReport = {
        reporter_name: formData.fullName,
        reporter_city: formData.city,
        reporter_state: formData.state,
        reporter_age_range: formData.ageRange || undefined,
        speak_with_team: formData.speakWithTeam,
        share_anonymously: formData.shareAnonymously,
        money_lost: formData.moneyLost,
        amount_lost: formData.amountLost ? parseFloat(formData.amountLost) : undefined,
        date_occurred: formData.dateOccurred,
        scammer_name: formData.scammerName,
        company_name: formData.companyName,
        scammer_phone: formData.scammerPhone,
        scammer_email: formData.scammerEmail,
        scammer_website: formData.scammerWebsite,
        reported_elsewhere: formData.reportedElsewhere,
        reported_to: formData.reportedTo,
        want_updates: formData.wantUpdates,
        evidence_file_url: undefined // We'll update this after upload
      };

      // Upload evidence file if it exists
      if (formData.evidence) {
        try {
          const timestamp = new Date().toLocaleString('en-US', {
            timeZone: 'America/New_York',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          });
          const fileName = `${timestamp}-${formData.evidence.name}`;
          const { success: uploadSuccess, url, error: uploadError } = await uploadEvidence(formData.evidence, fileName);
          if (!uploadSuccess) {
            console.error('Evidence upload error:', uploadError);
            throw new Error(uploadError instanceof Error ? uploadError.message : 'Failed to upload evidence file');
          }
          report.evidence_file_url = url;
          console.log('Evidence uploaded successfully:', url);
        } catch (error) {
          console.error('Failed to upload evidence:', error);
          setError('Failed to upload evidence file. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      console.log('Submitting report to database:', { report, scamTypes });

      // Submit the report
      const { success: submitSuccess, error: submitError, data: reportData } = await submitScamReport(report, scamTypes, [], metaDetails);
      
      if (!submitSuccess || !reportData) {
        console.error('Report submission failed:', submitError);
        throw new Error(submitError instanceof Error ? submitError.message : 'Failed to submit report');
      }

      console.log('Report submitted successfully:', reportData);

      // Send email notifications
      try {
        await sendScamReportNotification({
          report: reportData,
          scamTypes,
          contactMethods: [],
          metaDetails
        });
        console.log('Admin notification sent successfully');

        if (formData.wantUpdates) {
          await sendReporterConfirmation({
            report: reportData,
            scamTypes,
            contactMethods: []
          });
          console.log('Reporter confirmation sent successfully');
        }
      } catch (error) {
        console.error('Failed to send notifications:', error);
        // Don't fail the submission if notifications fail
      }

      // Mark form as completed and clear abandoned form data
      await markFormCompleted(sessionId);
      
      // Navigate to success page
      navigate('/report-scam/thank-you');
    } catch (error) {
      console.error('Form submission error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while submitting your report');
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

  if (activeStep >= steps.length) {
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

          {activeStep < steps.length && (
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}

          {getStepContent(activeStep)}
        </Paper>
      </Container>
    </Box>
  );
};

export default ReportScamPage; 
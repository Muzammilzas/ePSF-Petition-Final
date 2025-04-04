import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Stepper, Step, StepLabel } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Step0Personal from './steps/Step0Personal';
import Step1Details from './steps/Step1Details';
import Step2Evidence from './steps/Step2Evidence';
import Step3Additional from './steps/Step3Additional';
import SuccessMessage from './SuccessMessage';
import { submitScamReport, uploadEvidence, ScamReport, ScamTypeDetail, ContactMethod } from '../../services/scamReportService';
import { sendScamReportNotification, sendReporterConfirmation } from '../../services/emailService';

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
  preferredContact: 'Email' | 'Phone' | 'Either' | 'None';
  email: string;
  phone: string;
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
    phone: { selected: boolean; number: string };
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
  const [formData, setFormData] = useState<FormData>({
    // Personal Information
    fullName: '',
    preferredContact: 'None',
    email: '',
    phone: '',
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
      phone: {
        selected: false,
        number: '',
      },
      email: {
        selected: false,
        address: '',
        evidence: null,
      },
      socialMedia: {
        selected: false,
        platform: '',
        profileName: '',
      },
      inPerson: {
        selected: false,
        location: '',
        eventType: '',
      }
    },
    moneyLost: false,
    amountLost: '',
    dateOccurred: '',
    scammerName: '',
    companyName: '',
    scammerPhone: '',
    scammerEmail: '',
    scammerWebsite: '',
    evidence: null,
    reportedElsewhere: false,
    reportedTo: '',
    wantUpdates: false,
  });

  const navigate = useNavigate();

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      // Upload evidence file if it exists
      let evidenceUrl = '';
      if (formData.evidence) {
        const timestamp = new Date().getTime();
        const fileName = `${timestamp}-${formData.evidence.name}`;
        const { success, url, error } = await uploadEvidence(formData.evidence, fileName);
        if (!success) throw error;
        evidenceUrl = url || '';
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
          phone_number: formData.contactMethods.phone.number
        });
      }

      if (formData.contactMethods.email.selected) {
        contactMethods.push({
          method: 'email',
          email_address: formData.contactMethods.email.address,
          evidence_file_url: formData.contactMethods.email.evidence ? 
            `${Date.now()}-${formData.contactMethods.email.evidence.name}` : undefined
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

      // Prepare main report data
      const report: ScamReport = {
        reporter_name: formData.fullName,
        reporter_email: formData.email,
        reporter_phone: formData.phone,
        reporter_city: formData.city,
        reporter_state: formData.state,
        reporter_age_range: formData.ageRange || undefined,
        speak_with_team: formData.speakWithTeam,
        share_anonymously: formData.shareAnonymously,
        preferred_contact: formData.preferredContact,
        money_lost: formData.moneyLost,
        amount_lost: formData.amountLost ? parseFloat(formData.amountLost) : undefined,
        date_occurred: formData.dateOccurred || new Date().toISOString().split('T')[0],
        scammer_name: formData.scammerName,
        company_name: formData.companyName,
        scammer_phone: formData.scammerPhone,
        scammer_email: formData.scammerEmail,
        scammer_website: formData.scammerWebsite,
        reported_elsewhere: formData.reportedElsewhere,
        reported_to: formData.reportedTo,
        want_updates: formData.wantUpdates,
        evidence_file_url: evidenceUrl || undefined
      };

      // Submit the report
      const { success, error } = await submitScamReport(report, scamTypes, contactMethods);
      if (!success) throw error;

      // Send email notifications
      try {
        // Send notification to admin
        await sendScamReportNotification({
          report,
          scamTypes,
          contactMethods
        });

        // Send confirmation to reporter if they want updates
        if (report.want_updates && report.reporter_email) {
          await sendReporterConfirmation(report);
        }
      } catch (emailError) {
        console.error('Error sending email notifications:', emailError);
        // Don't throw error here, as the report was successfully submitted
      }

      // Navigate to thank you page
      navigate('/report-scam/thank-you');
    } catch (error: any) {
      console.error('Error submitting form:', error);
      // Show detailed error message to user
      alert(error?.message || 'There was an error submitting your report. Please try again.');
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
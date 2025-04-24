-- Make reporter_email and preferred_contact optional, remove reporter_phone
ALTER TABLE scam_reports 
  ALTER COLUMN reporter_email DROP NOT NULL,
  ALTER COLUMN preferred_contact DROP NOT NULL,
  DROP COLUMN reporter_phone; 
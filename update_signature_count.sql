CREATE OR REPLACE FUNCTION update_signature_count() 
RETURNS TRIGGER AS $$ 
BEGIN 
  IF TG_OP = 'INSERT' THEN 
    UPDATE petitions 
    SET signature_count = signature_count + 1 
    WHERE id = NEW.petition_id; 
  ELSIF TG_OP = 'DELETE' THEN 
    UPDATE petitions 
    SET signature_count = signature_count - 1 
    WHERE id = OLD.petition_id; 
  END IF; 
  RETURN NEW; 
END; 
$$ LANGUAGE plpgsql; 

DROP TRIGGER IF EXISTS update_signature_count_trigger ON signatures; 

CREATE TRIGGER update_signature_count_trigger 
AFTER INSERT OR DELETE ON signatures 
FOR EACH ROW 
EXECUTE FUNCTION update_signature_count();

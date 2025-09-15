-- Add ID verification fields to landlords table
ALTER TABLE landlords ADD COLUMN IF NOT EXISTS id_verification_status VARCHAR(50) DEFAULT 'not_started';
ALTER TABLE landlords ADD COLUMN IF NOT EXISTS id_verification_inquiry_id VARCHAR(255);
ALTER TABLE landlords ADD COLUMN IF NOT EXISTS id_verification_completed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE landlords ADD COLUMN IF NOT EXISTS id_verification_attributes JSONB;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_landlords_verification_status ON landlords(id_verification_status);
CREATE INDEX IF NOT EXISTS idx_landlords_verification_inquiry ON landlords(id_verification_inquiry_id);

-- Update existing landlords to have default verification status
UPDATE landlords 
SET id_verification_status = 'not_started' 
WHERE id_verification_status IS NULL;

-- Add constraint to ensure valid verification statuses
ALTER TABLE landlords 
ADD CONSTRAINT check_verification_status 
CHECK (id_verification_status IN (
  'not_started', 
  'pending', 
  'approved', 
  'declined', 
  'expired'
));

-- Create verification events table for audit trail
CREATE TABLE IF NOT EXISTS landlord_verification_events (
  id SERIAL PRIMARY KEY,
  landlord_email VARCHAR(255) NOT NULL,
  inquiry_id VARCHAR(255),
  event_type VARCHAR(50) NOT NULL, -- 'started', 'completed', 'failed', 'expired'
  status VARCHAR(50),
  attributes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (landlord_email) REFERENCES landlords(email) ON DELETE CASCADE
);

-- Add indexes for verification events
CREATE INDEX IF NOT EXISTS idx_verification_events_landlord ON landlord_verification_events(landlord_email);
CREATE INDEX IF NOT EXISTS idx_verification_events_inquiry ON landlord_verification_events(inquiry_id);
CREATE INDEX IF NOT EXISTS idx_verification_events_type ON landlord_verification_events(event_type);
CREATE INDEX IF NOT EXISTS idx_verification_events_created ON landlord_verification_events(created_at);

-- Enable RLS on verification events
ALTER TABLE landlord_verification_events ENABLE ROW LEVEL SECURITY;

-- RLS policies for verification events
CREATE POLICY "Landlords can view their own verification events" ON landlord_verification_events
  FOR SELECT USING (landlord_email = auth.jwt() ->> 'email');

CREATE POLICY "Service role can do everything on verification events" ON landlord_verification_events
  FOR ALL USING (auth.role() = 'service_role');

-- Function to log verification events
CREATE OR REPLACE FUNCTION log_verification_event(
  p_landlord_email VARCHAR(255),
  p_inquiry_id VARCHAR(255),
  p_event_type VARCHAR(50),
  p_status VARCHAR(50),
  p_attributes JSONB DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO landlord_verification_events (
    landlord_email,
    inquiry_id,
    event_type,
    status,
    attributes
  ) VALUES (
    p_landlord_email,
    p_inquiry_id,
    p_event_type,
    p_status,
    p_attributes
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

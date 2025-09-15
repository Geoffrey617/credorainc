-- First, ensure landlords table has proper unique constraint on email
ALTER TABLE landlords ADD CONSTRAINT unique_landlord_email UNIQUE (email);

-- Update landlords table for Veriff integration
ALTER TABLE landlords ADD COLUMN IF NOT EXISTS id_verification_status VARCHAR(50) DEFAULT 'not_started';
ALTER TABLE landlords ADD COLUMN IF NOT EXISTS id_verification_session_id VARCHAR(255);
ALTER TABLE landlords ADD COLUMN IF NOT EXISTS id_verification_completed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE landlords ADD COLUMN IF NOT EXISTS id_verification_data JSONB;

-- Remove Persona-specific column if it exists
ALTER TABLE landlords DROP COLUMN IF EXISTS id_verification_inquiry_id;
ALTER TABLE landlords DROP COLUMN IF EXISTS id_verification_attributes;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_landlords_verification_status ON landlords(id_verification_status);
CREATE INDEX IF NOT EXISTS idx_landlords_verification_session ON landlords(id_verification_session_id);

-- Update existing landlords to have default verification status
UPDATE landlords 
SET id_verification_status = 'not_started' 
WHERE id_verification_status IS NULL;

-- Add constraint to ensure valid verification statuses for Veriff
ALTER TABLE landlords DROP CONSTRAINT IF EXISTS check_verification_status;
ALTER TABLE landlords 
ADD CONSTRAINT check_verification_status 
CHECK (id_verification_status IN (
  'not_started', 
  'pending', 
  'approved', 
  'declined', 
  'expired',
  'resubmission_required'
));

-- Drop existing verification events table if it exists
DROP TABLE IF EXISTS landlord_verification_events;

-- Create verification events table for Veriff (without foreign key constraint for now)
CREATE TABLE landlord_verification_events (
  id SERIAL PRIMARY KEY,
  landlord_email VARCHAR(255) NOT NULL,
  session_id VARCHAR(255),
  event_type VARCHAR(50) NOT NULL, -- 'started', 'approved', 'declined', 'review', 'resubmission_requested'
  status VARCHAR(50),
  verification_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for verification events
CREATE INDEX IF NOT EXISTS idx_verification_events_landlord ON landlord_verification_events(landlord_email);
CREATE INDEX IF NOT EXISTS idx_verification_events_session ON landlord_verification_events(session_id);
CREATE INDEX IF NOT EXISTS idx_verification_events_type ON landlord_verification_events(event_type);
CREATE INDEX IF NOT EXISTS idx_verification_events_created ON landlord_verification_events(created_at);

-- Enable RLS on verification events
ALTER TABLE landlord_verification_events ENABLE ROW LEVEL SECURITY;

-- RLS policies for verification events
CREATE POLICY "Landlords can view their own verification events" ON landlord_verification_events
  FOR SELECT USING (landlord_email = auth.jwt() ->> 'email');

CREATE POLICY "Service role can do everything on verification events" ON landlord_verification_events
  FOR ALL USING (auth.role() = 'service_role');

-- Function to log verification events for Veriff
CREATE OR REPLACE FUNCTION log_veriff_event(
  p_landlord_email VARCHAR(255),
  p_session_id VARCHAR(255),
  p_event_type VARCHAR(50),
  p_status VARCHAR(50),
  p_verification_data JSONB DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO landlord_verification_events (
    landlord_email,
    session_id,
    event_type,
    status,
    verification_data
  ) VALUES (
    p_landlord_email,
    p_session_id,
    p_event_type,
    p_status,
    p_verification_data
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

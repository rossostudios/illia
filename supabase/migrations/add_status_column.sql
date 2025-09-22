-- Add status column to providers table if it doesn't exist
ALTER TABLE providers
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Update existing providers to 'verified' status
UPDATE providers
SET status = 'verified'
WHERE verified = true;

-- Add index on status column for performance
CREATE INDEX IF NOT EXISTS idx_providers_status ON providers(status);

-- Verify the column was added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'providers'
  AND column_name = 'status';
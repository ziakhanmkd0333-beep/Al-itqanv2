-- Add is_approved column to users table for approval system
-- This ensures only admin-approved users can log in and access the system

-- Add is_approved column with default false (pending approval)
ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Add approval tracking columns
ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id),
    ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster approval filtering
CREATE INDEX IF NOT EXISTS idx_users_is_approved ON users(is_approved);

-- Update existing users to be approved (for migration safety)
-- In production, admin should manually approve users
UPDATE users SET is_approved = true WHERE is_approved IS NULL;

-- Add comment explaining the column
COMMENT ON COLUMN users.is_approved IS 'Whether the user has been approved by an admin. Only approved users can log in.';

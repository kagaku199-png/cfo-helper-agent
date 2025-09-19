-- Create scenarios table for storing financial scenarios
CREATE TABLE IF NOT EXISTS scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  revenue DECIMAL(15,2) NOT NULL DEFAULT 0,
  expenses DECIMAL(15,2) NOT NULL DEFAULT 0,
  growth_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  burn_rate DECIMAL(15,2) NOT NULL DEFAULT 0,
  cash_on_hand DECIMAL(15,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;

-- Create policies for scenarios table
CREATE POLICY "Allow all operations on scenarios" ON scenarios
  FOR ALL USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_scenarios_created_at ON scenarios(created_at);

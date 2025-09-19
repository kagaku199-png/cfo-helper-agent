-- Create usage tracking table for monitoring app usage
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  scenario_id UUID REFERENCES scenarios(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable Row Level Security
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for usage_tracking table
CREATE POLICY "Allow all operations on usage_tracking" ON usage_tracking
  FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_usage_tracking_timestamp ON usage_tracking(timestamp);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_action ON usage_tracking(action);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_scenario_id ON usage_tracking(scenario_id);

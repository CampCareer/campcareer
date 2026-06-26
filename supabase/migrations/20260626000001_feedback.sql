CREATE TABLE IF NOT EXISTS feedback (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('issue', 'suggestion')),
  category text,
  description text NOT NULL,
  email_consent boolean DEFAULT false,
  screenshot_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert feedback" ON feedback
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Only service role can read feedback" ON feedback
  FOR SELECT
  TO service_role
  USING (true);

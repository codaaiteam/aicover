-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_generations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own orders"
ON orders FOR SELECT
TO authenticated
USING (user_email = auth.jwt() ->> 'email');

CREATE POLICY "Users can view their own generations"
ON video_generations FOR SELECT
TO authenticated
USING (user_email = auth.jwt() ->> 'email');

-- Add indexes if not exists
CREATE INDEX IF NOT EXISTS idx_orders_user_email ON orders(user_email);
CREATE INDEX IF NOT EXISTS idx_video_generations_user_email ON video_generations(user_email);

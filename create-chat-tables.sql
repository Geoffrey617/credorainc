-- Create chat_conversations table
CREATE TABLE IF NOT EXISTS chat_conversations (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'closed', 'pending'
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES chat_conversations(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  sender_type VARCHAR(20) NOT NULL, -- 'user' or 'admin'
  sender_name VARCHAR(255),
  sender_email VARCHAR(255), -- null for admin messages
  read_by_admin BOOLEAN DEFAULT FALSE,
  read_by_user BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_email ON chat_conversations(user_email);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_status ON chat_conversations(status);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_last_message_at ON chat_conversations(last_message_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for chat_conversations
CREATE POLICY "Users can view their own conversations" ON chat_conversations
  FOR SELECT USING (user_email = auth.jwt() ->> 'email');

CREATE POLICY "Users can insert their own conversations" ON chat_conversations
  FOR INSERT WITH CHECK (user_email = auth.jwt() ->> 'email');

CREATE POLICY "Users can update their own conversations" ON chat_conversations
  FOR UPDATE USING (user_email = auth.jwt() ->> 'email');

-- Create RLS policies for chat_messages
CREATE POLICY "Users can view messages in their conversations" ON chat_messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM chat_conversations WHERE user_email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Users can insert messages in their conversations" ON chat_messages
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT id FROM chat_conversations WHERE user_email = auth.jwt() ->> 'email'
    )
  );

-- Admin policies (bypass RLS for service role)
CREATE POLICY "Service role can do everything on conversations" ON chat_conversations
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything on messages" ON chat_messages
  FOR ALL USING (auth.role() = 'service_role');

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for chat_conversations
CREATE TRIGGER update_chat_conversations_updated_at 
  BEFORE UPDATE ON chat_conversations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample admin user for testing (optional)
-- You can remove this if you don't want sample data
INSERT INTO chat_conversations (user_email, user_name, status, last_message, last_message_at) 
VALUES ('admin@credorainc.com', 'Admin', 'active', 'Welcome to Credora Support!', NOW())
ON CONFLICT DO NOTHING;

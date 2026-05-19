-- Create profiles table
CREATE TABLE profiles (
  id uuid REFERENCES auth.users PRIMARY KEY,
  full_name text NOT NULL,
  email text NOT NULL,
  role text DEFAULT 'employee' CHECK (role IN ('employee', 'manager')),
  avatar_color text, -- used for avatar initials color
  created_at timestamptz DEFAULT now()
);

-- Create standups table
CREATE TABLE standups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  today text,
  tomorrow text,
  blockers text, -- supports @mentions stored as plain text with @full_name
  mood text CHECK (mood IN ('great', 'good', 'meh', 'struggling')),
  is_late boolean DEFAULT false,
  submitted_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create mentions table
CREATE TABLE mentions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  standup_id uuid REFERENCES standups(id) ON DELETE CASCADE,
  mentioned_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  mentioning_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create settings table
CREATE TABLE settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  digest_enabled boolean DEFAULT true,
  digest_time time DEFAULT '08:00',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE standups ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Standups are viewable by everyone." ON standups FOR SELECT USING (true);
CREATE POLICY "Users can insert their own standups." ON standups FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own standups." ON standups FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Mentions are viewable by everyone." ON mentions FOR SELECT USING (true);
CREATE POLICY "Users can insert mentions." ON mentions FOR INSERT WITH CHECK (auth.uid() = mentioning_user_id);

CREATE POLICY "Settings are viewable by everyone." ON settings FOR SELECT USING (true);
CREATE POLICY "Managers can update settings." ON settings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'manager')
);

-- Trigger: auto-create profile when a new auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_full_name text;
  user_role text;
  user_avatar_color text;
BEGIN
  -- Extract metadata from the auth user, with defaults
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email);
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'employee');
  user_avatar_color := COALESCE(NEW.raw_user_meta_data->>'avatar_color', '#' || lpad(to_hex(trunc(random()*16777215)::int), 6, '0'));

  INSERT INTO public.profiles (id, full_name, email, role, avatar_color)
  VALUES (NEW.id, user_full_name, NEW.email, user_role, user_avatar_color);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert initial settings
INSERT INTO settings (digest_enabled, digest_time) VALUES (true, '08:00');

-- NOTE: Seed data for profiles would normally be handled after users are created in auth.users.
-- Below is the SQL to manually seed the profiles table if auth users are created with matching IDs.
/*
-- Replace UUIDs with actual auth user IDs
INSERT INTO profiles (id, full_name, email, role, avatar_color) VALUES
('uuid-manager', 'Team Manager', 'manager@example.com', 'manager', '#0D9488'),
('uuid-alice', 'Alice Johnson', 'alice@example.com', 'employee', '#7C3AED'),
('uuid-bob', 'Bob Smith', 'bob@example.com', 'employee', '#EA580C'),
('uuid-charlie', 'Charlie Brown', 'charlie@example.com', 'employee', '#059669'),
('uuid-david', 'David Wilson', 'david@example.com', 'employee', '#2563EB');
*/

-- Create tables for the migration from Firebase to Supabase

-- Services Table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  icon TEXT,
  image TEXT,
  price TEXT,
  features TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  client TEXT,
  category TEXT,
  technologies JSONB, -- Storing Technology[] as JSONB
  images TEXT[],
  project_url TEXT,
  completion_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials Table
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  company TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quote Requests Table
CREATE TABLE quote_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  service TEXT,
  project_details TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'quoted', 'approved', 'rejected')),
  ai_report JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Settings Table
CREATE TABLE site_settings (
  id TEXT PRIMARY KEY DEFAULT 'site',
  site_name TEXT,
  tagline TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  about_text TEXT,
  services_text TEXT,
  projects_text TEXT,
  contact_text TEXT,
  logo TEXT,
  favicon TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  accent_color TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  contact_address TEXT,
  social_links JSONB,
  contact_info JSONB,
  carousel_images TEXT[],
  hero_images TEXT[],
  services_images TEXT[],
  testimonials_background TEXT,
  footer_text TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  google_analytics_id TEXT,
  custom_scripts TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
-- For now, making them public for read, and authenticated for write (though auth is not yet implemented)
-- You should configure these policies according to your needs.

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public Read Access" ON services FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON site_settings FOR SELECT USING (true);

-- Public insert for quote requests (so anyone can send a request)
CREATE POLICY "Public Insert Quote Requests" ON quote_requests FOR INSERT WITH CHECK (true);

-- For Admin (Full access) - Needs Auth setup later
-- CREATE POLICY "Admin Full Access" ON services ALL USING (auth.role() = 'authenticated');
-- ... same for others

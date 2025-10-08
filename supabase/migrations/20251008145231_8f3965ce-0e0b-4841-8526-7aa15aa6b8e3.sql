-- Create apps table to store app information
CREATE TABLE public.apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  version TEXT NOT NULL,
  size TEXT NOT NULL,
  downloads INTEGER DEFAULT 0,
  apk_url TEXT NOT NULL,
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read apps
CREATE POLICY "Anyone can view apps"
  ON public.apps
  FOR SELECT
  USING (true);

-- Allow anyone to insert apps (you can add authentication later)
CREATE POLICY "Anyone can upload apps"
  ON public.apps
  FOR INSERT
  WITH CHECK (true);

-- Create storage bucket for APK files
INSERT INTO storage.buckets (id, name, public)
VALUES ('apk-files', 'apk-files', true);

-- Create storage bucket for app icons
INSERT INTO storage.buckets (id, name, public)
VALUES ('app-icons', 'app-icons', true);

-- Storage policies for APK files
CREATE POLICY "Anyone can view APK files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'apk-files');

CREATE POLICY "Anyone can upload APK files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'apk-files');

-- Storage policies for app icons
CREATE POLICY "Anyone can view app icons"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'app-icons');

CREATE POLICY "Anyone can upload app icons"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'app-icons');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_apps_updated_at
  BEFORE UPDATE ON public.apps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
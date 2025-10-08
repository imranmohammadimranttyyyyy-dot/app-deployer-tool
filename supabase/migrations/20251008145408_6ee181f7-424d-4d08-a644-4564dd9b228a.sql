-- Create storage bucket for APK files
INSERT INTO storage.buckets (id, name, public)
VALUES ('apk-files', 'apk-files', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for app icons
INSERT INTO storage.buckets (id, name, public)
VALUES ('app-icons', 'app-icons', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for APK files
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Anyone can view APK files'
  ) THEN
    CREATE POLICY "Anyone can view APK files"
      ON storage.objects
      FOR SELECT
      USING (bucket_id = 'apk-files');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Anyone can upload APK files'
  ) THEN
    CREATE POLICY "Anyone can upload APK files"
      ON storage.objects
      FOR INSERT
      WITH CHECK (bucket_id = 'apk-files');
  END IF;
END $$;

-- Storage policies for app icons
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Anyone can view app icons'
  ) THEN
    CREATE POLICY "Anyone can view app icons"
      ON storage.objects
      FOR SELECT
      USING (bucket_id = 'app-icons');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Anyone can upload app icons'
  ) THEN
    CREATE POLICY "Anyone can upload app icons"
      ON storage.objects
      FOR INSERT
      WITH CHECK (bucket_id = 'app-icons');
  END IF;
END $$;
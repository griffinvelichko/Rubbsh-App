-- Create waste_images table
-- Stores metadata for waste images uploaded to storage
CREATE TABLE IF NOT EXISTS public.waste_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    storage_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT
);

-- Add comment to table
COMMENT ON TABLE public.waste_images IS 'Stores metadata for waste images uploaded to storage';

-- Create recommendations table
-- Stores waste classification recommendations and results
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    image_id UUID REFERENCES public.waste_images(id),
    error TEXT,
    error_description TEXT,
    summary TEXT,
    suggestions JSONB,
    location TEXT
);

-- Add comment to table
COMMENT ON TABLE public.recommendations IS 'Stores waste classification recommendations and results';

-- Enable Row Level Security
ALTER TABLE public.waste_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for waste images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'waste-images',
    'waste-images',
    false,
    52428800, -- 50MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
ON CONFLICT (id) DO NOTHING;

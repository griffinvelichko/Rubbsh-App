-- Add user_id columns to track ownership
-- Users can be anonymous (via Supabase anonymous auth) or permanent

-- Add user_id to waste_images
ALTER TABLE public.waste_images
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

COMMENT ON COLUMN public.waste_images.user_id IS 'The user who uploaded the image (can be anonymous or permanent user)';

-- Add user_id to recommendations
ALTER TABLE public.recommendations
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

COMMENT ON COLUMN public.recommendations.user_id IS 'The user who received the recommendation (can be anonymous or permanent user)';

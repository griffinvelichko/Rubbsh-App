-- RLS Policies for waste_images table
-- Users can only access their own images

CREATE POLICY "Users can view their own waste images"
ON public.waste_images
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own waste images"
ON public.waste_images
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own waste images"
ON public.waste_images
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for recommendations table
-- Users can only access their own recommendations

CREATE POLICY "Users can view their own recommendations"
ON public.recommendations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recommendations"
ON public.recommendations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recommendations"
ON public.recommendations
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Storage Policies for waste-images bucket
-- Users can only access files in their own folder (folder name = user_id)

CREATE POLICY "Users can view their own uploads"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'waste-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can upload to their own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'waste-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own uploads"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'waste-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own uploads"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'waste-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

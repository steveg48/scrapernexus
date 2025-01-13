-- Drop existing insert policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create new insert policy for authenticated users only
CREATE POLICY "Enable insert for authenticated users" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

-- Verify policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';

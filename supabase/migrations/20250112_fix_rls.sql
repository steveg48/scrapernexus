-- Drop existing insert policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create new insert policy that allows profile creation during signup
CREATE POLICY "Enable insert for authentication" 
ON public.profiles 
FOR INSERT 
TO authenticated, anon
WITH CHECK (auth.uid() = id);

-- Verify policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';

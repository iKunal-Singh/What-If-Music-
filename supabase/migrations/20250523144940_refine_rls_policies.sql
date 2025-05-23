-- Drop existing SELECT policies for public.profiles
DROP POLICY IF EXISTS "Allow authenticated users to view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to select their own profile" ON public.profiles;

-- Add refined SELECT policy for public.profiles
CREATE POLICY "Allow users to view profiles"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = id OR -- User can see their own profile
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' -- Admin can see all profiles
);

-- Regarding INSERT on public.profiles:
-- Supabase auth typically handles profile creation on user sign-up via a trigger on auth.users.
-- This trigger usually calls a function like `public.handle_new_user()` which inserts into `public.profiles`.
-- If direct inserts into public.profiles are needed and not covered by this default Supabase behavior
-- (e.g., if users are created via admin SDK and profile rows are not automatically made,
-- or if the `handle_new_user` function is modified or disabled),
-- an explicit INSERT policy might be required. An example could be:
--
-- CREATE POLICY "Allow users to insert their own profile"
-- ON public.profiles
-- FOR INSERT
-- WITH CHECK (
--   auth.uid() = id AND
--   NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid()) -- Only if profile doesn't exist yet
-- );
--
-- For now, relying on default Supabase mechanisms (e.g., `handle_new_user` trigger) for profile row creation.
-- Ensure such a mechanism is active and correctly configured.


-- Recommendation for Future Enhancement: Content Ownership by Editors
-- To restrict editors to manage only their own content (beats, remixes, cover_art),
-- consider the following architectural changes:
--
-- 1. Add a 'creator_id' (or 'user_id') column to 'beats', 'remixes', and 'cover_art' tables.
--    This column should reference 'auth.users(id)' or 'public.profiles(id)'.
--    Example for 'beats' table (assuming 'creator_id' links to 'auth.users(id)'):
--    ALTER TABLE public.beats ADD COLUMN creator_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
--    -- Make sure to handle existing rows, perhaps by backfilling 'creator_id' or setting a default.
--
-- 2. Update RLS policies for these content tables. For example, for 'beats' UPDATE policy:
--    -- First, drop the existing broader policy:
--    -- DROP POLICY IF EXISTS "Allow editors/admins to update beats" ON public.beats;
--
--    -- Then, create a more granular policy:
--    -- CREATE POLICY "Allow editors/admins to update their own or all content"
--    -- ON public.beats
--    -- FOR UPDATE
--    -- USING (
--    --   (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' OR -- Admin can update any beat
--    --   ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'editor' AND creator_id = auth.uid()) -- Editor can update their own beats
--    -- )
--    -- WITH CHECK ( -- The WITH CHECK clause is often similar or identical to USING for UPDATE
--    --   (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' OR
--    --   ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'editor' AND creator_id = auth.uid())
--    -- );
--
--    -- Similar adjustments would be needed for INSERT and DELETE policies for editors.
--    -- For INSERT, an editor should only be able to set 'creator_id' as their own auth.uid().
--    -- Example for 'beats' INSERT policy for editors:
--    -- CREATE POLICY "Allow editors to insert their own beats"
--    -- ON public.beats
--    -- FOR INSERT WITH CHECK (
--    --   (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'editor' AND
--    --   creator_id = auth.uid()
--    -- );
--    -- Admins would need a separate, more permissive INSERT policy or rely on bypassing RLS.
--
--    -- SELECT policies might also be refined if editors should only list their own content by default,
--    -- while admins can list all.
--
-- These changes would enable finer-grained access control, ensuring editors manage only content they created.
-- The current implementation allows any editor to modify any content.
-- Apply these changes carefully, considering data backfilling and testing thoroughly.

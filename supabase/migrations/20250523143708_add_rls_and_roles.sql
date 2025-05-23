-- User Role Setup
CREATE TYPE public.user_role_enum AS ENUM ('admin', 'editor', 'user');
ALTER TABLE public.profiles ADD COLUMN role public.user_role_enum DEFAULT 'user';
-- Note: Existing users will get the 'user' role by default. 
-- Admins/editors may need to be updated manually via Supabase dashboard or SQL.
-- e.g. UPDATE public.profiles SET role = 'admin' WHERE id = 'your_admin_user_id';

-- RLS Policies

-- Table: beats
ALTER TABLE public.beats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to beats" ON public.beats FOR SELECT USING (true);
CREATE POLICY "Allow editors/admins to insert beats" ON public.beats FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('editor', 'admin')));
CREATE POLICY "Allow editors/admins to update beats" ON public.beats FOR UPDATE USING (auth.uid() IS NOT NULL AND ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('editor', 'admin'))) WITH CHECK (auth.uid() IS NOT NULL AND ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('editor', 'admin')));
CREATE POLICY "Allow admins to delete beats" ON public.beats FOR DELETE USING (auth.uid() IS NOT NULL AND ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'));

-- Table: remixes
ALTER TABLE public.remixes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to remixes" ON public.remixes FOR SELECT USING (true);
CREATE POLICY "Allow editors/admins to insert remixes" ON public.remixes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('editor', 'admin')));
CREATE POLICY "Allow editors/admins to update remixes" ON public.remixes FOR UPDATE USING (auth.uid() IS NOT NULL AND ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('editor', 'admin'))) WITH CHECK (auth.uid() IS NOT NULL AND ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('editor', 'admin')));
CREATE POLICY "Allow admins to delete remixes" ON public.remixes FOR DELETE USING (auth.uid() IS NOT NULL AND ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'));

-- Table: cover_art
ALTER TABLE public.cover_art ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to cover_art" ON public.cover_art FOR SELECT USING (true);
CREATE POLICY "Allow editors/admins to insert cover_art" ON public.cover_art FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('editor', 'admin')));
CREATE POLICY "Allow editors/admins to update cover_art" ON public.cover_art FOR UPDATE USING (auth.uid() IS NOT NULL AND ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('editor', 'admin'))) WITH CHECK (auth.uid() IS NOT NULL AND ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('editor', 'admin')));
CREATE POLICY "Allow admins to delete cover_art" ON public.cover_art FOR DELETE USING (auth.uid() IS NOT NULL AND ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'));

-- Table: profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to view profiles" ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow users to select their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow users to update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Allow admins to delete profiles" ON public.profiles FOR DELETE USING (auth.uid() IS NOT NULL AND ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'));

-- Table: newsletter_subscribers
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public to subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admins to manage newsletter subscribers" ON public.newsletter_subscribers FOR SELECT USING (auth.uid() IS NOT NULL AND ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'));
CREATE POLICY "Allow admins to update newsletter subscribers" ON public.newsletter_subscribers FOR UPDATE USING (auth.uid() IS NOT NULL AND ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin')) WITH CHECK (auth.uid() IS NOT NULL AND ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'));
CREATE POLICY "Allow admins to delete newsletter subscribers" ON public.newsletter_subscribers FOR DELETE USING (auth.uid() IS NOT NULL AND ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'));

-- Table: downloads
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public to record downloads" ON public.downloads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admins to view download records" ON public.downloads FOR SELECT USING (auth.uid() IS NOT NULL AND ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'));
CREATE POLICY "Allow admins to update download records" ON public.downloads FOR UPDATE USING (auth.uid() IS NOT NULL AND ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin')) WITH CHECK (auth.uid() IS NOT NULL AND ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'));
CREATE POLICY "Allow admins to delete download records" ON public.downloads FOR DELETE USING (auth.uid() IS NOT NULL AND ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'));

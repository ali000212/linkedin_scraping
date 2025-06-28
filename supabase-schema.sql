-- Create companies table
CREATE TABLE IF NOT EXISTS public.companies (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  apollo_id text NOT NULL,
  name text NOT NULL,
  data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create employee_cache table
CREATE TABLE IF NOT EXISTS public.employee_cache (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id text NOT NULL,
  company_name text NOT NULL,
  query text,
  regions jsonb DEFAULT '[]'::jsonb NOT NULL,
  employees jsonb NOT NULL,
  cached_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.employee_cache ENABLE ROW LEVEL SECURITY;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS company_query_regions_idx 
ON public.employee_cache (company_id, query, (regions::text));

-- Create policy to allow all operations (for demo purposes)
CREATE POLICY "Allow all operations for all users" ON public.companies
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for all users" ON public.employee_cache
  FOR ALL USING (true) WITH CHECK (true);

-- Instructions:
-- 1. Go to https://lcvaxhorthtootarlsnh.supabase.co
-- 2. Navigate to SQL Editor
-- 3. Paste this script and run it
-- 4. Tables will be created automatically 
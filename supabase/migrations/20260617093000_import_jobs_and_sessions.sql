-- conversion_jobs: tracks asynchronous AI parsing jobs
CREATE TABLE public.conversion_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  progress INTEGER NOT NULL DEFAULT 0,
  sections JSONB NOT NULL DEFAULT '{}'::jsonb,
  diagnostics JSONB NOT NULL DEFAULT '{}'::jsonb,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX conversion_jobs_user_idx ON public.conversion_jobs(user_id, created_at DESC);
CREATE INDEX conversion_jobs_resume_idx ON public.conversion_jobs(resume_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversion_jobs TO authenticated;
GRANT ALL ON public.conversion_jobs TO service_role;

ALTER TABLE public.conversion_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own conversion jobs" ON public.conversion_jobs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- resume_import_sessions: permanent archive of original parsing and diagnostics data
CREATE TABLE public.resume_import_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_pdf_path TEXT,
  raw_text TEXT,
  preprocessed_blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  ai_output JSONB NOT NULL DEFAULT '{}'::jsonb,
  reviewed_output JSONB NOT NULL DEFAULT '{}'::jsonb,
  diagnostics JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX resume_import_sessions_user_idx ON public.resume_import_sessions(user_id, created_at DESC);
CREATE INDEX resume_import_sessions_resume_idx ON public.resume_import_sessions(resume_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.resume_import_sessions TO authenticated;
GRANT ALL ON public.resume_import_sessions TO service_role;

ALTER TABLE public.resume_import_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own import sessions" ON public.resume_import_sessions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- trigger to auto update updated_at on conversion_jobs
CREATE TRIGGER conversion_jobs_touch BEFORE UPDATE ON public.conversion_jobs
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

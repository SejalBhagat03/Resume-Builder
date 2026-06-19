-- uploads: tracks every PDF uploaded by users
CREATE TABLE public.uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
  storage_path TEXT NOT NULL,
  original_filename TEXT,
  file_size_bytes INTEGER,
  mime_type TEXT DEFAULT 'application/pdf',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX uploads_user_idx ON public.uploads(user_id, created_at DESC);

GRANT SELECT, INSERT, DELETE ON public.uploads TO authenticated;
GRANT ALL ON public.uploads TO service_role;

ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own uploads" ON public.uploads
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ai_history: audit log of all AI calls per user (for rate limiting & analytics)
CREATE TABLE public.ai_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- e.g. 'generate-summary', 'job-match', 'improve-bullet'
  tokens_used INTEGER,  -- optional, for future token tracking
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ai_history_user_idx ON public.ai_history(user_id, created_at DESC);

GRANT SELECT, INSERT ON public.ai_history TO authenticated;
GRANT ALL ON public.ai_history TO service_role;

ALTER TABLE public.ai_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own ai history" ON public.ai_history
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

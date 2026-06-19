# Resume Builder Backend

Production-ready Express + TypeScript backend powering the Resume Builder Pro application.

## Prerequisites

- Node.js 18+
- A Supabase project (same one the frontend uses)
- A Google Gemini API key

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in:

| Variable                    | Where to get it                                                 |
| --------------------------- | --------------------------------------------------------------- |
| `SUPABASE_URL`              | Supabase Dashboard → Settings → API → Project URL               |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → `service_role` secret key |
| `GEMINI_API_KEY`            | [Google AI Studio](https://aistudio.google.com/app/apikey)      |
| `FRONTEND_URL`              | `http://localhost:3000` for local dev                           |

> ⚠️ **Important**: Use the **service role** key, NOT the anon/publishable key. The service role key allows the backend to verify JWTs and access the database as admin.

### 3. Run the database migration

Apply the new migration that adds the `uploads` and `ai_history` tables:

```bash
# From the project root (not /backend)
npx supabase db push
# Or apply it manually in Supabase SQL Editor
```

### 4. Create Supabase Storage bucket

In your Supabase dashboard, go to Storage and create a bucket named `imported_resumes` (set it to private).

### 5. Start development server

```bash
# From /backend directory
npm run dev
```

The server starts on `http://localhost:4000`.

### 6. Start frontend (in another terminal)

```bash
# From project root
npm run dev
```

The frontend starts on `http://localhost:3000`.

---

## API Reference

### Health

```
GET /health
```

### Resumes (all require Authorization header)

```
GET    /api/resumes              List all resumes (paginated)
GET    /api/resumes/:id          Get single resume
GET    /api/resumes/:id/versions Get version history
POST   /api/resumes              Create resume
PUT    /api/resumes/:id          Update resume (auto-saves version)
DELETE /api/resumes/:id          Soft-delete resume
```

### AI (all require Authorization header)

```
POST /api/ai/generate-summary          Generate professional summary
POST /api/ai/improve-bullet            Rewrite a bullet point
POST /api/ai/rewrite-section           Rewrite a resume section
POST /api/ai/job-match                 Score resume vs job description
POST /api/ai/review                    Full ATS review
POST /api/ai/interview                 Generate interview questions
POST /api/ai/convert-imported-resume   Parse raw text → structured data
POST /api/ai/suggest-skills            Suggest missing skills
```

### Upload (requires Authorization header)

```
POST /api/upload/pdf    Upload PDF (multipart/form-data, field: "file")
```

---

## Response Format

All endpoints return:

```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "message": "...", "code": "ERROR_CODE" }
```

---

## Scripts

```bash
npm run dev     # Start with hot-reload (tsx watch)
npm run build   # Compile TypeScript → dist/
npm start       # Run compiled output
```

---

## Security Notes

- API keys (`GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) are never exposed to the frontend
- All routes verify Supabase JWT — user IDs are never trusted from request bodies
- CORS is restricted to `FRONTEND_URL`
- Rate limiting: 100 req/15min general, 20/min for AI, 10/5min for uploads
- Upload validation: MIME type, file size (10MB max), PDF magic bytes

# S1 Student Attendance

A student attendance form with a password-protected admin dashboard, built
the same way as the S2 version (Next.js on Vercel).

- `/` — students fill in their name, matric number, group, and date, and submit.
- `/admin` — password-gated view of all submissions, with a "Reset all" button
  to clear responses for a new session.

The admin password is **`S1Surgical2026`** by default (see "Changing the
password" below).

## Deploy to Vercel (takes about 5 minutes)

1. **Push this folder to a GitHub repo** (create a new repo, e.g.
   `s1-student-attendance-form`, and push these files to it).
2. **Import it on Vercel**: go to vercel.com → "Add New… → Project" → import
   the repo. Leave the default settings and click Deploy once (it will build,
   though attendance won't save until step 3 is done).
3. **Add a KV (Redis) store** — this is what stores the submissions:
   - In your Vercel project, go to the **Storage** tab → **Create Database** →
     choose **KV** (powered by Upstash) → create it and **connect it to this
     project**. Vercel adds the required `KV_*` environment variables for you
     automatically.
4. **Redeploy** the project (Deployments tab → ⋯ → Redeploy) so it picks up
   the new environment variables.
5. Your site will be live at something like
   `https://s1-student-attendance-form.vercel.app`, with the admin dashboard
   at `.../admin`.

## Changing the password

The password defaults to `S1Surgical2026` if no environment variable is set.
To change it: in Vercel, go to Project Settings → Environment Variables, add
`ADMIN_PASSWORD` with your chosen value, and redeploy.

## Local development

```bash
npm install
cp .env.local.example .env.local   # fill in the KV_* values from Vercel
npm run dev
```

## Notes

- The admin password check happens on the server (inside the API routes), so
  it isn't visible in the page's client-side code.
- "Reset all" permanently deletes every stored submission — there's a
  confirmation prompt before it runs.

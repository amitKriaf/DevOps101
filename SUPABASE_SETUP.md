# Supabase Setup — Login & Cloud Sync

This adds login + cross-device progress sync to the Field Manual. Free tier is generous; setup takes ~10 minutes. You do the steps below; then paste two values into `config.js` and the app takes it from there.

Until you complete this, the app keeps working normally with localStorage — you just won't see the login button.

## 1. Create a project

1. Go to **[supabase.com](https://supabase.com)** and sign up (GitHub sign-in is fastest).
2. Click **New project**.
3. Give it any name (e.g. `devops-manual`).
4. Set a database password — save it somewhere; you won't need it often.
5. Pick a region close to you.
6. Click **Create new project**. Wait ~1 min for provisioning.

## 2. Run the schema

Once the project is ready:

1. Left sidebar → **SQL Editor**.
2. Click **New query**.
3. Paste the SQL below in full.
4. Click **Run** (or Cmd+Enter).

```sql
-- One row per user: their entire manual state as JSON columns.
create table public.progress (
  user_id     uuid       primary key references auth.users on delete cascade,
  progress    jsonb      not null default '{}'::jsonb,
  part_exams  jsonb      not null default '{}'::jsonb,
  defs_seen   jsonb      not null default '[]'::jsonb,
  visits      jsonb      not null default '[]'::jsonb,
  folded      jsonb      not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- Row-level security: each user can only see and modify their own row.
alter table public.progress enable row level security;

create policy "read own"   on public.progress for select using (auth.uid() = user_id);
create policy "insert own" on public.progress for insert with check (auth.uid() = user_id);
create policy "update own" on public.progress for update using (auth.uid() = user_id);

-- Auto-touch updated_at whenever a row changes.
create or replace function public.touch_progress_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger progress_touch
  before update on public.progress
  for each row execute function public.touch_progress_updated_at();
```

You should see `Success. No rows returned.` if it worked.

## 3. Turn off "confirm email" (for personal use)

For a personal learning app it's less friction to skip email confirmation.

1. Left sidebar → **Authentication**.
2. Under **CONFIGURATION**, click **Sign In / Providers** *(older UIs called this "Providers")*.
3. Find **Email** in the providers list and click to expand it.
4. Turn off **Confirm email** *(may also appear as "Enable email confirmations" — you want it OFF)*.
5. Click **Save** at the bottom.

*(For a real multi-user product you'd keep this on. Fine to turn off for your own account.)*

## 4. Get your URL and anon key

1. Left sidebar → gear icon (**Project Settings**) → **API**.
2. Copy the two values:
   - **Project URL** — e.g. `https://abcdefghijklmno.supabase.co`
   - **anon public** key — a long JWT starting with `eyJ...`
     - This one is safe to put in the frontend. It only lets a caller do what your RLS policies allow.

## 5. Paste them into `config.js`

Open `config.js` in the project folder. It looks like:

```js
window.APP_CONFIG = {
  SUPABASE_URL:      "https://YOUR-PROJECT.supabase.co",
  SUPABASE_ANON_KEY: "YOUR-ANON-KEY",
};
```

Replace both strings with the values from step 4. Save.

## 6. Reload the app

Refresh `index.html` (regular Cmd+R). You'll see a **Sign in** link in the masthead.

- Click **Create account**, enter your email + a password.
- Log in.
- Your progress will now sync to Supabase — visible from any device where you log in with the same account.

**First-time sign-in tip:** if you already had progress in localStorage, the app will ask whether to import it to your new cloud account. Say yes, once.

## Notes

- **You can undo the setup any time** by clearing your `config.js` values back to placeholders — the app falls back to localStorage-only mode.
- **Multiple accounts:** each account has its own separate progress. Handy if you want a "clean slate" vs. your main progress.
- **Free tier limits** are: 500 MB DB, 50k monthly active users, 5 GB bandwidth. This app's progress row is ~1 KB per user. You won't come close.
- **Serve via HTTP for smoother auth:** open `http://localhost:8000` with `python3 -m http.server 8000` in the project directory. `file://` works but has quirks with the auth redirect flow.

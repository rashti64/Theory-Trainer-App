-- Theory Trainer: initial schema.
-- Run in the Supabase project (EU region) via the SQL editor or `supabase db push`.
-- Every table has row-level security on; the app only ever uses the publishable key.

-- ── Catalog ──────────────────────────────────────────────────────────────────
-- Licensed question data from TÜV | DEKRA arge tp 21, imported by scripts/import-catalog.
-- Readable by signed-in learners; written only by the import pipeline (service role).

create table public.catalog_versions (
  version text primary key,              -- e.g. '2025-04'
  valid_from date not null,
  valid_until date,
  is_placeholder boolean not null default false,
  published_at timestamptz,              -- null = imported but not live yet
  created_at timestamptz not null default now()
);

create table public.questions (
  catalog_version text not null references public.catalog_versions (version) on delete cascade,
  id text not null,                      -- official number, e.g. '1.1.02-001'
  topic_id text not null,
  section text not null check (section in ('basic', 'class')),
  classes text[] not null check (cardinality(classes) > 0),
  points smallint not null check (points between 2 and 5),
  kind text not null check (kind in ('multiple-choice', 'number')),
  content jsonb not null,                -- prompt, options, number answer, explanation per language
  media jsonb,                           -- storage paths for images and videos
  variant_of text,
  primary key (catalog_version, id)
);

create index questions_topic_idx on public.questions (catalog_version, topic_id);

alter table public.catalog_versions enable row level security;
alter table public.questions enable row level security;

create policy "Signed-in users read published catalogs"
  on public.catalog_versions for select to authenticated
  using (published_at is not null);

create policy "Signed-in users read questions of published catalogs"
  on public.questions for select to authenticated
  using (exists (
    select 1 from public.catalog_versions v
    where v.version = questions.catalog_version and v.published_at is not null
  ));

-- ── Learner data ─────────────────────────────────────────────────────────────

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  locale text not null default 'de',
  exam_date date,
  created_at timestamptz not null default now()
);

-- v1 sync: one JSON snapshot of the learner's state, last write wins (see src/lib/sync.ts).
create table public.user_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;

create policy "Users manage their own profile"
  on public.profiles for all to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Users manage their own progress"
  on public.user_progress for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Create a profile row for every new account.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Account deletion (required by Google Play): deleting the auth user cascades
-- to profiles and user_progress. Exposed to the app as an RPC for the signed-in user.
create function public.delete_my_account()
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  delete from auth.users where id = (select auth.uid());
end;
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
